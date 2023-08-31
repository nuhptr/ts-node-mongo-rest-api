import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import mongoose from 'mongoose';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(cors({ origin: true, credentials: true }));

const server = http.createServer(app);

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});

const MONGO_URL = process.env.MONGO_URL as string;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
