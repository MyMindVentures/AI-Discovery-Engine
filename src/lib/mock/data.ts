// Fallback mock data for demo mode
export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  country: string;
  city: string;
  size: string;
  website: string;
  description: string;
  tags: string[];
  technologies: string[];
  status: 'active' | 'pending' | 'archived';
  score: number;
  confidenceScore: number;
  sourceCount: number;
  metadata?: any;
  embedding?: any;
}

export interface SearchJob {
  id: string;
  query: string;
  date: string;
  resultsCount: number;
  status: 'completed' | 'processing' | 'failed';
  type?: 'search' | 'scraping' | 'enrichment';
}

export interface Stat {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface MonitoringAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'warning' | 'success';
}

export interface MonitoringJob {
  id: string;
  name: string;
  query: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  sources: string[];
  status: 'active' | 'paused' | 'failed';
  lastRun: string | null;
  nextRun: string;
  resultsChange: number;
  createdAt: string;
}

export interface ExportJob {
  id: string;
  name: string;
  type: 'CSV' | 'XLSX' | 'JSON' | 'Airtable' | 'Sheets' | 'Notion';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'completed';
  lastRun: string | null;
  nextRun: string | null;
  destination: string;
}

export interface ExportHistory {
  id: string;
  name: string;
  type: 'CSV' | 'XLSX' | 'JSON' | 'Airtable' | 'Sheets' | 'Notion';
  date: string;
  status: 'success' | 'failed' | 'processing';
  resultsCount: number;
  fileSize?: string;
}

export interface ScrapingJob {
  id: string;
  source: 'Apify' | 'Firecrawl' | 'PhantomBuster' | 'Google Places' | 'Playwright';
  prompt: string;
  status: 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  recordsFound: number;
  recordsCreated: number;
  duplicates: number;
  errorMessage?: string;
}

export const mockScrapingJobs: ScrapingJob[] = [
  {
    id: 'sj1',
    source: 'Apify',
    prompt: 'Extract SaaS pricing from top 50 CRM websites',
    status: 'completed',
    startedAt: '2026-05-12 14:00',
    completedAt: '2026-05-12 14:45',
    recordsFound: 540,
    recordsCreated: 480,
    duplicates: 60
  },
  {
    id: 'sj2',
    source: 'Firecrawl',
    prompt: 'Crawl LinkedIn profiles for "VP of Engineering" in London',
    status: 'running',
    startedAt: '2026-05-12 19:15',
    recordsFound: 120,
    recordsCreated: 85,
    duplicates: 35
  },
  {
    id: 'sj3',
    source: 'Google Places',
    prompt: 'Find newly opened co-working spaces in Berlin',
    status: 'failed',
    startedAt: '2026-05-12 10:00',
    completedAt: '2026-05-12 10:05',
    recordsFound: 0,
    recordsCreated: 0,
    duplicates: 0,
    errorMessage: 'API Key Quota Exceeded'
  },
  {
    id: 'sj4',
    source: 'PhantomBuster',
    prompt: 'Extract followers from @neuralwave_ai Twitter',
    status: 'paused',
    startedAt: '2026-05-11 08:00',
    recordsFound: 1200,
    recordsCreated: 1200,
    duplicates: 0
  },
  {
    id: 'sj5',
    source: 'Playwright',
    prompt: 'Custom scraper for specialized academic research papers',
    status: 'cancelled',
    startedAt: '2026-05-12 16:00',
    completedAt: '2026-05-12 16:30',
    recordsFound: 45,
    recordsCreated: 30,
    duplicates: 15
  }
];

