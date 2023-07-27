import Router from '@koa/router'
import { PassThrough } from 'node:stream'
import emitter from '@/event'

export const router = new Router()
    .get('/api', async (ctx) => {
        ctx.body = { message: 'Hello World!' }
    })
    .get('/timeout/:time', async (ctx) => {
        const time = parseInt(ctx.params.time)
        if (isNaN(time) || time < 0 || time > 10000) {
            ctx.status = 400
            ctx.body = { message: 'Invalid time!' }
            return
        }
        ctx.body = await new Promise((r) => setTimeout(() => r({ message: `timeout ${time}` }), time))
    })
    .get('/subscription/:type/:id', async (ctx) => {
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
    .post('/subscription/:type/:id', async (ctx) => {
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

export default () => router.routes()
