import { Request, Response } from 'express';
import { storageService } from '../services/storage/storageService.js';
import path from 'path';
import fs from 'fs';

export async function uploadFileHandler(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file uploaded' } });
      return;
    }

    const folder = (req.body.folder as any) || 'proof';
    const result = await storageService.uploadFile(file.buffer, file.originalname, file.mimetype, folder);

    res.json({
      success: true,
      data: {
        fileUrl: result.fileUrl,
        filePath: result.filePath,
        fileName: file.originalname,
        size: result.size,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'UPLOAD_ERROR', message: err.message } });
  }
}

export async function serveLocalFile(req: Request, res: Response): Promise<void> {
  try {
    const { folder, filename } = req.params;
    const sanitizedFolder = path.basename(folder);
    const sanitizedFilename = path.basename(filename);
    const fullPath = path.resolve(process.cwd(), 'uploads', sanitizedFolder, sanitizedFilename);

    if (!fs.existsSync(fullPath)) {
      res.status(404).json({ success: false, error: { code: 'FILE_NOT_FOUND', message: 'File not found' } });
      return;
    }

    res.sendFile(fullPath);
  } catch (err: any) {
    res.status(500).json({ success: false, error: { code: 'SERVE_ERROR', message: err.message } });
  }
}
