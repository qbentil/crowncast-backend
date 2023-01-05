import express, { Response, Request } from 'express';
import ErrorHandler from './middleware/errorHandler';
import dotenv from 'dotenv';
import DBCONNECT from './config/dbconnection';
import { EventRoute } from './routes';
dotenv.config();
const PORT = process.env.PORT || 3000;
// init App
const app = express();
app.use(express.json());

app.use("/event", EventRoute)

// ERROR HANDLER MIDDLEWARE
app.use(ErrorHandler);


app.listen(PORT, async() => {
    await DBCONNECT();
    console.log(`Server running on port ${PORT}🚀`);
})
