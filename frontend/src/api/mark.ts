import { getApi, postApi, deleteApi } from '.'

export declare type MarkData = [number, number][]

export const get = async () =>
  getApi<{
    id: string
    share: boolean
    marks: MarkData
  }>('/mark')

export const set = async (doc: MarkData) => postApi<void>('/mark', doc)

export const share = async () => postApi<void>('/mark/share')
export const unshare = async () => deleteApi('/mark/share')

export const getShare = async (id: string) =>
  getApi<MarkData>(`/mark/share/${id}`)
