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

export default router.routes()
