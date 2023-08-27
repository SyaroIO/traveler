import Koa from 'koa'
import koaBody from 'koa-body'
import initDatabase from '@/database/init'
import logger from '@/middlewares/logger'
import token from '@/middlewares/token'
import proxy from '@/middlewares/proxy'
import routes from '@/middlewares/router'
import frontend from '@/middlewares/frontend'
import log from '@/log'
import { socket } from 'config'

export interface Socket {
    /** @default 80 */
    port?: number
    /** @default '127.0.0.1' */
    host?: string
}

async function main() {
    await initDatabase()

    const port = socket?.port ?? 80
    const host = socket?.host ?? '127.0.0.1'
    new Koa()
        .use(logger())
        .use(proxy())
        .use(koaBody())
        .use(token())
        .use(routes())
        .use(await frontend())
        .listen(port, host, () => {
            const p = port === 80 ? '' : `:${port}`
            const h = host === '0.0.0.0' ? '127.0.0.1' : host
            log.log(`🔔 [${host}:${port}] http://${h}${p}/`)
        })
}
main()
