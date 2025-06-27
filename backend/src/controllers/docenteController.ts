import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/hash';

const prisma = new PrismaClient();

// Interfaz para tipar los datos de las materias
interface MateriaData {
  nombre: string;
  curso: string;
  horas: number;
}

// Interfaz para tipar el cuerpo de la solicitud
interface CreateDocenteRequest {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  departamento?: string;
  rol: string;
  materias?: MateriaData[];
}

export const getDocentes = async (_: Request, res: Response) => {
  try {
    const docentes = await prisma.docente.findMany({
      include: {
        materias: true,
      },
    });
    res.json(docentes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error al obtener docentes:', error.message);
      res.status(500).json({ 
        error: 'Error al obtener docentes',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } else {
      res.status(500).json({ error: 'Error desconocido al obtener docentes' });
    }
  }
};

export const createDocente = async (req: Request<{}, {}, CreateDocenteRequest>, res: Response) => {
  try {
    const {
      nombres,
      apellidos,
      correo,
      contrasena,
      telefono,
      departamento,
      rol,
      materias = []
    } = req.body;

    // Validación de campos obligatorios
    if (!nombres || !apellidos || !correo || !contrasena || !rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validación de materias
    if (materias.length > 0) {
      const hasInvalidMaterias = materias.some(m => 
        !m.nombre || !m.curso || isNaN(m.horas)
      );
      
      if (hasInvalidMaterias) {
        return res.status(400).json({ 
          error: 'Todas las materias deben tener nombre, curso y horas válidos'
        });
      }
    }

    const passwordHash = await hashPassword(contrasena);

    const docente = await prisma.docente.create({
      data: {
        nombres,
        apellidos,
        correo,
        contrasena: passwordHash,
        telefono: telefono || null,
        departamento: departamento || null,
        rol,
        materias: materias.length > 0 ? {
          create: materias.map(m => ({
            nombre: m.nombre,
            curso: m.curso,
            horas: Number(m.horas)
          }))
        } : undefined
      },
      include: {
        materias: true
      }
    });

    res.status(201).json(docente);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Manejo de errores específicos de Prisma
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      }
      console.error('Error de Prisma:', error.message);
      res.status(500).json({ 
        error: 'Error de base de datos',
        code: error.code,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } else if (error instanceof Error) {
      console.error('Error al registrar docente:', error.message);
      res.status(500).json({ 
        error: 'Error al registrar docente',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } else {
      console.error('Error desconocido:', error);
      res.status(500).json({ error: 'Error desconocido al registrar docente' });
    }
  }
};

export const deleteDocente = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID debe ser un número válido' });
  }

  try {
    await prisma.docente.delete({ 
      where: { id } 
    });
    res.status(200).json({ message: 'Docente eliminado correctamente' });
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Docente no encontrado' });
      }
    }
    
    if (error instanceof Error) {
      console.error('Error al eliminar docente:', error.message);
      res.status(500).json({ 
        error: 'Error al eliminar docente',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } else {
      res.status(500).json({ error: 'Error desconocido al eliminar docente' });
    }
  }
};