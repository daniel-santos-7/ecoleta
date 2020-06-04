import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';

const server = express();

server.use(cors());
server.use(express.json());
server.use(routes);
server.use('/uploads',express.static(path.resolve(__dirname,'..','uploads')));

export default server;