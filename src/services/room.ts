import { isOid } from '@/database'
import * as room from '@/models/room'
import { asyncEmit } from '@/event'

export const get = async (user: string) => {
    return {
        success: true,
        code: 0,
        data: await room.get(user)
    }
}

export const create = async (
    user: string,
    { name, password }: { password: string; name: string }
) => {
    const { success, id } = await room.create(user, password, name)
    if (success) return { success: true, code: 0, data: id }
    return { success: false, code: 1 }
}

export const del = async (user: string, id: string) => {
    if (!isOid(id)) return { success: false, code: 1, message: 'Invalid ID' }
    const ret = await room.del(user, id)
    if (ret) return { success: true, code: 0 }
    return { success: false, code: 2, message: 'Room does not exist' }
}

export const info = async (id: string, password: string) => {
    if (!isOid(id)) return { success: false, code: 1, message: 'Invalid ID' }
    const data = await room.info(id, password)
    if (data) return { success: true, code: 0, data }
    return { success: false, code: 2, message: 'Room does not exist' }
}

export interface RoomEventData {
    user: string
    mark: number
    before: number | null
}

export const mark = async (
    user: string,
    id: string,
    password: string,
    { mark }: { mark: number }
) => {
    if (!isOid(id)) return { success: false, code: 1, message: 'Invalid ID' }
    const data = await room.mark(user, id, password, mark)
    if (!data) return { success: false, code: 2, message: 'Room Error' }
    if (mark != data.mark)
        asyncEmit(`room#${id}`, { user, mark, before: data.mark })
    return { success: true, code: 0 }
}
