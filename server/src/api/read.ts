import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';
import { generateShortLivedToken } from '../lib/auth.js';

const router = express.Router();

const StartReadingSchema = z.object({
  figureId: z.string().optional(),
  volumeId: z.string().optional(),
  volumeNo: z.number().int().positive(),
}).refine(data => data.figureId || data.volumeId, {
  message: 'Either figureId or volumeId must be provided',
});

const activeSessions = new Map<string, { userId: string; figureId: string | null; volumeNo: number; expiresAt: Date }>();

router.post('/start', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { figureId, volumeId, volumeNo } = StartReadingSchema.parse(req.body);
    const userId = req.user!.id;
    
    let contentAsset: any = null;
    let hasPermission = false;

    // Case 1: Reading via figure ownership (with ReadRights)
    if (figureId) {
      const readRights = await prisma.readRights.findUnique({
        where: { figureId },
      });

      if (readRights) {
        const now = new Date();
        const isOwner = readRights.state === 'owner' && readRights.activeUserId === userId;
        const isValidLoan =
          readRights.state === 'loaned' &&
          readRights.activeUserId === userId &&
          readRights.loanStart &&
          readRights.loanEnd &&
          readRights.loanStart <= now &&
          readRights.loanEnd >= now;

        if (isOwner || isValidLoan) {
          hasPermission = true;
          
          // Get the figure's series to find the volume
          const figure = await prisma.figure.findUnique({
            where: { id: figureId },
            include: { series: true },
          });

          if (!figure) {
            return res.status(404).json({ error: 'Figure not found' });
          }

          contentAsset = await prisma.volume.findFirst({
            where: { 
              seriesId: figure.seriesId,
              volumeNo 
            },
          });
        }
      }
    }

    // Case 2: Reading via direct volume ownership (without figure)
    if (!hasPermission) {
      let targetVolumeId = volumeId;
      
      // If volumeId not provided, find it by volumeNo (need seriesId somehow)
      // For now, we'll look it up from the volumeOwnership or figure
      if (!targetVolumeId && figureId) {
        const figure = await prisma.figure.findUnique({
          where: { id: figureId },
          include: { series: true },
        });
        
        if (figure) {
          const volume = await prisma.volume.findFirst({
            where: { 
              seriesId: figure.seriesId,
              volumeNo 
            },
          });
          targetVolumeId = volume?.id;
        }
      }
      
      if (targetVolumeId) {
        const volumeOwnership = await prisma.volumeOwnership.findUnique({
          where: { 
            userId_volumeId: {
              userId,
              volumeId: targetVolumeId
            }
          },
          include: {
            volume: true
          }
        });

        if (volumeOwnership) {
          hasPermission = true;
          contentAsset = volumeOwnership.volume;
        }
      }
    }

    if (!hasPermission) {
      return res.status(403).json({ error: 'No reading rights or volume ownership found' });
    }

    if (!contentAsset) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Clean up any existing sessions for this figure (if figureId exists)
    if (figureId) {
      for (const [sessionId, session] of activeSessions.entries()) {
        if (session.figureId === figureId && session.userId !== userId) {
          activeSessions.delete(sessionId);
        }
      }
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const jwt = generateShortLivedToken({ userId, figureId: figureId || null, volumeNo });
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    activeSessions.set(sessionId, { userId, figureId: figureId || null, volumeNo, expiresAt });

    await prisma.auditLog.create({
      data: {
        userId,
        figureId: figureId || null,
        action: 'read_start',
        meta: { volumeNo, volumeId: contentAsset.id, sessionId },
      },
    });

    res.json({
      jwt,
      sessionId,
      contentAsset: {
        id: contentAsset.id,
        title: contentAsset.title,
        volumeNo: contentAsset.volumeNo,
        coverUrl: contentAsset.coverUrl,
        fileUrl: contentAsset.fileUrl,
      },
    });
  } catch (error) {
    console.error('Start reading error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/heartbeat', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { sessionId } = z.object({ sessionId: z.string() }).parse(req.body);
    const session = activeSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    activeSessions.set(sessionId, session);

    res.json({ ok: true, expiresAt: session.expiresAt });
  } catch (error) {
    console.error('Heartbeat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/stop', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { sessionId } = z.object({ sessionId: z.string() }).parse(req.body);
    const session = activeSessions.get(sessionId);

    if (session) {
      activeSessions.delete(sessionId);

      await prisma.auditLog.create({
        data: {
          userId: req.user!.id,
          figureId: session.figureId,
          action: 'read_stop',
          meta: { volumeNo: session.volumeNo, sessionId },
        },
      });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Stop reading error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
