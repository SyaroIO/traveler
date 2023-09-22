import { getApi, postApi } from '.'

export declare type MarkData = [number, number][]

export const get = async () => getApi<MarkData>(`/mark`)

export const set = async (doc: MarkData) => postApi<void>(`/mark`, doc)
