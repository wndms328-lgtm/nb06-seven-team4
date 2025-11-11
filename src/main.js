import express from 'express';
import { PORT } from './libs/constants.js';
import cors from 'cors';
import groupRouter from './router/groupRouter.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/groups', groupRouter);

// 기본 경로 응답
app.get('/', (req, res) => {
    res.send('API Server Running');
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log("Server is Online");
});