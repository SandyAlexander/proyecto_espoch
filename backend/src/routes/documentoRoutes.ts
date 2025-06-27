import { Router } from 'express';
import multer from 'multer';
import {
  getDocumentos,
  subirDocumento,
  descargarDocumento
} from '../controllers/documentoController';
import { authenticateJWT } from '../middleware/auth';


const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getDocumentos);
router.post('/', authenticateJWT, upload.single('file'), subirDocumento);
router.get('/:id/download', descargarDocumento);

export default router;
