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
    }
  }).then((response) => response.json())

export const postApi = async <T>(uri: string, doc?: object): Promise<Result<T>> =>
  fetch(base + uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(doc)
  }).then((response) => response.json())
