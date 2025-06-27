import express from 'express';
import {
  createFolder,
  deleteFolder,
  getFolders,
  renameFolder
} from '../controllers/folderController';

const router = express.Router();

router.get('/', getFolders);
router.post('/', createFolder);
router.put('/:id', renameFolder);
router.delete('/:id', deleteFolder);

export default router;
