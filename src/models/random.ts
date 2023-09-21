import { collection } from '@/database'

const [random, init] = collection('random', ['id'])
export default init

export const get = async (id: string) =>
    random
        .aggregate([
            {
                $group: {
                    _id: {
                        me: {
                            $eq: ['$id', id]
                        },
                        v: '$v'
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $group: {
                    _id: {
                        me: '$_id.me'
                    },
                    records: {
                        $addToSet: {
                            k: {
                                $toString: '$_id.v'
                            },
                            v: '$count'
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
        ])
        .toArray()

export const set = async (id: string, v: number) =>
    random
        .insertOne({ id, v })
        .then(({ acknowledged }) => acknowledged)
        .catch(() => false)
