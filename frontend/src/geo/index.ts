import { geo as data, main } from './geo'
import { geoMercator, geoPath, GeoPermissibleObjects } from 'd3-geo'

export { main, codes } from './geo'
export default class Geo {
    constructor(width = 1000, height = 1000, scale = 1) {
        this.#w = width
        this.#h = height
        this.#s = scale
        this.#r()
        main.features.forEach((f) => {
            this.#z1.set(f.properties?.code, f)
        })
    }

    #w = 1000
    #h = 1000
    #s = 1
    #projection = geoMercator()
    #path = geoPath()
    #z1 = new Map()

    resize(width: number, height: number) {
        this.#w = width
        this.#h = height
        this.#r()
    }

    scale(scale: number) {
        this.#s = scale
        this.#r()
    }

    #r() {
        this.#projection.fitSize([this.#w * this.#s, this.#h * this.#s], main)
        this.#path.projection(this.#projection)
    }

    z1(code: number) {
        return this.#z1.get(code)
    }

    get(code: number) {
        return data.get(code)
    }

    path(data: GeoPermissibleObjects) {
        return this.#path(data) ?? ''
    }

    projection(data: [number, number]) {
        return this.#projection(data) ?? [0, 0]
    }
}
export const geo = new Geo()
