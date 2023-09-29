import Router from '@koa/router'
import { authDo } from './user'
import * as mark from '@/services/mark'

export const router = new Router()

router
    .get(
        '/',
        authDo(async (token) => mark.get(token.id))
    )
    .post(
        '/',
        authDo(async (token, ctx) => mark.set(token.id, ctx.request.body))
    )
    .post(
        '/share',
        authDo(async (token) => mark.share(token.id))
    )
    .delete(
        '/share',
        authDo(async (token) => mark.unshare(token.id))
    )
    .get(
        '/share/:id',
        async (ctx) => (ctx.body = await mark.getShare(ctx.params.id))
    )

export default router.routes()
