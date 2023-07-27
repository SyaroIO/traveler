import { Middleware } from 'koa'
import { URL } from 'node:url'
import serve from 'koa-static'
import connect from 'koa-connect'
import vite from 'vite'
import { getLogger } from '@/logger'

export default async (): Promise<Middleware> => {
    if (process.env.NODE_ENV === 'production') {
        const logger = getLogger('request')
        const distServe = serve('dist/frontend', { maxage: 1000 * 60 * 60 * 24 * 7 })
        return (ctx, next) => {
            if (ctx.method !== 'GET') return next()
            const { pathname } = new URL(ctx.url, 'http://localhost')
            switch (ctx.accepts('html', '*/*')) {
                case 'html':
                case '*/*':
                    if (pathname.lastIndexOf('.') > pathname.lastIndexOf('/')) break
                    logger.debug('Rewriting', ctx.method, ctx.url, 'to', '/index.html')
                    ctx.url = '/index.html'
            }
            return distServe(ctx, next)
        }
    }

    return connect(
        (
            await vite.createServer({
                root: 'frontend',
                server: {
                    middlewareMode: true
                }
            })
        ).middlewares
    )
}
