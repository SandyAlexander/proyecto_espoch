// backend/src/scripts/createAdmin.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/hash';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Datos del administrador con el tipo correcto
    const adminData = {
      nombres: 'Admin',
      apellidos: 'Sistema',
      correo: 'admin@espoch.edu.ec',
      contrasena: await hashPassword('Admin1234'), // Cambia esta contraseña
      telefono: '0999999999',
      departamento: 'Tecnologías de la Información',
      rol: 'admin',
      materias: { create: [] } // Formato correcto para relaciones
    };

    // Verificar si ya existe el admin
    const existingAdmin = await prisma.docente.findUnique({
      where: { correo: adminData.correo }
    });

    if (existingAdmin) {
      console.log('✅ El usuario administrador ya existe');
      return;
    }

    // Crear el admin con el tipo correcto
    const admin = await prisma.docente.create({
      data: {
        ...adminData,
        materias: undefined // Opción alternativa si no necesita materias
      }
    });

    console.log('✅ Usuario administrador creado exitosamente:');
    console.log({
      id: admin.id,
      correo: admin.correo,
      rol: admin.rol,
      // No mostrar la contraseña en producción
      contraseña: process.env.NODE_ENV === 'development' ? 'Admin1234' : '*****'
    });

  } catch (error) {
    console.error('❌ Error al crear usuario administrador:');
    if (error instanceof Error) {
      console.error(error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
createAdminUser();