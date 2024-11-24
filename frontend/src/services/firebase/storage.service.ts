import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  StorageReference,
} from 'firebase/storage';
import { app } from '@/config/firebase';

export class StorageService {
  private storage = getStorage(app);

  /**
   * Upload a file to Firebase Storage
   * @param file File to upload
   * @param path Path in storage where the file should be saved
   * @returns Download URL of the uploaded file
   */
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      throw new Error(error.message || 'Failed to upload file');
    }
  }

  /**
   * Upload multiple files to Firebase Storage
   * @param files Array of files to upload
   * @param basePath Base path in storage where files should be saved
   * @returns Array of download URLs for the uploaded files
   */
  async uploadMultipleFiles(files: File[], basePath: string): Promise<string[]> {
    try {
      const uploadPromises = files.map((file, index) => {
        const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
        return this.uploadFile(file, path);
      });
      return await Promise.all(uploadPromises);
    } catch (error: any) {
      console.error('Error uploading multiple files:', error);
      throw new Error(error.message || 'Failed to upload files');
    }
  }

  /**
   * Delete a file from Firebase Storage
   * @param path Path to the file in storage
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (error: any) {
      console.error('Error deleting file:', error);
      throw new Error(error.message || 'Failed to delete file');
    }
  }

  /**
   * List all files in a directory
   * @param path Directory path in storage
   * @returns Array of file references
   */
  async listFiles(path: string): Promise<StorageReference[]> {
    try {
      const storageRef = ref(this.storage, path);
      const result = await listAll(storageRef);
      return result.items;
    } catch (error: any) {
      console.error('Error listing files:', error);
      throw new Error(error.message || 'Failed to list files');
    }
  }

  /**
   * Get download URL for a file
   * @param path Path to the file in storage
   * @returns Download URL of the file
   */
  async getFileUrl(path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      return await getDownloadURL(storageRef);
    } catch (error: any) {
      console.error('Error getting file URL:', error);
      throw new Error(error.message || 'Failed to get file URL');
    }
  }

  /**
   * Generate a unique file path
   * @param file Original file
   * @param customPath Optional custom path prefix
   * @returns Unique storage path for the file
   */
  generateFilePath(file: File, customPath?: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    return `${customPath ? customPath + '/' : ''}${timestamp}_${randomString}_${sanitizedFileName}`;
  }
}

export const storageService = new StorageService();
