/**
 * 비동기(async) 컨트롤러 함수를 래핑하여 에러가 발생하면 자동으로 next()로 전달합니다.
 * 이를 통해 try/catch 블록을 줄이고 코드를 깔끔하게 유지할 수 있습니다.
 */
export const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};