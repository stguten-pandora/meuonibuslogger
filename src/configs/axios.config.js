import axios from 'axios';

const http = axios.create({
    baseURL: 'http://zn5.m2mcontrol.com.br/api',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    }
});

export default http;