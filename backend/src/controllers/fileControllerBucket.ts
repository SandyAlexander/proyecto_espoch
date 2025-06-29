// backend/src/controllers/fileController.ts
import { RequestHandler } from 'express';
// import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
// const prisma = new PrismaClient();
const ROOT_BUCKET = 'espoch-2025';
import { minioClient } from '../minioClient';
import { BucketItem } from 'minio';


export const getFilesInBucket: RequestHandler = async (_req, res) => {
    // const documentos = await prisma.documento.findMany();
    // Si se usa MinIO, se puede obtener la lista de archivos del bucket
    const objectsStream = minioClient.listObjects(ROOT_BUCKET, '', true)
    const archivos: BucketItem[] = [];

    objectsStream.on('data', (obj: BucketItem) => {
        archivos.push(obj);
    });

    objectsStream.on('end', () => {
        res.json(archivos);
    });

    objectsStream.on('error', (err: Error) => {
        console.error('Error al listar:', err);
        res.status(500).send('Error al listar archivos');
    });

};

// subir un archivo al bucket
export const uploadFileDocument: RequestHandler = (req, res) => {
    const { titulo, tipo, docenteId } = req.body;
    const file = req.file;

    if (!file) {
        res.status(400).json({ error: 'Archivo no encontrado' });
        return;
    }

    const documento = {
        data: {
            titulo,
            tipo,
            nombreArchivo: file.originalname,
            url: file.path,
            peso: file.size,
            docenteId: Number(docenteId),
        },
    };

    // Subir el archivo al bucket desde disco con fPutObject
    minioClient.fPutObject(
        ROOT_BUCKET,
        documento.data.nombreArchivo,
        file.path,
        {},
        (err: Error, etag: string) => {
            if (err) {
                console.error('Error al subir a MinIO:', err);
                return res.status(500).json({ error: 'Fallo al subir archivo al bucket' });
            }

            console.log('Archivo subido al bucket con ETag:', etag);
            res.status(201).json(documento);
        }
    );
};

// export const downloadFile: RequestHandler = async (req, res) => {
//     const id = Number(req.params.id);
//     const documento = {

//     if (!documento) {
//         res.status(404).json({ error: 'Documento no encontrado' });
//         return;
//     }

//     const filePath = path.resolve(documento.url);
//     if (!fs.existsSync(filePath)) {
//         res.status(404).json({ error: 'Archivo no disponible' });
//         return;
//     }

//     res.download(filePath, documento.nombreArchivo);
// };
