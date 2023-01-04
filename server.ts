import express, { Response, Request } from 'express';
import dotenv from 'dotenv';
import DBCONNECT from './config/dbconnection';
dotenv.config();
const PORT = process.env.PORT || 3000;
// init App
const app = express();
app.use(express.json());



app.listen(PORT, async() => {
    await DBCONNECT();
    console.log(`Server running on port ${PORT}🚀`);
})
