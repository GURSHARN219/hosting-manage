export interface Site {
  id: string;
  name: string;
  port: number;
  status: 'running' | 'stopped' | 'error';
  path: string;
  type: 'node' | 'static' | 'php' | 'python';
  homePage: string;
  serverFile?: string;
  installerFile?: string;
  env: Record<string, string>;
  dependencies: string[];
  autoStart: boolean;
  ssl: {
    enabled: boolean;
    type: 'letsencrypt' | 'custom';
    certificate?: string;
    privateKey?: string;
  };
  domain: {
    custom: boolean;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SiteStats {
  id: string;
  siteId: string;
  uptime: number;
  lastChecked: string;
  responseTime: number;
  cpu: number;
  memory: number;
  bandwidth: {
    in: number;
    out: number;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark';
  notifications: {
    desktop: boolean;
    email: boolean;
    emailAddress?: string;
  };
  autoStart: boolean;
  backupPath: string;
  backupSchedule: 'daily' | 'weekly' | 'monthly';
  defaultPort: number;
  sslProvider: 'letsencrypt' | 'custom';
}