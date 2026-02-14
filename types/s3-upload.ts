// types/s3-upload.ts

export interface S3UploadResponse {
  signedUrl: string;
  key: string;
  bucket: string;
}

export interface S3DirectUploadResponse {
  success: boolean;
  key: string;
  url: string;
}

export interface UploadResult {
  url: string;
  key: string;
}

export interface UseImageUploadReturn {
  uploadImage: (file: File, method?: 'presigned' | 'direct') => Promise<UploadResult | null>;
  isLoading: boolean;
  error: string | null;
}