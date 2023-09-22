import { hookResult } from './hook'
const base = '/api'
export interface BaseResult {
  success: boolean
  code: number
}
export interface FailedResult extends BaseResult {
  message: string
}

export interface SuccessResult<T> extends BaseResult {
  data: T
}

export type Result<T> = FailedResult & SuccessResult<T>

export const getApi = async <T>(uri: string): Promise<Result<T>> =>
  fetch(base + uri, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).then((response) => hookResult(response.json()))

export const postApi = async <T>(
  uri: string,
  doc?: object
): Promise<Result<T>> =>
  fetch(base + uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(doc)
  }).then((response) => hookResult(response.json()))

export const deleteApi = async (uri: string): Promise<Result<void>> =>
  fetch(base + uri, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).then((response) => hookResult(response.json()))

export const sseApi = (
  uri: string,
  onmessage: (message: string) => void,
  onerror: (err: Event) => void
) => {
  const source = new EventSource(base + uri, {
    withCredentials: true
  })
  source.addEventListener('message', (e) => onmessage(e.data), false)
  source.addEventListener(
    'error',
    (e) => {
      source.close()
      onerror(e)
    },
    false
  )
  return source
}

export const sseJsonApi = <T>(
  uri: string,
  onmessage: (message: T) => void,
  onerror: () => void
) => {
  const source = sseApi(
    uri,
    (message) => {
      try {
        onmessage(JSON.parse(message) as T)
      } catch {
        source.close()
        onerror()
      }
    },
    onerror
  )
  return source
}
