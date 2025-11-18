import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

export const PORT = process.env.PORT;
export const prismaClient = new PrismaClient;
