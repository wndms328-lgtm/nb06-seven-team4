import express from 'express';
import { GroupController } from '../controller/groupController.js';

/**
 * 비동기(async) 컨트롤러 함수를 래핑하여 에러가 발생하면 자동으로 next()로 전달합니다.
 * 이를 통해 try/catch 블록을 줄이고 코드를 깔끔하게 유지할 수 있습니다.
 */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const groupRouter = express.Router();
const groupController = new GroupController();

// API 명세서: 
// 그룹 생성 POST /groups
groupRouter.post('/', catchAsync(groupController.createGroup));

// 그룹 목록 조회 GET /groups
groupRouter.get('/', catchAsync(groupController.getAllGroups)); 

// 그룹 상세 조회 GET /groups/:groupId
groupRouter.get('/:groupId', catchAsync(groupController.getGroupDetails)); 

// 그룹 수정 PATCH /groups/:groupId
groupRouter.patch('/:groupId', catchAsync(groupController.updateGroup));

// 그룹 삭제 DELETE /groups/:groupId
groupRouter.delete('/:groupId', catchAsync(groupController.deleteGroup));

export default groupRouter;