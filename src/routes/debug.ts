import Router from '@koa/router'

export const router = new Router()

router
    .get('/', async (ctx) => (ctx.body = { success: true, code: 0, message: 'Hello World!' }))
    .get('/whoami', async (ctx) => {
        const user = ctx.request.user
        ctx.body = user ? { success: true, code: 0, message: `You are @${user.id}`, user } : { success: false, code: 1, message: 'You are not logged in!' }
    })
    .get('/error', async () => {
        throw new Error('error')
    })
    .get('/timeout/:time', async (ctx) => {
        const time = parseInt(ctx.params.time)
        if (isNaN(time) || time < 0 || time > 10000) {
            ctx.status = 400
            ctx.body = { success: false, code: 1, message: 'Invalid time!' }
            return
        }
        ctx.body = await new Promise((r) => setTimeout(() => r({ success: true, code: 0, message: `timeout ${time}` }), time))
    })

export default router.routes()
