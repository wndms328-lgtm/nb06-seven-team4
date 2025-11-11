import multer from 'multer';

/**
 * 전역 에러 핸들러입니다.
 * 모든 Request Handler에서 발생한 에러를 이곳에서 최종적으로 처리합니다.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma 초기화 에러 처리
  if (err.name === 'PrismaClientInitializationError') {
    return res.status(500).json({
      success: false,
      message: '데이터베이스 연결에 실패했습니다. DATABASE_URL을 확인해주세요.',
    });
  }

  // Prisma 에러 처리
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: '중복된 데이터가 존재합니다.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: '요청한 데이터를 찾을 수 없습니다.',
    });
  }

  // Multer 에러 처리
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '파일 크기가 너무 큽니다.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '파일 개수가 너무 많습니다.',
      });
    }
  }

  // 기본 에러 처리
  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 내부 오류가 발생했습니다.';

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorHandler;

/**
 * 모든 커스텀 에러의 기본이 되는 클래스입니다.
 * HTTP 상태 코드와 메시지를 포함하여 Global Error Handler가 쉽게 처리할 수 있도록 합니다.
 */
export class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        // Error stack 추적을 위해 클래스 이름 설정
        this.name = this.constructor.name;
        // 생성자 함수를 호출 스택에서 제외
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 전역 에러 핸들러 미들웨어입니다.
 * 모든 Request Handler에서 발생한 에러를 이곳에서 최종적으로 처리합니다.
 */
export const globalErrorHandler = (err, req, res, next) => {
    // CustomError가 아닌 경우 (예: 서버 내부 오류), 500 상태 코드와 일반 메시지를 사용합니다.
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // 에러를 콘솔에 기록
    console.error(`[${err.name} - ${statusCode}] ${err.message}`, err.stack);

    res.status(statusCode).json({
        status: 'error',
        message: message,
        // 개발 환경에서만 스택 트레이스를 포함할 수 있습니다.
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};