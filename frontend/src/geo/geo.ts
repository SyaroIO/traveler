import { ExtendedFeatureCollection } from 'd3-geo'

import _100000 from './100000'
import _110000 from './110000'
import _120000 from './120000'
import _130000 from './130000'
import _140000 from './140000'
import _150000 from './150000'
import _210000 from './210000'
import _220000 from './220000'
import _230000 from './230000'
import _310000 from './310000'
import _320000 from './320000'
import _330000 from './330000'
import _340000 from './340000'
import _350000 from './350000'
import _360000 from './360000'
import _370000 from './370000'
import _410000 from './410000'
import _420000 from './420000'
import _430000 from './430000'
import _440000 from './440000'
import _450000 from './450000'
import _460000 from './460000'
import _500000 from './500000'
import _510000 from './510000'
import _520000 from './520000'
import _530000 from './530000'
import _540000 from './540000'
import _610000 from './610000'
import _620000 from './620000'
import _630000 from './630000'
import _640000 from './640000'
import _650000 from './650000'
import _710000 from './710000_clear'
import _810000 from './810000'
import _820000 from './820000'

export const geo: Map<number | string, ExtendedFeatureCollection> = new Map()
geo.set(100000, _100000)
geo.set(110000, _110000)
geo.set(120000, _120000)
geo.set(130000, _130000)
geo.set(140000, _140000)
geo.set(150000, _150000)
geo.set(210000, _210000)
geo.set(220000, _220000)
geo.set(230000, _230000)
geo.set(310000, _310000)
geo.set(320000, _320000)
geo.set(330000, _330000)
geo.set(340000, _340000)
geo.set(350000, _350000)
geo.set(360000, _360000)
geo.set(370000, _370000)
geo.set(410000, _410000)
geo.set(420000, _420000)
geo.set(430000, _430000)
geo.set(440000, _440000)
geo.set(450000, _450000)
geo.set(460000, _460000)
geo.set(500000, _500000)
geo.set(510000, _510000)
geo.set(520000, _520000)
geo.set(530000, _530000)
geo.set(540000, _540000)
geo.set(610000, _610000)
geo.set(620000, _620000)
geo.set(630000, _630000)
geo.set(640000, _640000)
geo.set(650000, _650000)
geo.set(710000, _710000)
geo.set(810000, _810000)
geo.set(820000, _820000)
export const main = _100000 as ExtendedFeatureCollection
export const codes = main.features.map((f) => f.properties?.code).filter((v) => v)
export default geo
