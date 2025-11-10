
import { AddGroupLike, MinusGroupLike, GetGroupListParamsStruct } from '../structs/groupStructs.js';
import { assert } from 'superstruct';
import { prismaClient } from './../libs/constants.js';


export async function GetGroupList(req, res) {
    const { page, limit, order, orderBy, search } = create(req.query, GetGroupListParamsStruct);
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
        skip: (page - 1) * limit,
        take: limit,
        orderBy: orderBySetting,
        where,
    });
    return res.send({ list: groups, totalCount });
}


export async function PostGroupLike(req, res) {
    assert(req.params, AddGroupLike);
    const { groupid } = req.params;
    const updatedGroup = await prismaClient.group.update({
        where: { id: parseInt(groupid) },
        data: {
            likes: { increament: 1 }
        },
        select: {
            id: true,
            likes: true
        }
    });
    res.status(200).send(updatedGroup);
}

export async function DeleteGroupLike(req, res) {
    assert(req.params, MinusGroupLike);
    const { groupid } = req.params;
    const updatedGroup = await prismaClient.group.update({
        where: { id: parseInt(groupid) },
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

