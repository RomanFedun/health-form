import express from "express";
import cors from 'cors';

const app = express();
const port = 4001;

app.use(cors());

app.get('/', async (req, response) => {
  const url = decodeURI(`https://global.lakmus.org/Dictionaries/icpc2${req.originalUrl}`)
  const fetch_response = await fetch(url);
  const payload = await fetch_response.json();
  response.json({payload});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
