import { Middleware } from 'koa'
import { verifyToken } from '@/token'
import type { User } from '@/models/user'
import type { Token } from '@/token'

declare module 'koa' {
    interface DefaultContext extends DefaultContextExtends {
        token: Token
    }
}

const verifyFingerprint = (fingerprint: string | null) =>
    fingerprint && /[0-9a-z]{32}/.test(fingerprint) ? fingerprint : null

export default (): Middleware => async (ctx, next) => {
    const user = verifyToken(ctx.cookies.get('token') ?? null) as User
    const fingerprint = verifyFingerprint(
        ctx.cookies.get('fingerprint') ?? null
    )
    if (user) {
        ctx.token = {
            none: false,
            auth: true,
            extra: user,
            id: user.id
        }
        return await next()
    }
    if (fingerprint)
        ctx.token = {
            none: false,
            auth: false,
            extra: {
                fingerprint
            },
            id: fingerprint
        }
    else ctx.token = { none: true }
    await next()
}
