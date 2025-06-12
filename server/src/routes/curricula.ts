import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// GET /api/curricula
router.get('/', async (req, res) => {
  // @ts-ignore
  const prisma = req.prisma;
  const curricula = await prisma.curriculum.findMany({
    orderBy: { level: 'asc' },
    select: {
      id: true,
      level: true,
      name: true,
      description: true,
      total_trimesters: true,
      createdAt: true,
      updatedAt: true
    }
  });
  res.json(curricula);
});

// GET /api/curricula/:id/trimesters
router.get('/:id/trimesters', async (req, res) => {
  const id = req.params.id;
  // @ts-ignore
  const prisma = req.prisma;
  const trimesters = await prisma.curriculumTrimester.findMany({
    where: { curriculumId: id },
    orderBy: { number: 'asc' }
  });
  if (!trimesters) return res.status(404).json({ error: 'Not found' });
  res.json(trimesters);
});

// GET /api/trimesters/:id/days
router.get('/trimester/:trimesterId/days', async (req, res) => {
  const trimesterId = req.params.trimesterId;
  // @ts-ignore
  const prisma = req.prisma;
  const days = await prisma.curriculumDay.findMany({
    where: { trimesterId },
    orderBy: { day_number: 'asc' },
    include: { glossary_terms: true }
  });
  if (!days) return res.status(404).json({ error: 'Not found' });
  res.json(days);
});

// GET /api/days/:id
router.get('/day/:dayId', async (req, res) => {
  const dayId = req.params.dayId;
  // @ts-ignore
  const prisma = req.prisma;
  const day = await prisma.curriculumDay.findUnique({
    where: { id: dayId },
    include: { glossary_terms: true }
  });
  if (!day) return res.status(404).json({ error: 'Not found' });
  res.json(day);
});

export default router; 