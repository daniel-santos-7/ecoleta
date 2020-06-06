import axios from 'axios';

export const baseURL = 'http://192.168.0.106:3333';

export default axios.create({ baseURL });