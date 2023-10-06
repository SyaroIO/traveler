import { readFile, writeFile } from 'fs/promises'
import scores from './scores'
import type { Geometry } from 'geojson'

const adcodes = [
    110000, 120000, 130000, 140000, 150000, 210000, 220000, 230000, 310000,
    320000, 330000, 340000, 350000, 360000, 370000, 410000, 420000, 430000,
    440000, 450000, 460000, 500000, 510000, 520000, 530000, 540000, 610000,
    620000, 630000, 640000, 650000, 710000, 810000, 820000
]

const provinces = new Array<{
    name: string
    fullname: string
    center: [number, number]
    adcode: number
    score: number
    districts: number[]
}>()
const districts = new Array<{
    province: string
    name: string
    fullname: string
    center: [number, number]
    adcode: number
    score: number
    geometry: Geometry
}>()

;(async () => {
    let index = 0
    for (const adcode of adcodes) {
        const {
            features,
            propertity: {
                name: province,
                center: pCenter,
                centroid,
                fullname: pF
            }
        } = await readFile(`tools/geojson/data/${adcode}.json`, 'utf8').then(
            JSON.parse
        )
        const pDistricts = new Array<number>()
        for (const {
            properties: { name, center, code, fullname },
            geometry
        } of features) {
            districts.push({
                province,
                name,
                fullname: `${pF ?? province}${fullname ?? name}`,
                center,
                adcode: code,
                score: scores.get(code) ?? 0,
                geometry
            })
            pDistricts.push(index)
            index++
        }
        provinces.push({
            name: province,
            fullname: pF ?? province,
            center: centroid ?? pCenter,
            adcode,
            score: scores.get(adcode) ?? 0,
            districts: pDistricts
        })
    }
    writeFile(
        'frontend/src/assets/geo.json',
        JSON.stringify({
            provinces,
            districts
        })
    )
})()
