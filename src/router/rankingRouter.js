import express from 'express';
import rankingController from '../controller/rankingController.js';

const router = express.Router();

// 그룹 랭킹 조회
router.get(
  '/:groupId/rank',
  (req, res, next) => {
    req.params.id = req.params.groupId;
    next();
  },
  rankingController.getGroupRanking,
);

export default router;
