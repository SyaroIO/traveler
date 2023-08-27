import Router from '@koa/router'
import { authDo, tokenDo, needToken } from './user'
import * as room from '@/services/room'
import sse from '@/utils/sse'
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
    .get(
        '/:id/:password',
        needToken(async (token, ctx) => {
            const id = ctx.params.id
            const password = ctx.params.password
            const { write, close, onclose } = sse(ctx)

            const data = await room.info(id, password)
            write({ type: 'init', data })
            if (!data.success) return close()
            const listener = (data: RoomEventData) => {
                if (data.user === token.id) return
                write({ type: 'update', data: [data.mark, data.before] })
            }
            const eventId = `room#${id}`
            emitter.on(eventId, listener)
            onclose(() => emitter.off(eventId, listener))
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
