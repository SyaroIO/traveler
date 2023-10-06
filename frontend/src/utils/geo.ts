import geojson from '@/assets/geo.json'
import type { Geometry, FeatureCollection } from 'geojson'
import { registerMap } from 'echarts'

interface Province {
  name: string
  fullname: string
  adcode: number
  score: number
  center: [number, number]
  province: undefined
  districts: number[]
}
interface District {
  name: string
  fullname: string
  province: string
  adcode: number
  score: number
  center: [number, number]
  geometry: Geometry
}

export interface GeoData {
  provinces: Province[]
  districts: District[]
}
export const { provinces, districts } = geojson as GeoData
export const size = districts.length
const collection = {
  type: 'FeatureCollection',
  features: districts.map(({ geometry }, index) => ({
    type: 'Feature',
    id: index,
    properties: { name: index },
    geometry
  }))
} as FeatureCollection
registerMap('map', collection as Parameters<typeof registerMap>[1])
export const info = (index: number) => districts.at(index)
export const centers = (scale: number) => {
  const list = [
    provinces.map(({ ...province }, index) => ({
      ...province,
      index,
      p: true
    })),
    districts.map(({ ...district }, index) => ({
      ...district,
      index,
      p: false
    }))
  ]
    .flat()
    .sort(({ score: a }, { score: b }) => b - a)
    .map(({ name, center: value, p }) => ({ name, value, p }))

  const final = []
  const distance = 1.5 / scale
  for (const v of list) {
    const [x, y] = v.value
    let push = true
    for (const f of final) {
      const [fx, fy] = f.value
      const d = Math.sqrt((x - fx) ** 2 + (y - fy) ** 2)
      if (d < distance) {
        push = false
        break
      }
    }
    if (push) {
      final.push(v)
    }
  }
  return final
}
