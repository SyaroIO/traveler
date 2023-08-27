import * as mark from '@/models/mark'

export const get = async (user: string) => {
    return {
        success: true,
        code: 0,
        data: await mark.get(user)
    }
}

export const set = async (user: string, marks: [number, number][]) => {
    if (await mark.set(user, marks)) return { success: true, code: 0 }
    return { success: false, code: 1 }
}
