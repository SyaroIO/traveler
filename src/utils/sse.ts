import type { Context } from 'koa'
import { PassThrough } from 'node:stream'

const format = <T>(data: T) =>
    `event: message\ndata: ${JSON.stringify(data)}\n\n`

export const sse = (ctx: Context) => {
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

    return {
        write: <T>(data: T) => stream.write(format(data)),
        close: () => stream.end(),
        onclose: (listener: () => void) => stream.on('close', listener)
    }
}

export default sse
