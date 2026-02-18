import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3-compatible client for MinIO (self-hosted)
const s3Client = new S3Client({
  endpoint: process.env.STORAGE_ENDPOINT ?? "http://localhost:9000",
  region: "eu-central-1", // Germany
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY ?? "",
    secretAccessKey: process.env.STORAGE_SECRET_KEY ?? "",
  },
  forcePathStyle: true, // Required for MinIO
});

const BUCKET = process.env.STORAGE_BUCKET ?? "plansey";
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL ?? "http://localhost:9000/plansey";

export type StorageFolder =
  | "vendor-photos"
  | "vendor-logos"
  | "vendor-covers"
  | "story-photos"
  | "wedding-photos"
  | "user-avatars";

/**
 * Upload a file to MinIO storage
 */
export async function uploadFile(
  folder: StorageFolder,
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const key = `${folder}/${fileName}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${CDN_URL}/${key}`;
}

/**
 * Delete a file from MinIO storage
 */
export async function deleteFile(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

/**
 * Generate a pre-signed URL for direct upload from browser
 */
export async function getUploadUrl(
  folder: StorageFolder,
  fileName: string,
  contentType: string,
  expiresIn = 3600
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const key = `${folder}/${fileName}`;

  const uploadUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn }
  );

  return {
    uploadUrl,
    publicUrl: `${CDN_URL}/${key}`,
  };
}

/**
 * Generate a pre-signed URL for reading a private file
 */
export async function getReadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
    { expiresIn }
  );
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(key: string): string {
  return `${CDN_URL}/${key}`;
}
