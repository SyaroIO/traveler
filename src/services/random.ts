import * as random from '@/models/random'

export const get = async (user: string) => {
    return {
        success: true,
        code: 0,
        data: await random.get(user)
    }
}

const r = () => Math.floor(497 * Math.random())
export const set = async (user: string) => {
    const data = r()
    if (await random.set(user, data)) return { success: true, code: 0, data }
    return { success: false, code: 1 }
}
