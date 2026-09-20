import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/index.js';

class StorageService {
  private supabase: SupabaseClient | null = null;
  private localUploadDir: string;

  constructor() {
    if (config.supabase.url && config.supabase.serviceRoleKey) {
      try {
        this.supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);
        console.log('✅ Supabase Storage client initialized');
      } catch (err: any) {
        console.warn('⚠️ Supabase Storage init failed, using local disk fallback:', err.message);
      }
    }

    this.localUploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(this.localUploadDir)) {
      fs.mkdirSync(this.localUploadDir, { recursive: true });
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: 'resumes' | 'proof' | 'projects' | 'assets' = 'proof'
  ): Promise<{ fileUrl: string; filePath: string; size: number }> {
    const extension = path.extname(originalName) || '.bin';
    const filename = `${folder}/${uuidv4()}${extension}`;

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase.storage
          .from(config.supabase.storageBucket)
          .upload(filename, fileBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (error) {
          throw error;
        }

        const { data: publicUrlData } = this.supabase.storage
          .from(config.supabase.storageBucket)
          .getPublicUrl(filename);

        return {
          fileUrl: publicUrlData.publicUrl,
          filePath: filename,
          size: fileBuffer.length,
        };
      } catch (err: any) {
        console.warn('⚠️ Supabase upload failed, using local storage fallback:', err.message);
      }
    }

    // Local Disk Fallback
    const localTargetFolder = path.join(this.localUploadDir, folder);
    if (!fs.existsSync(localTargetFolder)) {
      fs.mkdirSync(localTargetFolder, { recursive: true });
    }

    const uniqueLocalName = `${uuidv4()}${extension}`;
    const fullPath = path.join(localTargetFolder, uniqueLocalName);
    fs.writeFileSync(fullPath, fileBuffer);

    const relativeUrl = `/api/storage/files/${folder}/${uniqueLocalName}`;
    return {
      fileUrl: relativeUrl,
      filePath: `${folder}/${uniqueLocalName}`,
      size: fileBuffer.length,
    };
  }

  async getFileStream(filePath: string): Promise<{ stream: fs.ReadStream; mimeType: string } | null> {
    const fullPath = path.join(this.localUploadDir, filePath);
    if (fs.existsSync(fullPath)) {
      return {
        stream: fs.createReadStream(fullPath),
        mimeType: 'application/octet-stream',
      };
    }
    return null;
  }

  async deleteFile(filePath: string): Promise<boolean> {
    if (this.supabase) {
      try {
        await this.supabase.storage.from(config.supabase.storageBucket).remove([filePath]);
        return true;
      } catch (err) {
        // Continue to local check
      }
    }

    const fullPath = path.join(this.localUploadDir, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  }
}

export const storageService = new StorageService();
