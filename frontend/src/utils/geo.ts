import geojson from '@/assets/geojson/china.json'
import { geoMercator, geoPath } from 'd3-geo'
import type { GeoGeometryObjects } from 'd3-geo'

interface Province {
  name: string
  adcode: number
  score: number
  center: [number, number]
  districts: number[]
}
interface District {
  name: string
  province: string
  adcode: number
  score: number
  center: [number, number]
  geometry: GeoGeometryObjects
}

export interface GeoData {
  provinces: Province[]
  districts: District[]
}
export const { provinces, districts } = geojson as GeoData
export const size = districts.length

const gc = {
  type: 'GeometryCollection',
  geometries: districts.map(({ geometry }) => geometry)
}

let w = 1000
let h = 1000
let s = 1
const p = geoPath()
export const projection = geoMercator()
const fit = () => projection.fitSize([w * s, h * s], gc)

export const info = (index: number) => districts.at(index)
export const resize = (width: number, height: number) => {
  w = width
  h = height
  fit()
}
export const scale = (scale: number) => {
  s = scale
  fit()
}
export const path = (index: number) => {
  const d = districts.at(index)
  if (!d) return ''
  return p(d.geometry) ?? ''
}
export const center = (index: number) => {
  const d = districts.at(index)
  if (!d) return null
  const center = projection(d.center)
  if (!center) return null
  const [x, y] = center
  return {
    index,
    name: d.name,
    x,
    y
  }
}

export const paths = () => districts.map(({ geometry }) => p(geometry) ?? '')
export const centers = () => {
  const list = [provinces, districts]
    .flat()
    .sort(({ score: a }, { score: b }) => b - a)
    .map(({ center, name, province }) => ({
      text: name,
      province: !province,
      position: projection(center) ?? [0, 0]
    }))

  const final = []
  for (const v of list) {
    const [x, y] = v.position
    let push = true
    for (const f of final) {
      const [fx, fy] = f.position
      const d = Math.sqrt((x - fx) ** 2 + (y - fy) ** 2)
      if (d < 20) {
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

p.projection(projection)
fit()
