import { sseJsonApi, postApi } from '.'

export const subscribe = <T>(
  id: string,
  password: string,
  onmessage: Parameters<typeof sseJsonApi<T>>[1],
  onerror: Parameters<typeof sseJsonApi<T>>[2]
) => {
  const sse = sseJsonApi<T>(`/room/${id}/${password}`, onmessage, onerror)
  return () => sse.close()
}

export const mark = async (id: string, doc: Parameters<typeof postApi>[1]) =>
  postApi<void>(`/room/${id}`, doc)
