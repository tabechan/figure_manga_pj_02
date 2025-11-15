import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { verifyNfcSignature, isTimestampValid } from '../lib/nfc.js';
import { optionalAuth, type AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

router.use(optionalAuth);

const tapSchema = z.object({
  u: z.string().min(1),
  sig: z.string().min(1),
  ts: z.string().regex(/^\d+$/),
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const params = tapSchema.parse(req.query);
    const tagUid = params.u;
    const signature = params.sig;
    const timestamp = parseInt(params.ts, 10);

    if (!isTimestampValid(timestamp)) {
      await prisma.nfcTapLog.create({
        data: {
          tagUid,
          signature,
          timestamp: new Date(timestamp),
          verified: false,
        },
      });
      return res.status(400).json({ error: 'タップリンクの有効期限が切れています' });
    }

    const isValid = verifyNfcSignature(tagUid, timestamp, signature);

    if (!isValid) {
      await prisma.nfcTapLog.create({
        data: {
          tagUid,
          signature,
          timestamp: new Date(timestamp),
          verified: false,
        },
      });
      return res.status(403).json({ error: '不正なタップリンクです' });
    }

    const figure = await prisma.figure.findUnique({
      where: { tagUid },
      include: {
        series: {
          include: {
            volumes: {
              orderBy: { volumeNo: 'asc' },
            },
          },
        },
        volumeRanges: {
          include: {
            volume: true,
          },
        },
      },
    });

    if (!figure) {
      await prisma.nfcTapLog.create({
        data: {
          tagUid,
          signature,
          timestamp: new Date(timestamp),
          verified: true,
        },
      });
      return res.status(404).json({ error: 'フィギュアが見つかりません' });
    }

    const userId = req.user?.id;

    await prisma.nfcTapLog.create({
      data: {
        tagUid,
        signature,
        timestamp: new Date(timestamp),
        verified: true,
        userId: userId || null,
        figureId: figure.id,
      },
    });

    if (!userId) {
      return res.json({
        ok: true,
        action: 'login_required',
        figure: {
          id: figure.id,
          title: figure.title,
          seriesId: figure.seriesId,
          seriesTitle: figure.series.title,
          imageUrl: figure.imageUrl,
        },
      });
    }

    if (figure.ownerUserId !== userId) {
      return res.json({
        ok: true,
        action: 'not_owner',
        figure: {
          id: figure.id,
          title: figure.title,
          seriesId: figure.seriesId,
          seriesTitle: figure.series.title,
          imageUrl: figure.imageUrl,
        },
      });
    }

    const volumeOwnerships = await prisma.volumeOwnership.findMany({
      where: {
        userId,
        figureId: figure.id,
      },
      include: {
        volume: true,
      },
      orderBy: {
        volume: {
          volumeNo: 'desc',
        },
      },
    });

    const latestReading = volumeOwnerships.find(vo => vo.lastReadAt !== null);

    return res.json({
      ok: true,
      action: 'redirect_to_series',
      figure: {
        id: figure.id,
        title: figure.title,
        seriesId: figure.seriesId,
        seriesTitle: figure.series.title,
        imageUrl: figure.imageUrl,
      },
      latestVolume: latestReading
        ? {
            volumeId: latestReading.volumeId,
            volumeNo: latestReading.volume.volumeNo,
            currentPage: latestReading.currentPage,
          }
        : null,
    });
  } catch (error: any) {
    console.error('NFC tap error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '無効なパラメータです' });
    }
    return res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

export default router;