export interface SavedList {
  id: string;
  name: string;
  description?: string;
  count: number;
  lastModified: string;
  isShared: boolean;
  tags: string[];
  companyIds: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'platform_admin';
  status: 'active' | 'suspended';
  lastSeen: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface SystemLog {
  id: string;
  action: string;
  target: string;
  admin: string;
  time: string;
  type: 'security' | 'database' | 'system' | 'billing';
}

export const mockUsers: User[] = [
  { id: 'u1', name: 'Alex River', email: 'alex@example.com', role: 'platform_admin', status: 'active', lastSeen: '2m ago', plan: 'enterprise' },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@design.io', role: 'user', status: 'active', lastSeen: '14m ago', plan: 'pro' },
  { id: 'u3', name: 'Mike Ross', email: 'mike@legal.com', role: 'user', status: 'active', lastSeen: '1h ago', plan: 'free' },
  { id: 'u4', name: 'Elena V', email: 'elena@tech.eu', role: 'user', status: 'suspended', lastSeen: '2d ago', plan: 'pro' },
];

export const mockSystemLogs: SystemLog[] = [
  { id: 'sl1', action: 'API Key Rotated', target: 'Environment', admin: 'system', time: '12m ago', type: 'security' },
  { id: 'sl2', action: 'User Suspension', target: 'u4', admin: 'admin_1', time: '1h ago', type: 'security' },
  { id: 'sl3', action: 'Shard Rebalancing', target: 'DB Cluster A', admin: 'system', time: '2h ago', type: 'database' },
  { id: 'sl4', action: 'Invoice Generated', target: 'org_83', admin: 'billing_bot', time: '4h ago', type: 'billing' },
  { id: 'sl5', action: 'Schema Update', target: 'Companies', admin: 'admin_2', time: '1d ago', type: 'database' },
];

export const adminStats = [
  { label: 'Monthly Recurring Revenue', value: '$142,850', change: '+12.4%', trend: 'up' as const },
  { label: 'Active Sessions', value: '4,280', change: '+18%', trend: 'up' as const },
  { label: 'Scraping Success', value: '98.2%', change: '-0.4%', trend: 'down' as const },
  { label: 'Estimated API Costs', value: '$8,420', change: '+2%', trend: 'up' as const },
  { label: 'AI Token Load', value: '14.2M/day', change: '+42%', trend: 'up' as const },
  { label: 'Global Exports', value: '1,842', change: '+5%', trend: 'up' as const },
];

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'NeuralWave AI',
    industry: 'Software Development',
    location: 'Berlin, Germany',
    country: 'Germany',
    city: 'Berlin',
    size: '11-50 employees',
    website: 'https://neuralwave.ai',
    description: 'Specializing in next-gen neural network optimization for edge devices.',
    tags: ['AI', 'Edge Computing', 'Deep Learning'],
    technologies: ['PyTorch', 'Rust', 'WebAssembly', 'NVIDIA TensorRT'],
    status: 'active',
    score: 92,
    confidenceScore: 98,
    sourceCount: 8,
  },
  {
    id: '2',
    name: 'GreenScale Systems',
    industry: 'CleanTech',
    location: 'London, UK',
    country: 'UK',
    city: 'London',
    size: '51-200 employees',
    website: 'https://greenscale.io',
    description: 'Automated sustainability auditing and reporting for enterprise supply chains.',
    tags: ['SaaS', 'Sustainability', 'Supply Chain'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    status: 'active',
    score: 88,
    confidenceScore: 94,
    sourceCount: 5,
  },
  {
    id: '3',
    name: 'DataForge Lab',
    industry: 'Data Services',
    location: 'Paris, France',
    country: 'France',
    city: 'Paris',
    size: '1-10 employees',
    website: 'https://dataforge.lab',
    description: 'Precision data labeling and synthesis for specialized academic research.',
    tags: ['Research', 'Data Engineering'],
    technologies: ['Python', 'Kubernetes', 'DVC', 'Label Studio'],
    status: 'pending',
    score: 75,
    confidenceScore: 82,
    sourceCount: 3,
  },
  {
    id: '4',
    name: 'SkyLink Robotics',
    industry: 'Aerospace',
    location: 'Munich, Germany',
    country: 'Germany',
    city: 'Munich',
    size: '201-500 employees',
    website: 'https://skylink.com',
    description: 'Autonomous delivery drone networks for last-mile logistics in urban areas.',
    tags: ['Robotics', 'Logistics', 'Hardware'],
    technologies: ['C++', 'ROS 2', 'Golang', 'Azure'],
    status: 'active',
    score: 95,
    confidenceScore: 99,
    sourceCount: 12,
  },
  {
    id: '5',
    name: 'FinFlow Intelligence',
    industry: 'FinTech',
    location: 'New York, USA',
    country: 'USA',
    city: 'New York',
    size: '51-200 employees',
    website: 'https://finflow.ai',
    description: 'Real-time financial anomaly detection using federated learning.',
    tags: ['FinTech', 'Security', 'Federated Learning'],
    technologies: ['TensorFlow', 'Apache Kafka', 'MongoDB'],
    status: 'active',
    score: 89,
    confidenceScore: 91,
    sourceCount: 7,
  },
  {
    id: '6',
    name: 'BioSynthetix',
    industry: 'BioTech',
    location: 'Boston, USA',
    country: 'USA',
    city: 'Boston',
    size: '11-50 employees',
    website: 'https://biosynthetix.com',
    description: 'Synthetic biology platform for carbon-neutral material production.',
    tags: ['BioTech', 'Climate', 'Synthetic Biology'],
    technologies: ['React Native', 'Django', 'GraphQL'],
    status: 'active',
    score: 84,
    confidenceScore: 88,
    sourceCount: 4,
  }
];

