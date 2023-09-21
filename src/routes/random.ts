import Router from '@koa/router'
import { tokenDo } from './user'
import * as random from '@/services/random'

export const router = new Router()

router
    .get(
        '/',
        tokenDo(async (token) => random.get(token.id))
    )
    .post(
        '/',
        tokenDo(async (token) => random.set(token.id))
    )

export default router.routes()
