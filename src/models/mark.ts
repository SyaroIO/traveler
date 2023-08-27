import { collection } from '@/database'
import logger from '@/log'

const [marks, init] = collection('marks', ['id'])
export default init

export const get = async (id: string) =>
    marks
        .findOne({ id }, { projection: { _id: 0 } })
        .then((result) => result?.v ?? [])
        .catch(() => [])

export const set = async (id: string, v: number[][]) =>
    marks
        .updateOne({ id }, { $set: { v } }, { upsert: true })
        .then(() => true)
        .catch((e) => {
            logger.debug(e)
            return false
        })
