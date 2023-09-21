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
        .find({ owner })
        .toArray()
        .then((rooms) =>
            rooms.map(({ _id, password, name }) => [
                _id.toHexString(),
                password,
                name
            ])
        )

export const create = async (
    owner: string,
    password: string,
    name: string
): Promise<{ success: boolean; id?: string }> =>
    rooms
        .insertOne({ owner, password, name })
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

export const del = async (owner: string, id: string) =>
    rooms
        .deleteOne({ owner, _id: oid(id) })
        .then(({ acknowledged }) => acknowledged)

export const info = async (user: string, id: string, password: string) => {
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
                                _id: {
                                    k: { $toString: '$mark' },
                                    me: {
                                        $eq: ['$user', user]
                                    }
                                },
                                v: { $sum: 1 }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    me: '$_id.me'
                                },
                                records: {
                                    $addToSet: {
                                        k: '$_id.k',
                                        v: '$v'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                me: '$_id.me',
                                records: {
                                    $arrayToObject: '$records'
                                }
                            }
                        }
                    ],
                    as: 'records'
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    records: 1
                }
            }
        ])
        .toArray()

    if (!array || array.length === 0) return null
    return array[0]
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
