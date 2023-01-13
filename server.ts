import express, { Response, Request } from 'express';
import ErrorHandler from './middleware/errorHandler';
import dotenv from 'dotenv';
import DBCONNECT from './config/dbconnection';
import cors from "cors";
import { CategoryRoute, ContestantRoute, EventRoute, OrganizerRoute, UserRoute } from './routes';
dotenv.config();
const PORT = process.env.PORT || 3000;


// init App
const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

app.use("/event", EventRoute)
app.use("/organizer", OrganizerRoute)
app.use("/user", UserRoute)
app.use("/contestant", ContestantRoute)
app.use("/category", CategoryRoute)

// ERROR HANDLER MIDDLEWARE
app.use(ErrorHandler);


app.listen(PORT, async () => {
    await DBCONNECT();
    console.log(`Server running on port ${PORT}🚀`);
})
