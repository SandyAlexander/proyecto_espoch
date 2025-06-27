// backend/src/controllers/fileController.ts
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export const getFiles: RequestHandler = async (_req, res) => {
  const documentos = await prisma.documento.findMany();
  res.json(documentos);
};

export const uploadFile: RequestHandler = async (req, res) => {
  const { titulo, tipo, docenteId } = req.body;
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: 'Archivo no encontrado' });
    return;
  }

  const documento = await prisma.documento.create({
    data: {
      titulo,
      tipo,
      nombreArchivo: file.originalname,
      url: file.path,
      peso: file.size,
      docenteId: Number(docenteId),
    },
  });

  res.status(201).json(documento);
};

export const downloadFile: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  const documento = await prisma.documento.findUnique({ where: { id } });

  if (!documento) {
    res.status(404).json({ error: 'Documento no encontrado' });
    return;
  }

  const filePath = path.resolve(documento.url);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: 'Archivo no disponible' });
    return;
  }

  res.download(filePath, documento.nombreArchivo);
};
