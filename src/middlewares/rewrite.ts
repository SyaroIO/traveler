import { URL } from 'url'
import logger from '../logger/index.js'

export default () => (ctx, next) => {
    if (ctx.method !== 'GET') return next();
    switch (ctx.accepts('html', '*/*')) {
        case 'html':
        case '*/*':
            const { pathname } = new URL(ctx.url, 'http://localhost');
            if (pathname.lastIndexOf('.') > pathname.lastIndexOf('/'))
                break;
            logger.debug('Rewriting', ctx.method, ctx.url, 'to', '/index.html')
            ctx.url = '/index.html';
    }
    return next()
}