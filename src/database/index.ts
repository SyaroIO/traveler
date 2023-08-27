import { MongoClient, ObjectId } from 'mongodb'
import type { Collection, IndexSpecification } from 'mongodb'
import { database as config } from 'config'
import logger from '@/log'

export interface DatabaseConfig {
    /** @default 'mongodb://127.0.0.1' */
    uri?: string
    /** @default 'traveler' */
    name?: string
}

const client = new MongoClient(config?.uri ?? 'mongodb://127.0.0.1')
const db = client.db(config?.name ?? 'traveler')

export const close = () => client.close()
export const collection = (
    collection: string,
    uniqueKeys: string[] | string[][] | IndexSpecification[] = []
): [Collection, () => Promise<void>] => {
    const coll = db.collection(collection)
    const init = async () => {
        for (const unique of uniqueKeys) {
            let index: IndexSpecification = new Map()
            if (Array.isArray(unique)) {
                for (const key of unique) {
                    index.set(key as string, 1)
                }
            } else if (typeof unique === 'string') {
                index.set(unique, 1)
            } else {
                index = unique
            }
            const result = await coll
                .createIndex(index, { unique: true })
                .catch((err) => {
                    logger.debug(err)
                })
            logger.debug(
                `create ${collection} collection unique index: ${result}`
            )
        }
    }
    return [coll, init]
}
export const oid = (id: string) => new ObjectId(id)
export const isOid = (oid: string) => ObjectId.isValid(oid)

export default collection
