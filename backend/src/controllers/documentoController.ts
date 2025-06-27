// backend/src/controllers/documentoController.ts
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Listar documentos
export const getDocumentos: RequestHandler = async (_req, res) => {
  try {
    const documentos = await prisma.documento.findMany();
    res.json(documentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener documentos' });
  }
};

// Subir documento
export const subirDocumento: RequestHandler = async (req, res) => {
  try {
    const { titulo, tipo, docenteId } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'Archivo requerido' });
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al subir documento' });
  }
};

// Descargar documento
export const descargarDocumento: RequestHandler = async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al descargar documento' });
  }
};
