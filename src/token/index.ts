import { sign, verify, Algorithm } from 'jsonwebtoken'
import config from '@/config'

interface TokenConfig {
    secret: string
    expiresIn?: string
    algorithm?: Algorithm
}

const tokenConfig = config.token as unknown as TokenConfig
const secret = tokenConfig.secret
if (!secret) throw new Error('Token secret is not set!')
const expiresIn = tokenConfig.expiresIn ?? '1y'
const algorithm = tokenConfig.algorithm ?? ('HS256' as Algorithm)

export const createToken = (payload: object) => sign(payload, secret, { expiresIn, algorithm })
export const verifyToken = (token: string) => {
    try {
        return verify(token, secret)
    } catch {
        return null
    }
}
