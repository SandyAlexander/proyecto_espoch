// backend/src/controllers/authController.ts
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { comparePassword } from '../utils/hash';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.docente.findUnique({ where: { correo: email } });
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const valid = await comparePassword(password, user.contrasena);
    if (!valid) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, rol: user.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );

    res.json({
      access_token: token,
      user: {
        id: user.id,
        nombre: `${user.nombres} ${user.apellidos}`,
        correo: user.correo,
        rol: user.rol,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
