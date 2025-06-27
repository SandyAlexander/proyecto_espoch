// backend/src/routes/fileRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import { getFiles, uploadFile, downloadFile } from '../controllers/fileController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getFiles);
router.post('/', upload.single('file'), uploadFile);
router.get('/:id/download', downloadFile);

export default router;
