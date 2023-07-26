import Koa from 'koa';
import logger from '@/middlewares/logger';
import routes from '@/middlewares/router';
import rewrite from '@/middlewares/rewrite';
import frontend from '@/middlewares/frontend';

new Koa()
    .use(logger())
    .use(routes())
    .use(rewrite())
    .use(frontend())
    .listen({ port: 80, host: '0.0.0.0' });