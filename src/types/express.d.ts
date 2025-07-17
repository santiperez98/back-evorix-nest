// src/types/express.d.ts
import { User } from '../users/entities/user.entity'; // Ajustá el path según tu proyecto

declare module 'express' {
  interface Request {
    user?: User; // o cualquier tipo que estés usando para el user
  }
}
