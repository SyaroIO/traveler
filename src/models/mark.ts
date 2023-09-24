import { collection } from '@/database'

const [marks, init] = collection('marks', ['id'])
export default init

export const get = async (id: string) =>
    marks
        .findOne({ id }, { projection: { _id: 0 } })
        .then((result) => result?.v ?? [])
        .catch(() => [])

export const set = async (id: string, v: number[][]) => {
    const last = await marks.findOne({ id }).then((ret) => ret?.v ?? [])
    const map = new Map<number, number>(last)
    for (const [index, value] of v)
        if (value == 0) map.delete(index)
        else map.set(index, value)
    return marks
        .updateOne(
            { id },
            { $set: { v: Array.from(map.entries()) } },
            { upsert: true }
        )
        .then(() => true)
        .catch(() => false)
}
