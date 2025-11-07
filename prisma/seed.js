import mongoose from 'mongoose';
import data from './mock.js';
import { DATABASE_URL } from '../env.js';

mongoose.connect(DATABASE_URL);
