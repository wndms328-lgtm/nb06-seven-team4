import express from 'express';
import { PORT } from './libs/constants.js';
import cors from 'cors';
import grouprouter from './routers/grouprouters.js';

const app = express();
app.use(cors());
app.use(express.json());




app.use('/groups', grouprouter);

app.listen(PORT, () => {
    console.log("Server is Online");
});