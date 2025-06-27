import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFolders = async (_: Request, res: Response) => {
  const folders = await prisma.folder.findMany();
  res.json(folders);
};

export const createFolder = async (req: Request, res: Response) => {
  const { name } = req.body;
  const folder = await prisma.folder.create({ data: { name } });
  res.status(201).json(folder);
};

export const renameFolder = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  const folder = await prisma.folder.update({ where: { id }, data: { name } });
  res.json(folder);
};

export const deleteFolder = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.file.deleteMany({ where: { folderId: id } });
  await prisma.folder.delete({ where: { id } });
  res.json({ message: 'Carpeta eliminada' });
};
