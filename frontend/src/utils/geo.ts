import geojson from '@/assets/geojson/china.json'
import { geoMercator, geoPath } from 'd3-geo'
import type { GeoGeometryObjects } from 'd3-geo'
export interface GeoData {
  province: string
  district: string
  centroid: [number, number]
  geometry: GeoGeometryObjects
}

const data = new Map<number, GeoData>((geojson as GeoData[]).entries())
export const indexs = Array.from(data.keys())

const gc = {
  type: 'GeometryCollection',
  geometries: Array.from(data.values()).map(({ geometry }) => geometry)
}

let w = 1000
let h = 1000
let s = 1
const p = geoPath()

export const path = (index: number) => {
  const d = data.get(index)
  if (!d) return ''
  return p(d.geometry) ?? ''
}
export const projection = geoMercator()
p.projection(projection)
const fit = () => projection.fitSize([w * s, h * s], gc)
fit()

export const info = (index: number) => data.get(index)
export const resize = (width: number, height: number) => {
  w = width
  h = height
  fit()
}
export const scale = (scale: number) => {
  s = scale
  fit()
}
export const provinces = new Map<
  string,
  {
    province: string
    districts: {
      index: number
      district: string
      centroid: [number, number]
    }[]
  }
>()
data.forEach(({ province, district, centroid }, index) => {
  const data = { district, centroid, index }
  const list = provinces.get(province)
  if (list) list.districts.push(data)
  else provinces.set(province, { province, districts: [data] })
})
