import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import curriculumRouter from './routes/curricula.js';

dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Attach Prisma to req if desired (simple)
app.use((req, res, next) => {
  // @ts-ignore
  req.prisma = prisma;
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/curricula', curriculumRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 