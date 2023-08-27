import Router from '@koa/router'
import user from '@/routes/user'
import mark from '@/routes/mark'
import room from '@/routes/room'
import debug from '@/routes/debug'

const api = new Router()
    .use('/user', user)
    .use('/mark', mark)
    .use('/room', room)

if (process.env.NODE_ENV !== 'production') api.use('/debug', debug)

export const router = new Router().use(
    '/api',
    api.routes(),
    api.allowedMethods()
)

export default () => router.routes()
