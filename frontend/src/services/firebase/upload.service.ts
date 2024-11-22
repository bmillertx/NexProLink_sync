import { storage } from '@/config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface FileUploadResult {
  url: string;
  path: string;
  filename: string;
}

export class UploadService {
  private static readonly ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  /**
   * Validates file before upload
   */
  private static validateFile(file: File): void {
    if (!UploadService.ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only images, PDFs, and Word documents are allowed.');
    }

    if (file.size > UploadService.MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit.');
    }
  }

  /**
   * Generates a unique filename with original extension
   */
  private static generateUniqueFilename(originalFilename: string): string {
    const extension = originalFilename.split('.').pop();
    return `${uuidv4()}.${extension}`;
  }

  /**
   * Uploads a profile image for a user
   */
  static async uploadProfileImage(
    userId: string,
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<FileUploadResult> {
    this.validateFile(file);
    const filename = this.generateUniqueFilename(file.name);
    const path = `users/${userId}/profile/${filename}`;
    return this.uploadFile(path, file, onProgress);
  }

  /**
   * Uploads a consultant document
   */
  static async uploadConsultantDocument(
    consultantId: string,
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<FileUploadResult> {
    this.validateFile(file);
    const filename = this.generateUniqueFilename(file.name);
    const path = `consultants/${consultantId}/documents/${filename}`;
    return this.uploadFile(path, file, onProgress);
  }

  /**
   * Uploads a consultation attachment
   */
  static async uploadConsultationAttachment(
    consultationId: string,
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<FileUploadResult> {
    this.validateFile(file);
    const filename = this.generateUniqueFilename(file.name);
    const path = `consultations/${consultationId}/attachments/${filename}`;
    return this.uploadFile(path, file, onProgress);
  }

  /**
   * Core file upload method
   */
  private static async uploadFile(
    path: string,
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<FileUploadResult> {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({
              url,
              path,
              filename: file.name
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  /**
   * Deletes a file from storage
   */
  static async deleteFile(path: string): Promise<void> {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  }

  /**
   * Lists all files in a directory
   */
  static async listFiles(path: string): Promise<string[]> {
    const directoryRef = ref(storage, path);
    const result = await listAll(directoryRef);
    return result.items.map(item => item.fullPath);
  }

  /**
   * Gets download URL for a file
   */
  static async getFileUrl(path: string): Promise<string> {
    const fileRef = ref(storage, path);
    return getDownloadURL(fileRef);
  }
}
