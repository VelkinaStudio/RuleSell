import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;
const MAX_SIZE = parseInt(process.env.UPLOAD_MAX_SIZE_BYTES || "52428800", 10);

const ALLOWED_EXTENSIONS = new Set([
  ".cursorrules", ".md", ".json", ".yaml", ".yml",
  ".txt", ".zip", ".toml", ".js", ".py",
]);

const EXTENSION_TO_MIME: Record<string, string> = {
  ".cursorrules": "text/plain",
  ".md": "text/markdown",
  ".json": "application/json",
  ".yaml": "application/x-yaml",
  ".yml": "application/x-yaml",
  ".txt": "text/plain",
  ".zip": "application/zip",
  ".toml": "application/toml",
  ".js": "text/javascript",
  ".py": "text/x-python",
};

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot >= 0 ? filename.slice(lastDot).toLowerCase() : "";
}

export function validateFile(filename: string, sizeBytes: number): { valid: boolean; error?: string } {
  const ext = getExtension(filename);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `File type "${ext}" is not allowed` };
  }
  if (sizeBytes > MAX_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_SIZE / 1024 / 1024}MB limit` };
  }
  if (sizeBytes < 1) {
    return { valid: false, error: "File must not be empty" };
  }
  return { valid: true };
}

export function getMimeType(filename: string): string {
  const ext = getExtension(filename);
  return EXTENSION_TO_MIME[ext] || "application/octet-stream";
}

export async function createPresignedUploadUrl(
  rulesetId: string,
  versionId: string,
  filename: string,
): Promise<{ url: string; storageKey: string }> {
  const uuid = crypto.randomUUID();
  const sanitized = sanitizeFilename(filename);
  const storageKey = `rulesets/${rulesetId}/${versionId}/${uuid}-${sanitized}`;
  const mimeType = getMimeType(filename);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: storageKey,
    ContentType: mimeType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 600 });
  return { url, storageKey };
}

export async function createPresignedDownloadUrl(storageKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: storageKey,
  });

  return getSignedUrl(s3, command, { expiresIn: 900 });
}

export async function verifyObjectExists(storageKey: string): Promise<{ exists: boolean; sizeBytes: number }> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET,
      Key: storageKey,
    });
    const response = await s3.send(command);
    return { exists: true, sizeBytes: response.ContentLength || 0 };
  } catch {
    return { exists: false, sizeBytes: 0 };
  }
}
