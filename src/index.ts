import Koa from 'koa'
import koaBody from 'koa-body'
import logger from '@/middlewares/logger'
import routes from '@/middlewares/router'
import frontend from '@/middlewares/frontend'
import log from '@/logger'

async function main() {
    new Koa()
        .use(logger())
        .use(koaBody())
        .use(routes())
        .use(await frontend())
        .listen(80, '0.0.0.0', () => {
            log.info('local: http://127.0.0.1')
        })
}
main()
