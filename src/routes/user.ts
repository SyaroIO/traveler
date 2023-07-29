import Router from '@koa/router'
import * as user from '@/services/user'
import { createToken } from '@/token'

export const router = new Router()

router
    .post('/register', async (ctx) => {
        const doc = ctx.request.body
        ctx.body = await user.register(doc)
    })
    .post('/register/resend', async (ctx) => {
        const doc = ctx.request.body
        ctx.body = await user.resend(doc)
    })
    .post('/register/verification', async (ctx) => {
        const doc = ctx.request.body
        const result = await user.verification(doc)
        ctx.body = result
        if (!result.success) return
        const token = createToken(result.data as object)
        ctx.cookies.set('token', token, { httpOnly: true })
    })
    .post('/authenticate', async (ctx) => {
        const doc = ctx.request.body
        const result = await user.authenticate(doc)
        ctx.body = result
        if (!result.success) return
        const token = createToken(result.data as object)
        ctx.cookies.set('token', token, { httpOnly: true })
    })
    .post('/check/id', async (ctx) => {
        const doc = ctx.request.body
        ctx.body = await user.checkId(doc)
    })
    .post('/check/email', async (ctx) => {
        const doc = ctx.request.body
        ctx.body = await user.checkEmail(doc)
    })

export default router.routes()