export const mockSearches: SearchJob[] = [
  { id: 's1', query: 'AI app studios in Europe', date: '2026-05-10', resultsCount: 142, status: 'completed', type: 'search' },
  { id: 's2', query: 'CleanTech startups London', date: '2026-05-11', resultsCount: 85, status: 'completed', type: 'search' },
  { id: 's3', query: 'Fintech Series A founders NYC', date: '2026-05-12', resultsCount: 210, status: 'processing', type: 'scraping' },
  { id: 's4', query: 'Manufacturing IoT Ohio', date: '2026-05-12', resultsCount: 45, status: 'processing', type: 'enrichment' },
];

export const mockStats: Stat[] = [
  { label: 'Total Companies', value: '5,420', change: '+14%', trend: 'up' },
  { label: 'Enriched Contacts', value: '12,842', change: '+8%', trend: 'up' },
  { label: 'Active Jobs', value: '12', change: '+2', trend: 'up' },
  { label: 'Monthly Exports', value: '84', change: '-4%', trend: 'down' },
  { label: 'Enrichment Credits', value: '4,250', change: '85%', trend: 'neutral' },
  { label: 'API Usage', value: '1.2M', change: '+22%', trend: 'up' },
  { label: 'Monitoring Jobs', value: '42', change: 'Stable', trend: 'neutral' },
  { label: 'Success Rate', value: '99.2%', change: '+0.1%', trend: 'up' },
];

export const mockAlerts: MonitoringAlert[] = [
  { id: 'a1', title: 'New Funding Detected', description: 'NeuralWave AI raised Series B of $45M', time: '2h ago', type: 'success' },
  { id: 'a2', title: 'Website Down', description: 'DataForge Lab website is currently unreachable', time: '5h ago', type: 'warning' },
  { id: 'a3', title: 'Job Posting Added', description: 'SkyLink Robotics is hiring a Head of AI', time: '1d ago', type: 'info' },
];

export const mockLists: SavedList[] = [
  { 
    id: 'l1', 
    name: 'High-Growth AI Research', 
    description: 'Target list for specialized neural network startups in Central Europe.',
    count: 3, 
    lastModified: '2026-05-10',
    isShared: false,
    tags: ['AI', 'Research', 'Europe'],
    companyIds: ['1', '4', '5']
  },
  { 
    id: 'l2', 
    name: 'Sustainability Leaders', 
    description: 'Companies leading the transition to carbon-neutral manufacturing.',
    count: 2, 
    lastModified: '2026-05-11',
    isShared: true,
    tags: ['Impact', 'CleanTech'],
    companyIds: ['2', '6']
  },
  { 
    id: 'l3', 
    name: 'FinTech Disruptors', 
    description: 'Early stage fintech companies focusing on decentralized finance and security.',
    count: 1, 
    lastModified: '2026-05-12',
    isShared: false,
    tags: ['Finance', 'DeFi'],
    companyIds: ['5']
  },
];

export const mockMonitoringJobs: MonitoringJob[] = [
  {
    id: 'm1',
    name: 'European AI Talent Shift',
    query: 'AI Researchers changing roles in Germany/France',
    frequency: 'daily',
    sources: ['LinkedIn', 'GitHub', 'ResearchGate'],
    status: 'active',
    lastRun: '2026-05-12 08:00',
    nextRun: '2026-05-13 08:00',
    resultsChange: 12,
    createdAt: '2026-04-15'
  },
  {
    id: 'm2',
    name: 'CleanTech Series A Alerts',
    query: 'Companies in CleanTech raising Series A in UK',
    frequency: 'weekly',
    sources: ['Crunchbase', 'Pitchbook', 'News APIs'],
    status: 'active',
    lastRun: '2026-05-08 12:00',
    nextRun: '2026-05-15 12:00',
    resultsChange: 3,
    createdAt: '2026-05-01'
  },
  {
    id: 'm3',
    name: 'SaaS Competitor Pricing',
    query: 'Pricing updates for top 10 CRM competitors',
    frequency: 'monthly',
    sources: ['Web Scraping', 'Social Media'],
    status: 'paused',
    lastRun: '2026-05-01 09:00',
    nextRun: '2026-06-01 09:00',
    resultsChange: 0,
    createdAt: '2026-03-20'
  }
];

