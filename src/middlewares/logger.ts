import { Middleware } from 'koa'
import { getLogger } from '@/logger'

const logger = getLogger('request')
export default (): Middleware => async (ctx, next) => {
    const start = Date.now()
    const { method, url, res } = ctx

    const done = () => {
        res.removeListener('finish', done)
        res.removeListener('close', done)
        logger.debug(method, url, Date.now() - start, ctx.status || 404)
    }

    res.once('finish', done)
    res.once('close', done)
    await next()
}
