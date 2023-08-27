import { Database } from '@/database'
const BoundariesOptions = {
  name: 'boundaries',
  version: 2,
  stores: [
    { name: 'boundaries', keyPath: 'code', expired: 24 * 60 * 60 * 1000 },
    { name: 'geojson', keyPath: 'code' }
  ]
}

export const getBoundaries = async <T>(code: string) => {
  const db = await Database.instance(BoundariesOptions)
  return db.get<T>('boundaries', code)
}

export const setBoundaries = async (
  code: string,
  data: Parameters<typeof Database.prototype.set>[2]
) => {
  const db = await Database.instance(BoundariesOptions)
  return db.set('boundaries', code, data)
}

export const getGeojson = async <T>(code: string) => {
  const db = await Database.instance(BoundariesOptions)
  return db.get<T>('geojson', code)
}

export const setGeojson = async (
  code: string,
  data: Parameters<typeof Database.prototype.set>[2]
) => {
  const db = await Database.instance(BoundariesOptions)
  return db.set('geojson', code, data)
}
