import Koa from 'koa'
import logger from '@/middlewares/logger'
import routes from '@/middlewares/router'
import rewrite from '@/middlewares/rewrite'
import frontend from '@/middlewares/frontend'
import log from '@/logger'

new Koa()
    .use(logger())
    .use(routes())
    .use(rewrite())
    .use(frontend())
    .listen(80, '0.0.0.0', () => {
        log.info('local: http://127.0.0.1')
    })
