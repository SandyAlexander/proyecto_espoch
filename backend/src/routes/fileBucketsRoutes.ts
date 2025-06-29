// backend/src/routes/fileRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import { getFilesInBucket, uploadFileDocument } from '../controllers/fileControllerBucket';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getFilesInBucket);
router.post('/upload', upload.single('file'), uploadFileDocument);
// router.get('/:id/download', downloadFile);

export default router;
