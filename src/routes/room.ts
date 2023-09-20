import Router from '@koa/router'
import { authDo, tokenDo, tokenSse } from './user'
import * as room from '@/services/room'
import emitter from '@/event'
import type { RoomEventData } from '@/services/room'

export const router = new Router()

router
    .get(
        '/',
        authDo(async (token) => room.get(token.id))
    )
    .post(
        '/',
        authDo(async (token, ctx) => room.create(token.id, ctx.request.body))
    )
    .delete(
        '/:id',
        authDo(async (token, ctx) => room.del(token.id, ctx.params.id))
    )
    .get(
        '/:id/:password',
        tokenSse(async (token, ctx, source) => {
            const id = ctx.params.id
            const password = ctx.params.password
            const data = await room.info(id, password)
            source.write({ type: 'init', data })
            if (!data.success) {
                source.close()
                return
            }
            const listener = (data: RoomEventData) =>
                source.write({ type: 'update', data: [data.mark, data.before] })

            const eventId = `room#${id}`
            emitter.on(eventId, listener)
            source.onclose(() => emitter.off(eventId, listener))
        })
    )
    .post(
        '/:id/:password',
        tokenDo(async (token, ctx) =>
            room.mark(
                token.id,
                ctx.params.id,
                ctx.params.password,
                ctx.request.body
            )
        )
    )

export default router.routes()
