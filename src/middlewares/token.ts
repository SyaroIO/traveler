import { Middleware } from 'koa'
import { User } from '@/models/user'
import { verifyToken } from '@/token'

declare module 'koa' {
    interface Request extends BaseRequest {
        user?: User
    }
}

export default (): Middleware => async (ctx, next) => {
    const token = ctx.cookies.get('token')
    if (!token) return await next()
    ctx.request.user = verifyToken(token) as User
    await next()
}
