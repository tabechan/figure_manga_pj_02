import express from 'express';
import { prisma } from '../lib/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

    const news = await prisma.news.findMany({
      orderBy: { date: 'desc' },
      take: limit,
    });

    res.json({ news });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const newsItem = await prisma.news.findUnique({
      where: { id },
    });

    if (!newsItem) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({ news: newsItem });
  } catch (error) {
    console.error('Get news item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
