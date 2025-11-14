import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import participantRouter from './router/participantRouter.js';
import rankingRouter from './router/rankingRouter.js';
import errorHandler from './libs/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
// CORS 설정: 개발 환경에서는 모든 origin 허용, 프로덕션에서는 환경 변수로 제어
const getCorsOrigin = () => {
  const corsOrigin = process.env.CORS_ORIGIN;

  // CORS_ORIGIN이 설정되지 않았거나 '*'이면 모든 origin 허용
  if (!corsOrigin || corsOrigin === '*') {
    return '*';
  }

  // 쉼표로 구분된 여러 origin 허용 (예: "https://domain1.com,https://domain2.com")
  if (corsOrigin.includes(',')) {
    return corsOrigin.split(',').map((origin) => origin.trim());
  }

  // 단일 origin
  return corsOrigin;
};

const corsOptions = {
  origin: getCorsOrigin(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터
app.use('/groups', participantRouter);
app.use('/groups', rankingRouter);

// 기본 경로
app.get('/', (req, res) => {
  res.json({ message: 'API Server is running' });
});

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
