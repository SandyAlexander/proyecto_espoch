// src/routes/docenteRoutes.ts
import express from 'express';
import { createDocente, deleteDocente, getDocentes } from '../controllers/docenteController';

const router = express.Router();

router.get('/', getDocentes);
router.post('/', createDocente);
router.delete('/:id', deleteDocente);

export default router;
