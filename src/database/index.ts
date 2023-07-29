import { MongoClient } from 'mongodb'
import config from '@/config'

interface DatabaseConfig {
    uri?: string
    name?: string
}

const dbConfig = (config.database as DatabaseConfig) ?? {}
const uri = dbConfig.uri ?? 'mongodb://127.0.0.1'
const dbName = dbConfig.name ?? 'traveler'
const client = new MongoClient(uri)
const db = client.db(dbName)

export const close = () => client.close()
export const collection = (collection: string) => db.collection(collection)

export default collection
