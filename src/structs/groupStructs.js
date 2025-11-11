import { object, number, min, partial, coerce, string } from "superstruct";
import { pageParamsStruct } from './commonStructs.js';

const NumericString = coerce(number(), string(), (value) => {
    // 10진수 정수로 변환
    const parsed = parseInt(value, 10);
    // NaN (Not a Number)가 아닌지 확인
    return isNaN(parsed) ? undefined : parsed;
});

export const GetGroupListParamsStruct = pageParamsStruct;

// export const AddGroupLike = object({ groupId: min(NumericString, 0) });

// export const MinusGroupLike = partial(AddGroupLike);



