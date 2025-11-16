import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './api/auth.js';
import tapRoutes from './api/tap.js';
import seriesRoutes from './api/series.js';
import volumesRoutes from './api/volumes.js';
import scanRoutes from './api/scan.js';
import readRoutes from './api/read.js';
import loanRoutes from './api/loan.js';
import goodsRoutes from './api/goods.js';
import newsRoutes from './api/news.js';
import eventsRoutes from './api/events.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    process.env.APP_BASE_URL || ''
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tap', tapRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/volumes', volumesRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/read', readRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/goods', goodsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
