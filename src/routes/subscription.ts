import Router from '@koa/router'
import { PassThrough } from 'node:stream'
import emitter from '@/event'

export const router = new Router()
router
    .get('/:type/:id', async (ctx) => {
        const type = ctx.params.type
        const id = ctx.params.id
        switch (type) {
            case 'room':
                break
            case '':
            default:
                ctx.status = 404
                ctx.body = { message: 'Invalid type!' }
                return
        }
        ctx.request.socket.setTimeout(0)
        ctx.req.socket.setNoDelay(true)
        ctx.req.socket.setKeepAlive(true)
        ctx.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        })
        const stream = new PassThrough()
        ctx.body = stream
        ctx.status = 200
        emitter.on(`subscription:${type}:${id}`, (data) => {
            stream.write(JSON.stringify(data))
        })
    })
    .post('/:type/:id', async (ctx) => {
        const type = ctx.params.type
        const id = ctx.params.id
        switch (type) {
            case 'room':
                break
            case '':
            default:
                ctx.status = 404
                ctx.body = { message: 'Invalid type!' }
                return
        }
        const data = ctx.request.body
        emitter.emit(`subscription:${type}:${id}`, data)
        ctx.status = 200
    })

export default router.routes()
