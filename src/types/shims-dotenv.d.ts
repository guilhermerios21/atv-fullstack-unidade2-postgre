declare module 'dotenv' {
  export function config(options?: any): { error?: Error; parsed?: Record<string, string> };
}
