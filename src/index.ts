import Koa from 'koa'
import koaBody from 'koa-body'
import initDatabase from '@/database/init'
import logger from '@/middlewares/logger'
import token from '@/middlewares/token'
import routes from '@/middlewares/router'
import frontend from '@/middlewares/frontend'
import log from '@/log'

async function main() {
    await initDatabase()
    new Koa()
        .use(logger())
        .use(koaBody())
        .use(token())
        .use(routes())
        .use(await frontend())
        .listen(80, '0.0.0.0', () => {
            log.info('local: http://127.0.0.1')
        })
}
main()
