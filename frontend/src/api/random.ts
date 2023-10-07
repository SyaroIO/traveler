import { postApi, getApi } from '.'

const base = '/random'

export const get = async () =>
  getApi<
    {
      me: boolean
      records: {
        [key: number]: number
      }
    }[]
  >(base)
export const set = async () => postApi<number>(base)
