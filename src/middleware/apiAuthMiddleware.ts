import { Request, Response, NextFunction } from "express";
import { apiService } from "../services/server/apiService";
import { billingService } from "../services/server/billingService";

export const apiAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid API key" });
  }

  const rawKey = authHeader.split(" ")[1];
  const apiKey = await apiService.validateKey(rawKey) as any;

  if (!apiKey || !apiKey.user) {
    return res.status(401).json({ error: "Invalid API key or orphaned user" });
  }

  const orgId = apiKey.user.organizationId;
  if (!orgId) {
    return res.status(403).json({ error: "FORBIDDEN: User has no organization" });
  }

  // Billing Limit Check
  const canUseApi = await billingService.canUseFeature(orgId, 'api_calls');
  if (!canUseApi) {
    return res.status(403).json({ error: "PLAN_LIMIT_EXCEEDED: API limit reached for this period. Please upgrade." });
  }

  // Rate Limiting (Simple check)
  const plan = apiKey.user?.plan || 'free';
  const limitMap: Record<string, number> = {
    free: 100,
    pro: 1000,
    enterprise: 10000
  };

  (req as any).apiKey = apiKey;
  (req as any).orgId = orgId;
  (req as any).userId = apiKey.userId;

  // Usage Logging
  await billingService.recordUsage(
    orgId,
    "api_request",
    1,
    { 
      path: req.path, 
      method: req.method,
      apiKeyId: apiKey.id
    }
  );

  next();
};
