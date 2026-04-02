import 'server-only';

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

function requiredInt(raw: string, key: string): number {
  const value = parseInt(raw, 10);
  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${key} must be a valid integer, got: "${raw}"`);
  }
  return value;
}

function requiredFloat(raw: string, key: string): number {
  const value = parseFloat(raw);
  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${key} must be a valid number, got: "${raw}"`);
  }
  return value;
}

export const config = {
  database: {
    url: required("DATABASE_URL"),
  },
  auth: {
    url: required("NEXTAUTH_URL"),
    secret: required("NEXTAUTH_SECRET"),
    github: {
      clientId: optional("GITHUB_CLIENT_ID", ""),
      clientSecret: optional("GITHUB_CLIENT_SECRET", ""),
    },
    google: {
      clientId: optional("GOOGLE_CLIENT_ID", ""),
      clientSecret: optional("GOOGLE_CLIENT_SECRET", ""),
    },
  },
  email: {
    apiKey: optional("RESEND_API_KEY", ""),
    fromEmail: optional("RESEND_FROM_EMAIL", "noreply@ruleset.dev"),
  },
  app: {
    url: optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  },
  upload: {
    maxSizeBytes: requiredInt(optional("UPLOAD_MAX_SIZE_BYTES", "52428800"), "UPLOAD_MAX_SIZE_BYTES"),
  },
  commission: {
    standard: requiredFloat(optional("STANDARD_COMMISSION_RATE", "0.15"), "STANDARD_COMMISSION_RATE"),
    pro: requiredFloat(optional("PRO_COMMISSION_RATE", "0.08"), "PRO_COMMISSION_RATE"),
  },
} as const;
