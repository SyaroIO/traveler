import { collection, oid } from '@/database'
import logger from '@/log'

const [rooms, roomsInit] = collection('rooms')
const [roomRecord, recordInit] = collection('room-records', [['room', 'user']])
export default async () => {
    await roomsInit()
    await recordInit()
}

export const get = async (owner: string) =>
    rooms
        .find({ owner }, { projection: { data: 0 } })
        .toArray()
        .then((rooms) => rooms.map(({ _id }) => _id.toHexString()))

export const create = async (
    owner: string,
    password: string
): Promise<{ success: boolean; id?: string }> =>
    rooms
        .insertOne({ owner, password })
        .then(({ insertedId }) => {
            logger.debug(`create room ${insertedId}`)
            return {
                success: true,
                id: insertedId.toHexString()
            }
        })
        .catch((e) => {
            logger.debug(e)
            return { success: false }
        })

export const info = async (id: string, password: string) => {
    const array = await rooms
        .aggregate([
            { $match: { _id: oid(id), password } },
            {
                $lookup: {
                    from: 'room-records',
                    localField: '_id',
                    foreignField: 'room',
                    pipeline: [
                        {
                            $group: {
                                _id: '$mark',
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                k: { $toString: '$_id' },
                                v: '$count'
                            }
                        }
                    ],
                    as: 'records'
                }
            },
            {
                $project: {
                    _id: 0,
                    records: {
                        $arrayToObject: '$records'
                    }
                }
            }
        ])
        .toArray()

    if (!array || array.length === 0) return null
    const [{ records }] = array
    return records
}

export const mark = async (
    user: string,
    room: string,
    password: string,
    mark: number
) => {
    const id = oid(room)
    const count = await rooms.countDocuments({ _id: id, password })
    if (count === 0) return null

    return roomRecord
        .findOneAndUpdate(
            { user, room: id },
            { $set: { mark } },
            { upsert: true }
        )
        .then(({ value }) => ({
            mark: value?.mark
        }))
}
