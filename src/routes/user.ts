import Router from '@koa/router'
import type { Middleware } from '@koa/router'
import * as user from '@/services/user'
import { createToken } from '@/token'
import type { AuthToken, FingerprintToken } from '@/token'

export const router = new Router()

const genCookie = (data: Parameters<typeof createToken>[0]) => {
    const token = createToken(data)
    const httpOnly = true
    const expires = new Date()
    expires.setFullYear(expires.getFullYear() + 10)
    return { name: 'token', value: token, opts: { httpOnly, expires } }
}

router
    .post('/register', async (ctx) => {
        const doc = ctx.request.body
        ctx.body = await user.register(doc)
    })
    .post('/register/resend', async (ctx) => {
        const doc = ctx.request.body
        ctx.body = await user.resend(doc)
    })
    .post('/register/verification', async (ctx) => {
        const doc = ctx.request.body
        const result = await user.verification(doc)
        ctx.body = result
        if (!result.success) return
        const { name, value, opts } = genCookie(result.data as object)
        ctx.cookies.set(name, value, opts)
    })
    .post('/authenticate', async (ctx) => {
        const doc = ctx.request.body
        const result = await user.authenticate(doc)
        ctx.body = result
        if (!result.success) return
        const { name, value, opts } = genCookie(result.data as object)
        ctx.cookies.set(name, value, opts)
    })
    .post('/check/id', async (ctx) => {
        const doc = ctx.request.body
        ctx.body = await user.checkId(doc)
    })
    .post('/check/email', async (ctx) => {
        const doc = ctx.request.body
        ctx.body = await user.checkEmail(doc)
    })

export default router.routes()

export const NoAuth = {
    success: false,
    code: 999,
    message: 'NoAuth'
}

export const NoToken = {
    success: false,
    code: 998,
    message: 'NoToken'
}

declare type MiddlewareWithToken<T = AuthToken | FingerprintToken> = (
    token: T,
    ...args: Parameters<Middleware>
) => ReturnType<Middleware>

export const needAuth =
    (middleware: MiddlewareWithToken<AuthToken>): Middleware =>
    async (ctx, next) => {
        if (!ctx.token.auth) {
            ctx.body = NoAuth
            return
        }
        return middleware(ctx.token, ctx, next)
    }

export const needToken =
    (middleware: MiddlewareWithToken): Middleware =>
    async (ctx, next) => {
        if (ctx.token.none) {
            ctx.body = NoToken
            return
        }
        return middleware(ctx.token, ctx, next)
    }

declare type QuickMiddlewareWithToken<
    Return,
    T = AuthToken | FingerprintToken
> = (token: T, ctx: Parameters<Middleware>[0]) => Promise<Return>

export const authDo =
    <Return>(middleware: QuickMiddlewareWithToken<Return>): Middleware =>
    async (ctx) => {
        if (!ctx.token.auth) {
            ctx.body = NoAuth
            return
        }
        ctx.body = await middleware(ctx.token, ctx)
    }

export const tokenDo =
    <Return>(middleware: QuickMiddlewareWithToken<Return>): Middleware =>
    async (ctx) => {
        if (ctx.token.none) {
            ctx.body = NoToken
            return
        }
        ctx.body = await middleware(ctx.token, ctx)
        console.log(ctx.body)
    }
