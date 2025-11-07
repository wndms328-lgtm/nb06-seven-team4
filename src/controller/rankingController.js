import prisma from '../libs/database.js';

class RankingController {
  // 그룹 랭킹 조회
  async getGroupRanking(req, res, next) {
    try {
      const { id } = req.params;
      const groupId = parseInt(id);

      if (isNaN(groupId)) {
        return res.status(400).json({
          path: 'id',
          message: 'Invalid group ID',
        });
      }

      const { duration = 'weekly' } = req.query; // weekly, monthly

      // duration 유효성 검사
      if (duration !== 'weekly' && duration !== 'monthly') {
        return res.status(400).json({
          path: 'duration',
          message: "duration must be 'weekly' or 'monthly'",
        });
      }

      // 기간 계산
      const now = new Date();
      let startDate;
      if (duration === 'monthly') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else {
        // 주간: 오늘로부터 7일 전
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
      }

      // 그룹 존재 확인
      const group = await prisma.group.findUnique({
        where: { id: groupId },
      });

      if (!group) {
        return res.status(404).json({
          success: false,
          message: '그룹을 찾을 수 없습니다.',
        });
      }

      // 기간 내 기록 조회 (participantId 포함)
      const records = await prisma.exerciseRecord.findMany({
        where: {
          groupId: groupId,
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          playtime: true,
          participantId: true,
          participant: {
            select: {
              nickname: true,
            },
          },
        },
      });

      // 닉네임별 집계 (participantId 포함)
      const rankingMap = {};
      records.forEach((record) => {
        const nickname = record.participant.nickname;
        if (!rankingMap[nickname]) {
          rankingMap[nickname] = {
            participantId: record.participantId,
            nickname: nickname,
            recordCount: 0,
            recordTime: 0,
          };
        }
        rankingMap[nickname].recordCount++;
        rankingMap[nickname].recordTime += record.playtime;
      });

      // 랭킹 배열로 변환 및 정렬
      const ranking = Object.values(rankingMap).sort((a, b) => b.recordCount - a.recordCount);

      res.json(ranking);
    } catch (error) {
      next(error);
    }
  }
}

export default new RankingController();
