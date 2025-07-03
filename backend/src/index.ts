import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import docenteRoutes from './routes/docenteRoutes';
import folderRoutes from './routes/folderRoutes';
import fileRoutes from './routes/fileRoutes';
import documentoRoutes from './routes/documentoRoutes';
import authRoutes from './routes/authRoutes';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/docentes', docenteRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/documentos', documentoRoutes);
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
