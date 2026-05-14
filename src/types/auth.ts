export enum UserRole {
  GUEST = 'guest',
  FREE_USER = 'free_user',
  PRO_USER = 'pro_user',
  TEAM_MEMBER = 'team_member',
  TEAM_ADMIN = 'team_admin',
  ENTERPRISE_USER = 'enterprise_user',
  PLATFORM_ADMIN = 'platform_admin'
}

export type Capability = 
  | 'ai_search'
  | 'deep_search'
  | 'exports'
  | 'monitoring_jobs'
  | 'api_access'
  | 'billing'
  | 'admin_access'
  | 'scraping_controls';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  avatar?: string;
}

export const PERMISSION_MATRIX: Record<UserRole, Capability[]> = {
  [UserRole.GUEST]: ['ai_search'],
  [UserRole.FREE_USER]: ['ai_search', 'billing'],
  [UserRole.PRO_USER]: ['ai_search', 'deep_search', 'exports', 'monitoring_jobs', 'billing'],
  [UserRole.TEAM_MEMBER]: ['ai_search', 'deep_search', 'exports', 'monitoring_jobs', 'billing'],
  [UserRole.TEAM_ADMIN]: ['ai_search', 'deep_search', 'exports', 'monitoring_jobs', 'billing', 'api_access'],
  [UserRole.ENTERPRISE_USER]: [
    'ai_search', 
    'deep_search', 
    'exports', 
    'monitoring_jobs', 
    'billing', 
    'api_access', 
    'scraping_controls'
  ],
  [UserRole.PLATFORM_ADMIN]: [
    'ai_search', 
    'deep_search', 
    'exports', 
    'monitoring_jobs', 
    'billing', 
    'api_access', 
    'scraping_controls',
    'admin_access'
  ],
};
