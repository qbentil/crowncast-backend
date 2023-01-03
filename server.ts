import express from 'express';
// init App
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello CrownCast!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