export const mockExportHistory: ExportHistory[] = [
  {
    id: 'eh1',
    name: 'Q2 Strategy - EU AI Studios',
    type: 'CSV',
    date: '2026-05-12 14:30',
    status: 'success',
    resultsCount: 142,
    fileSize: '2.4 MB'
  },
  {
    id: 'eh2',
    name: 'FinTech Leads - NYC',
    type: 'JSON',
    date: '2026-05-11 10:15',
    status: 'success',
    resultsCount: 210,
    fileSize: '1.1 MB'
  },
  {
    id: 'eh3',
    name: 'Sustainability Deep Dive',
    type: 'Sheets',
    date: '2026-05-12 16:45',
    status: 'processing',
    resultsCount: 85
  },
  {
    id: 'eh4',
    name: 'Weekly Talent Migration',
    type: 'Airtable',
    date: '2026-05-10 08:00',
    status: 'failed',
    resultsCount: 0
  }
];

export const mockExportJobs: ExportJob[] = [
  {
    id: 'ej1',
    name: 'Daily AI Talent Sync',
    type: 'Notion',
    frequency: 'daily',
    status: 'active',
    lastRun: '2026-05-12 08:00',
    nextRun: '2026-05-13 08:00',
    destination: 'Recruitment Database'
  },
  {
    id: 'ej2',
    name: 'Weekly CleanTech Update',
    type: 'Sheets',
    frequency: 'weekly',
    status: 'active',
    lastRun: '2026-05-08 12:00',
    nextRun: '2026-05-15 12:00',
    destination: 'Market Intelligence Spreadsheet'
  }
];

export interface IpEvidenceRecord {
  id: string;
  organizationId: string;
  title: string;
  type: 'concept' | 'design' | 'code' | 'prompt' | 'document' | 'asset' | 'workflow' | 'communication' | 'release';
  description?: string;
  filePath?: string;
  repositoryUrl?: string;
  commitHash?: string;
  timestampProvider?: string;
  timestampProofUrl?: string;
  status: 'draft' | 'documented' | 'timestamped' | 'archived';
  createdByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockIpEvidence: IpEvidenceRecord[] = [
  {
    id: 'ev_1',
    organizationId: 'org_parallax',
    title: 'Neural Synthesis Core Architecture',
    type: 'design',
    description: 'Original blueprints for the neural enrichment pipeline.',
    status: 'timestamped',
    commitHash: '7f3e1a2',
    timestampProvider: 'OpenTimestamps',
    createdAt: '2026-03-15T10:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z'
  },
  {
    id: 'ev_2',
    organizationId: 'org_parallax',
    title: 'Discovery Protocol v1.0',
    type: 'code',
    description: 'Source code for the initial discovery engine implementation.',
    status: 'documented',
    repositoryUrl: 'https://github.com/parallax-studio/ai-discovery-engine',
    createdAt: '2026-04-01T14:30:00Z',
    updatedAt: '2026-04-01T14:30:00Z'
  },
  {
    id: 'ev_3',
    organizationId: 'org_parallax',
    title: 'Brand Identity System',
    type: 'asset',
    description: 'Visual brand guidelines and master assets.',
    status: 'timestamped',
    timestampProvider: 'Parallax Internal Registry',
    createdAt: '2026-02-20T09:00:00Z',
    updatedAt: '2026-02-20T09:00:00Z'
  }
];

export const initialAiConfigs = [
  { id: '1', key: 'queryPlanner', name: 'Query Planner', description: 'Plans search strategies', provider: 'google', model: 'gemini-1.5-pro', enabled: true },
  { id: '2', key: 'companyEnrichment', name: 'Company Enrichment', description: 'Extracts company details', provider: 'google', model: 'gemini-1.5-flash', enabled: true },
  { id: '3', key: 'feedbackTransformation', name: 'Feedback Transformation', description: 'Cleans up user feedback', provider: 'google', model: 'gemini-1.5-flash', enabled: true },
];
