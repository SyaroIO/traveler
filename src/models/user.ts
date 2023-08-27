import type { Filter, Document } from 'mongodb'
import { collection } from '@/database'

const [users, init] = collection('users', ['id', 'email'])
export default init

export interface User {
    id: string
    name: string
    email: string
    verification?: string
}

export const register = async (doc: {
    id: string
    name: string
    password: string
    email: string
    verification: string
}) =>
    users
        .insertOne(doc)
        .then(() => true)
        .catch(() => false)

const verificationByDoc = async (filter: Filter<Document>) =>
    users.findOneAndUpdate(
        filter,
        { $unset: { verification: 1 } },
        { projection: { _id: 0, password: 0 }, returnDocument: 'after' }
    )
const authenticateByDoc = async (filter: Filter<Document>) =>
    users.findOne<User>(filter, { projection: { _id: 0, password: 0 } })

export const verificationById = async (id: string, verification: string) =>
    verificationByDoc({ id, verification })
export const verificationByEmail = async (
    email: string,
    verification: string
) => verificationByDoc({ email, verification })
export const authenticateById = async (id: string, password: string) =>
    authenticateByDoc({ id, password })
export const authenticateByEmail = async (email: string, password: string) =>
    authenticateByDoc({ email, password })
export const verification = verificationByEmail
export const authenticate = authenticateByEmail

export const findById = async (id: string) => users.findOne({ id })
export const findMany = async (ids: string[]) =>
    users.find({ id: { $include: ids } }).toArray()
export const findByEmail = async (email: string) => users.findOne({ email })
export const findAll = async () => users.find().toArray()
export const find = findByEmail

export const checkId = async (id: string) =>
    (await users.countDocuments({ id })) === 0
export const checkEmail = async (email: string) =>
    (await users.countDocuments({ email })) === 0
