"use server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (!process.env.AWS_REGION) {
  throw new Error("AWS_REGION is not configured");
}

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error("AWS_ACCESS_KEY_ID is not configured");
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS_SECRET_ACCESS_KEY is not configured");
}

if (!process.env.AWS_BUCKET_NAME) {
  throw new Error("AWS_BUCKET_NAME is not configured");
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export interface UploadResponse {
  url: string;
  key: string;
}

function getPublicFileUrl(key: string) {
  const configuredBaseUrl =
    process.env.AWS_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_AWS_S3_URL;
  if (configuredBaseUrl) {
    return `${configuredBaseUrl.replace(/\/+$/, "")}/${key}`;
  }

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

async function getSignedUploadUrl(
  fileName: string,
  fileType: string,
): Promise<UploadResponse> {
  try {
    const key = `uploads/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return {
      url: signedUrl,
      key,
    };
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw new Error(
      "Failed to get upload URL. Please check your AWS configuration.",
    );
  }
}

export async function uploadToS3(file: File): Promise<UploadResponse> {
  try {
    // Get signed URL
    const { url, key } = await getSignedUploadUrl(file.name, file.type);

    // Upload file using fetch
    const response = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    // Return the public URL
    return {
      url: getPublicFileUrl(key),
      key,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file. Please try again later.");
  }
}
