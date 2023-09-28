import { sseJsonApi, postApi, getApi, deleteApi } from '.'
import type { Result } from '.'

export interface RoomRecord {
  me: boolean
  records: {
    [key: number]: number
  }
}

export interface RoomInitMessage {
  type: 'init'
  data: Result<{
    name: string
    records: RoomRecord[]
  }>
}

export interface RoomUpdateMessage {
  type: 'update'
  // [mark, before]
  data: [number, number]
}

export declare type RoomMessage = RoomInitMessage | RoomUpdateMessage

const base = '/room'

export const join = <M = RoomMessage>(
  id: string,
  password: string,
  onmessage: Parameters<typeof sseJsonApi<M>>[1],
  onerror: Parameters<typeof sseJsonApi<M>>[2]
) => {
  const sse = sseJsonApi<M>(`${base}/${id}/${password}`, onmessage, onerror)
  return () => sse.close()
}

export const mark = async (id: string, password: string, mark: number) =>
  postApi<void>(`${base}/${id}/${password}`, { mark })

export type Room = [string, string, string]
export const get = async () => getApi<Room[]>(`${base}`)

export const create = async (name: string, password: string) =>
  postApi<string>(`${base}`, { name, password })

export const del = async (id: string) => deleteApi(`${base}/${id}`)
