import { collection } from '@/database'

const [marks, init] = collection('marks', ['id'])
export default init

export const get = async (id: string) =>
    marks.findOne({ id }, { projection: { _id: 0 } }).then((ret) => {
        if (!ret) return { id, marks: [], share: false }
        const { marks, share } = ret
        return { id, marks: marks ?? [], share: share ?? false }
    })

export const set = async (id: string, v: number[][]) => {
    const last = await marks.findOne({ id }).then((ret) => ret?.marks ?? [])
    const map = new Map<number, number>(last)
    for (const [index, value] of v)
        if (value == 0) map.delete(index)
        else map.set(index, value)
    return marks
        .updateOne(
            { id },
            { $set: { marks: Array.from(map.entries()) } },
            { upsert: true }
        )
        .then(() => true)
        .catch(() => false)
}

export const share = async (id: string) =>
    marks.updateOne({ id }, { $set: { share: true } }, { upsert: true })

export const unshare = async (id: string) =>
    marks.updateOne({ id }, { $set: { share: false } }, { upsert: true })

export const getShare = async (id: string) =>
    marks
        .findOne({ id, share: true })
        .then((ret) => ret?.marks ?? null)
        .catch(() => null)
