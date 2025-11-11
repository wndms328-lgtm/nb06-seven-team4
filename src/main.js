import 'dotenv/config';
import { PORT } from './libs/constants.js';
import express from 'express';
import cors from 'cors';
import participantRouter from './router/participantRouter.js';
import rankingRouter from './router/rankingRouter.js';
import errorHandler from './libs/errorHandler.js';
import groupRouter from './router/groupRouter.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터
app.use('/groups', participantRouter);
app.use('/groups', rankingRouter);
app.use('/groups', groupRouter);

// 기본 경로
app.get('/', (req, res) => {
  res.json({ message: 'API Server is running' });
});

/*
// 기본 경로 응답
app.get('/', (req, res) => {
    res.send('API Server Running');
});
*/

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청한 리소스를 찾을 수 없습니다.',
  });
});

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});