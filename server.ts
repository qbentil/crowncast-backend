import express, { Response, Request } from 'express';
// init App
const app = express();
app.use(express.json());

app.get('/', (req:Request, res:Response) => {
  res.send('Hello CrownCast!');
});

app.get('/api', (req:Request, res:Response) => {
    res.status(200).json({
        message: 'Hello CrownCast!',
        data: {
            name: 'CrownCast',
            age: 1,
            author: 'CrownCast'
        }
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
