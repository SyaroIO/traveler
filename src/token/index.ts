import { sign, verify, Algorithm } from 'jsonwebtoken'
import { token as config } from 'config'
import type { User } from '@/models/user'

export interface TokenConfig {
    secret: string
    /** @default '1y' */
    expiresIn?: string
    /** @default 'HS256' */
    algorithm?: Algorithm
}

const secret = config.secret
if (!secret) throw new Error('Token secret is not set!')
const expiresIn = config.expiresIn ?? '1y'
const algorithm = config.algorithm ?? 'HS256'

export const createToken = (payload: Parameters<typeof sign>[0]) =>
    sign(payload, secret, { expiresIn, algorithm })
export const verifyToken = (token: string | null) => {
    if (!token) return null
    try {
        return verify(token, secret)
    } catch {
        return null
    }
}

export interface NoneToken {
    none: true
    auth?: false
    extra?: object
    id?: string
}

export interface FingerprintToken {
    none: false
    auth: false
    extra: {
        fingerprint: string
    }
    id: string
}
export interface AuthToken {
    none: false
    auth: true
    extra: User
    id: string
}

export declare type Token = AuthToken | FingerprintToken | NoneToken
