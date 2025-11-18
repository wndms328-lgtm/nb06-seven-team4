import bcrypt from 'bcrypt';
import { CustomError } from '../libs/errorHandler.js';
import { GetGroupListParamsStruct } from '../structs/groupStructs.js';
import { assert, create } from 'superstruct';
import { prismaClient } from './../libs/constants.js';



// 비밀번호 해싱에 사용할 솔트 라운드
const SALT_ROUNDS = 10;

/**
 * 그룹 관련 비즈니스 로직
 */
export class GroupController {
    /**
     * 그룹 생성
     */
    async createGroup(req, res, next) {
        try {
            const {
                groupName,
                description,
                nickname,
                password,
                image,
                tags,
                goalNumber,
                discordWebhookUrl,
                discordServerInviteUrl
            } = req.body;

            // 필수 입력값 검증
            if (!groupName || !password || !nickname) {
                throw new CustomError('그룹명, 닉네임, 비밀번호는 필수 입력값입니다.', 400);
            }

            // 1. 비밀번호 해싱
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            // 2. 그룹 데이터베이스 저장
            const newGroup = await prismaClient.group.create({
                data: {
                    groupName: groupName,
                    description,
                    nickname: nickname,
                    password: hashedPassword,
                    image,
                    goalNumber: goalNumber,
                    discordwebhookurl: discordWebhookUrl,
                    discordserverinviteurl: discordServerInviteUrl,
                    tag: tags || [],
                },
                select: {
                    id: true,
                    groupName: true,
                    description: true,
                    nickname: true,
                    tag: true,
                    createdAt: true
                }
            });

            res.status(201).json({
                message: '그룹 등록이 성공적으로 완료되었습니다.',
                group: newGroup,
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * 그룹 목록 조회
     * GET /groups
     */
    async getAllGroups(req, res, next) {
        try {
            const { page = 1, limit = 10, order = 'desc', orderBy = 'createdAt', search } = create(req.query, GetGroupListParamsStruct);
            const where = {
                title: search ? { contains: search } : undefined,
            };

            const totalCount = await prismaClient.group.count({ where });

            let orderBySetting;
            switch (orderBy) {
                case 'likeCount': { orderBySetting = { likeCount: order }; } break;
                case 'participantCount': { orderBySetting = { participantCount: order }; } break;
                case 'createdAt': { orderBySetting = { createdAt: order }; } break;
                default: { orderBySetting = { createdAt: order }; } break;
            }

            const groups = await prismaClient.group.findMany({
                select: {
                    id: true,
                    groupName: true,
                    description: true,
                    nickname: true,
                    image: true,
                    tag: true,
                    goalNumber: true,
                    likes: true,
                    createdAt: true,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: orderBySetting,
                where,
            });
            return res.send({ list: groups, totalCount });
        }
        catch (err) {
            if (err.name === 'StructError') {
                const failure = err.failures()[0];//첫번째실패정보
                if (failure.path.includes('orderBy')) {
                    return res.status(400).json({
                        path: failure.path.join('.'),
                        message: "The orderBy parameter must be one of the following values: [‘likeCount’, ‘participantCount’, ‘createdAt’]."
                    });
                }
                else if (failure.path.includes('order')) {
                    return res.status(400).json({
                        path: failure.path.join('.'),
                        message: "The order parameter must be one of the following values: [desc, asc]."
                    });
                }
            }
            return next(err);

        }
    }

    /**
     * 그룹 상세 조회
     * GET /groups/:groupId
     */
    async getGroupDetails(req, res, next) {
        try {
            const id = parseInt(req.params.groupId);

            if (isNaN(id)) {
                throw new CustomError('유효하지 않은 그룹 ID입니다.', 400);
            }

            const group = await prismaClient.group.findUnique({
                where: { id: id },
                select: {
                    id: true,
                    groupName: true,
                    description: true,
                    nickname: true,
                    image: true,
                    tag: true,
                    discordwebhookurl: true,
                    discordserverinviteurl: true,
                    goalNumber: true,
                    likes: true,
                    createdAt: true,
                    updatedAt: true,
                    // TODO: participants, medals 모델에 따른 필드 수정 필요
                    participants: {
                        select: { nickname: true }
                    },
                    medals: {
                        select: { type: true, createdAt: true }
                    }
                }
            });

            if (!group) {
                throw new CustomError('해당 그룹을 찾을 수 없습니다.', 404);
            }

            res.status(200).json({
                message: '그룹 상세 조회가 성공적으로 완료되었습니다.',
                group: group,
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * 그룹 정보 수정
     */
    async updateGroup(req, res, next) {
        try {
            const { groupId } = req.params;
            const {
                groupName,
                description,
                image,
                tags,
                goalNumber,
                discordWebhookUrl,
                discordServerInviteUrl,
                password
            } = req.body;

            const id = parseInt(groupId);
            if (isNaN(id)) {
                throw new CustomError('유효하지 않은 그룹 ID입니다.', 400);
            }

            const group = await prismaClient.group.findUnique({
                where: { id: id },
                select: { password: true }
            });

            if (!group) {
                throw new CustomError('해당 그룹을 찾을 수 없습니다.', 404);
            }

            if (!password) {
                throw new CustomError('그룹 수정을 위해서는 비밀번호를 입력해야 합니다.', 401);
            }

            const isPasswordMatch = await bcrypt.compare(password, group.password);

            if (!isPasswordMatch) {
                throw new CustomError('비밀번호가 일치하지 않습니다. 그룹 수정 권한이 없습니다.', 403);
            }

            const updateData = {};
            if (groupName) updateData.groupName = groupName;
            if (description) updateData.description = description;
            if (image) updateData.image = image;
            if (goalNumber !== undefined) updateData.goalNumber = Number(goalNumber);
            if (discordWebhookUrl) updateData.discordwebhookurl = discordWebhookUrl;
            if (discordServerInviteUrl) updateData.discordserverinviteurl = discordServerInviteUrl;
            if (tags !== undefined) updateData.tag = tags;

            const updatedGroup = await prismaClient.group.update({
                where: { id: id },
                data: updateData,
                select: {
                    id: true,
                    groupName: true,
                    description: true,
                    updatedAt: true,
                }
            });

            res.status(200).json({
                message: '그룹 정보가 성공적으로 수정되었습니다.',
                group: updatedGroup,
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * 그룹 삭제
     * DELETE /groups/:groupId
     */
    async deleteGroup(req, res, next) {
        try {
            const id = parseInt(req.params.groupId);
            const { password } = req.body;

            if (isNaN(id)) {
                throw new CustomError('유효하지 않은 그룹 ID입니다.', 400);
            }

            // 1. 현재 그룹 정보 조회 및 비밀번호 확인
            const group = await prismaClient.group.findUnique({
                where: { id: id },
                select: { password: true }
            });

            if (!group) {
                throw new CustomError('해당 그룹을 찾을 수 없습니다.', 404);
            }

            if (!password) {
                throw new CustomError('그룹 삭제를 위해서는 비밀번호를 입력해야 합니다.', 401);
            }

            const isPasswordMatch = await bcrypt.compare(password, group.password);

            if (!isPasswordMatch) {
                throw new CustomError('비밀번호가 일치하지 않습니다. 그룹 삭제 권한이 없습니다.', 403);
            }

            // 2. 그룹 삭제 실행
            await prismaClient.group.delete({
                where: { id: id },
            });

            res.status(204).send(); // 204 No Content

        } catch (error) {
            next(error);
        }
    }
    async GetGroupList(req, res) {
        const { page = 1, limit = 10, order = 'desc', orderBy = 'createdAt', search } = create(req.query, GetGroupListParamsStruct);
        const where = {
            title: search ? { contains: search } : undefined,
        };

        const totalCount = await prismaClient.group.count({ where });

        let orderBySetting;
        switch (orderBy) {
            case 'likeCount': { orderBySetting = { likeCount: order }; } break;
            case 'participantCount': { orderBySetting = { participantCount: order }; } break;
            case 'createdAt': { orderBySetting = { createdAt: order }; } break;
            default: { orderBySetting = { createdAt: order }; } break;
        }

        const groups = await prismaClient.group.findMany({
            select: {
                id: true,
                groupName: true,
                description: true,
                nickname: true,
                image: true,
                tag: true,
                goalNumber: true,
                likes: true,
                createdAt: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: orderBySetting,
            where,
        });
        return res.send({ list: groups, totalCount });
    }


    async PostGroupLike(req, res) {
        const { groupId } = req.params;
        const id = parseInt(groupId);
        // assert(id, AddGroupLike);

        const updatedGroup = await prismaClient.group.update({
            where: { id: id },
            data: {
                likes: { increment: 1 }
            },
            select: {
                id: true,
                likes: true
            }
        });
        res.status(200).send(updatedGroup);
    }

    async DeleteGroupLike(req, res) {
        const { groupId } = req.params;
        const id = parseInt(groupId);
        // assert(req.params, MinusGroupLike);
        const updatedGroup = await prismaClient.group.update({
            where: { id: id },
            data: {
                likes: { decrement: 1 }
            },
            select: {//select안에 있는 필드만 updatedGroup에 할당시켜줘
                id: true,
                likes: true
            }
        });
        res.status(200).send(updatedGroup);
    }

}

