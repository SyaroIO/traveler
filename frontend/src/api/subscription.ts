import { sseJsonApi, postApi } from '.'

export const subscribeRoom = <T>(
  id: string,
  password: string,
  onmessage: Parameters<typeof sseJsonApi<T>>[1],
  onerror: Parameters<typeof sseJsonApi<T>>[2]
) => {
  const sse = sseJsonApi<T>(`/room/${id}/${password}`, onmessage, onerror)
  return () => sse.close()
}

export const messageRoom = async (
  id: string,
  doc: Parameters<typeof postApi>[1]
) => postApi<void>(`/subscription/room/${id}`, doc)
