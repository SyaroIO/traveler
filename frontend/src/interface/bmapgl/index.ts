import geojson from '@/assets/geojson/china.json'

console.debug('geojson', geojson)
interface PolygonGeometry {
  type: 'Polygon'
  coordinates: [number, number][][]
}

interface MultiPolygonGeometry {
  type: 'MultiPolygon'
  coordinates: [number, number][][][]
}

type Geometry = PolygonGeometry | MultiPolygonGeometry
interface GeoJSON {
  type: 'Feature'
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  properties: { [key: string]: any }
  geometry: Geometry
}

interface RawData {
  province: string
  district: string
  centroid: [number, number]
  geometry: Geometry
}
export class BMapWarp {
  private map: BMapGL.Map
  private geojson = null as Map<number, GeoJSON> | null
  constructor(container: ConstructorParameters<typeof BMapGL.Map>[0]) {
    const map = new BMapGL.Map(container, {
      enableAutoResize: true
    })
    this.map = map
    map.centerAndZoom(new BMapGL.Point(104.114129, 37.550339), 6)
    map.enableScrollWheelZoom()
  }

  private loadGeojson() {
    if (this.geojson) return this.geojson
    const geojsonMap = new Map<number, GeoJSON>()
    this.geojson = geojsonMap
    ;(geojson as RawData[]).forEach(
      ({ province, district, centroid, geometry }, code) => {
        geojsonMap.set(code, {
          type: 'Feature',
          properties: {
            code,
            province,
            district,
            centroid,
            name: `${province}${district}`
          },
          geometry
        })
      }
    )
    return geojsonMap
  }

  private getGeojson(code: number) {
    return this.loadGeojson().get(code)
  }

  public getAllDistricts() {
    return this.loadGeojson().entries()
  }

  public getDistrictSize() {
    return this.loadGeojson().size
  }

  public overlayDistrict(code: number) {
    const convert = (coordinates: [number, number][][]) =>
      coordinates.map((polygon) =>
        polygon.map(([lng, lat]) => new BMapGL.Point(lng, lat))
      )
    const geojson = this.getGeojson(code)
    if (!geojson) return
    const { type, coordinates } = geojson.geometry
    switch (type) {
      case 'Polygon':
        this.overlayPolygon(convert(coordinates) as any)
        break
      case 'MultiPolygon':
        coordinates.forEach((polygon) => {
          this.overlayPolygon(convert(polygon) as any)
        })
    }
  }

  public overlayPolygon(data: ConstructorParameters<typeof BMapGL.Polygon>[0]) {
    const fillOpacity = [0, 0.1, 0.2, 0.3, 0.4, 0.5][
      Math.floor(Math.random() * 6)
    ]
    if (!fillOpacity) return
    const overlay = new BMapGL.Polygon(data, {
      fillColor: '#1b6cff',
      fillOpacity,
      strokeWeight: 0
    })
    this.overlay(overlay)
  }

  public overlay(...args: Parameters<typeof this.map.addOverlay>) {
    this.map.addOverlay(...args)
  }
}

export const bindMap = (...args: ConstructorParameters<typeof BMapWarp>) =>
  new BMapWarp(...args)
