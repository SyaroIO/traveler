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

export const share = async (user: string) => {
    if (await mark.share(user)) return { success: true, code: 0 }
    return { success: false, code: 1 }
}

export const unshare = async (user: string) => {
    if (await mark.unshare(user)) return { success: true, code: 0 }
    return { success: false, code: 1 }
}

export const getShare = async (user: string) => {
    const data = await mark.getShare(user)
    if (!data) return { success: false, code: 1 }
    return { success: true, code: 0, data }
}
