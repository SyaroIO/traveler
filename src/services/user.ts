import { createHmac } from 'node:crypto'
import { isString } from '@/utils/valid'
import { isEmail, sendCode } from '@/mail'
import * as user from '@/models/user'

export const encodePassword = (password: string) =>
    createHmac('sha256', password).update(`pl0m${password}55bd`).digest('hex')

const idRule = /^[A-Za-z0-9_\-.]{1,16}$/
export const isId = (id: string) => isString(id) && idRule.test(id)
const L = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const generatedCode = () => {
    let t = (Date.now() % 1000000000) + Math.ceil(Math.random() * 2176782336)
    const code = []
    for (let i = 0; i < 6; i++) {
        code.push(L[t % 36])
        t = Math.floor(t / 36)
    }
    return code.join('')
}

export const register = async ({
    id,
    name,
    email,
    password
}: {
    id: string
    name: string
    email: string
    password: string
}) => {
    if (!isId(id) || !isString(name) || !isEmail(email) || !isString(password))
        return {
            success: false,
            code: 1,
            message: 'Invalid parameters!'
        }

    const code = generatedCode()
    if (
        !(await user.register({
            id,
            name,
            email,
            verification: code,
            password: encodePassword(password)
        }))
    )
        return {
            success: false,
            code: 3,
            message: 'User already exists'
        }
    if (await sendCode(email, code))
        return {
            success: true,
            code: 0
        }
    return {
        success: false,
        code: 4,
        message: 'Send ValidCode failed!'
    }
}

export const verification = async ({
    email,
    verification
}: {
    email: string
    verification: string
}) => {
    if (!isEmail(email) || !isString(verification))
        return {
            success: false,
            code: 1,
            message: 'Invalid parameters!'
        }
    const data = await user.verification(email, verification.toUpperCase())
    if (!data)
        return {
            success: false,
            code: 2,
            message: 'Verification failed!'
        }
    return {
        success: true,
        code: 0,
        data
    }
}

export const authenticate = async ({
    email,
    password
}: {
    email: string
    password: string
}) => {
    if (!isEmail(email) || !isString(password))
        return {
            success: false,
            code: 1,
            message: 'Invalid parameters!'
        }
    const data = await user.authenticate(email, encodePassword(password))
    if (!data)
        return {
            success: false,
            code: 2,
            message: 'Authentication failed!'
        }
    if (data.verification)
        return {
            success: false,
            code: 3,
            message: 'User not verified!'
        }

    return {
        success: true,
        code: 0,
        data
    }
}

export const resend = async ({ email }: { email: string }) => {
    if (!isEmail(email))
        return {
            success: false,
            code: 1,
            message: 'Invalid parameters!'
        }
    const data = await user.findByEmail(email)
    if (!data)
        return {
            success: false,
            code: 2,
            message: 'User not found!'
        }
    const code = data.verification
    if (!code)
        return {
            success: false,
            code: 3,
            message: 'User already verified!'
        }
    if (!(await sendCode(email, code)))
        return {
            success: false,
            code: 4,
            message: 'Send ValidCode failed!'
        }

    return {
        success: true,
        code: 0
    }
}

export const checkId = async ({ id }: { id: string }) => {
    if (!isId(id))
        return {
            success: false,
            code: 1,
            message: 'Invalid parameters!'
        }
    return {
        success: true,
        code: 0,
        data: await user.checkId(id)
    }
}

export const checkEmail = async ({ email }: { email: string }) => {
    if (!isEmail(email))
        return {
            success: false,
            code: 1,
            message: 'Invalid parameters!'
        }
    return {
        success: true,
        code: 0,
        data: await user.checkEmail(email)
    }
}
