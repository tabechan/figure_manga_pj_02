import express from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db.js';
import { requireAuth, type AuthRequest } from '../middleware/auth.js';

const router = express.Router();

const ClaimSchema = z.object({
  transactionId: z.string(),
});

// Get transaction information by transactionId
router.get('/transaction/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await prisma.figureTransaction.findUnique({
      where: { id: transactionId },
      include: {
        figure: {
          include: {
            series: {
              select: {
                id: true,
                title: true,
                coverUrl: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'トランザクションが見つかりません' });
    }

    // Check if transaction is expired
    if (new Date() > transaction.expiresAt) {
      return res.json({
        ok: false,
        error: 'このトランザクションは有効期限切れです',
        claimable: false,
      });
    }

    // Check if already activated
    if (transaction.status === 'activated') {
      return res.json({
        ok: false,
        error: 'このフィギュアは既に請求済みです',
        claimable: false,
      });
    }

    res.json({
      ok: true,
      claimable: transaction.status === 'pending',
      transaction: {
        id: transaction.id,
        status: transaction.status,
        expiresAt: transaction.expiresAt,
      },
      figure: {
        id: transaction.figure.id,
        title: transaction.figure.title,
        imageUrl: transaction.figure.imageUrl,
        description: transaction.figure.description,
        price: transaction.figure.price,
      },
      series: {
        id: transaction.figure.series.id,
        title: transaction.figure.series.title,
        coverUrl: transaction.figure.series.coverUrl,
      },
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// Claim figure using transactionId (one-time activation)
router.post('/claim', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { transactionId } = ClaimSchema.parse(req.body);
    const userId = req.user!.id;

    const result = await prisma.$transaction(async (tx) => {
      // Get transaction with figure details
      const transaction = await tx.figureTransaction.findUnique({
        where: { id: transactionId },
        include: {
          figure: {
            include: {
              volumeRanges: {
                include: {
                  volume: true,
                },
              },
            },
          },
        },
      });

      if (!transaction) {
        throw new Error('トランザクションが見つかりません');
      }

      // Check if expired
      if (new Date() > transaction.expiresAt) {
        throw new Error('このトランザクションは有効期限切れです');
      }

      // Check if already activated (already owned by this user)
      if (transaction.status === 'activated') {
        // Return special status for already owned figures
        return { 
          alreadyOwned: true,
          figure: transaction.figure,
          seriesId: transaction.figure.seriesId,
        };
      }

      // Check if figure is already claimed
      if (transaction.figure.status === 'claimed') {
        // Return special status for already owned figures
        return { 
          alreadyOwned: true,
          figure: transaction.figure,
          seriesId: transaction.figure.seriesId,
        };
      }

      // SECURITY: Check if the user is the purchaser
      if (transaction.purchasedBy !== userId) {
        throw new Error('このフィギュアの購入履歴が見つかりませんでした');
      }

      // Activate transaction
      await tx.figureTransaction.update({
        where: { id: transactionId },
        data: {
          status: 'activated',
          activatedBy: userId,
          activatedAt: new Date(),
        },
      });

      // Update figure ownership
      const updatedFigure = await tx.figure.update({
        where: { id: transaction.figureId },
        data: {
          status: 'claimed',
          ownerUserId: userId,
        },
      });

      // Create license
      await tx.license.create({
        data: {
          figureId: transaction.figureId,
          ownerUserId: userId,
        },
      });

      // Create read rights
      await tx.readRights.create({
        data: {
          figureId: transaction.figureId,
          activeUserId: userId,
          state: 'owner',
        },
      });

      // Grant volume ownerships for all volumes in the figure's range
      const volumeOwnerships = transaction.figure.volumeRanges.map((vr) => ({
        userId,
        volumeId: vr.volumeId,
        figureId: transaction.figureId,
        purchaseType: 'figure_bundle',
      }));

      await tx.volumeOwnership.createMany({
        data: volumeOwnerships,
        skipDuplicates: true,
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId,
          figureId: transaction.figureId,
          action: 'claim_via_transaction',
          meta: { transactionId },
        },
      });

      return { 
        figure: updatedFigure,
        seriesId: transaction.figure.seriesId,
        alreadyOwned: false,
      };
    });

    // Handle already owned case
    if (result.alreadyOwned) {
      return res.json({ 
        ok: true,
        status: 'already_owned', 
        alreadyOwned: true,
        figure: result.figure,
        seriesId: result.seriesId,
      });
    }

    res.json({ 
      ok: true,
      status: 'claimed', 
      figure: result.figure,
      seriesId: result.seriesId,
    });
  } catch (error: any) {
    console.error('Claim error:', error);
    if (error.message) {
      return res.status(400).json({ ok: false, error: error.message });
    }
    res.status(500).json({ ok: false, error: 'サーバーエラーが発生しました' });
  }
});

export default router;
