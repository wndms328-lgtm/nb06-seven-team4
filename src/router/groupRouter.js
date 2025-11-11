import express from 'express';
import { GroupController } from '../controller/groupController.js';
import { catchAsync } from '../libs/catchAsync.js';

const groupRouter = express.Router({ mergeParams: true });//상위 라우터 파람을 내 파람으로 병합해줘
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

// 그룹 좋아요
groupRouter.post('/:groupId/likes', catchAsync(groupController.PostGroupLike));

// 그룹 좋아요 취소
groupRouter.delete('/:groupId/likes', catchAsync(groupController.DeleteGroupLike));

export default groupRouter;