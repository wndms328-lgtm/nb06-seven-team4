import { coerce, integer, object, string, defaulted, optional, enums, nonempty } from 'superstruct';

const integerString = coerce(integer(), string(), (value) => parseInt(value));

const orderEnum = enums(['asc', 'desc']);
const orderByEnum = enums(['likeCount', 'participantCount', 'createdAt']);


export const pageParamsStruct = object({
    page: defaulted(integerString, 1),
    limit: defaulted(integerString, 10),
    order: defaulted(orderEnum, 'desc'),
    orderBy: defaulted(orderByEnum, 'createdAt'),
    search: optional(nonempty(string())),
});
