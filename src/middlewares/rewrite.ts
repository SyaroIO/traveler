import { Middleware } from 'koa'
import { URL } from 'url'
import logger from '@/logger'

export default (): Middleware => (ctx, next) => {
    if (ctx.method !== 'GET') return next()
    const { pathname } = new URL(ctx.url, 'http://localhost')
    switch (ctx.accepts('html', '*/*')) {
        case 'html':
        case '*/*':
            if (pathname.lastIndexOf('.') > pathname.lastIndexOf('/')) break
            logger.debug('Rewriting', ctx.method, ctx.url, 'to', '/index.html')
            ctx.url = '/index.html'
    }
    return next()
}
