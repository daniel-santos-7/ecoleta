import express from 'express';
import routes from './routes';
import path from 'path';

const server = express();

server.use(express.json());
server.use(routes);
server.use('/uploads',express.static(path.resolve(__dirname,'..','uploads')));

export default server;