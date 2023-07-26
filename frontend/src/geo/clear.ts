import d from './710000'

const features = []

const f = (n) => Number(Number(n).toFixed(6))
const clear = (coordinates) =>
    coordinates.map((coordinate) => {
        const s = coordinate.pop()
        coordinate.shift()
        if (coordinate.length > 1000) {
            coordinate = coordinate
                .filter((_, i) => i % 2 === 0)
                .filter((_, i) => i % 2 === 0)
                .filter((_, i) => i % 2 === 0)
        } else if (coordinate.length > 400) {
            coordinate = coordinate.filter((_, i) => i % 2 === 0).filter((_, i) => i % 2 === 0)
        } else if (coordinate.length > 150) {
            coordinate = coordinate.filter((_, i) => i % 2 === 0)
        } else if (coordinate.length > 80) {
            coordinate = coordinate.filter((_, i) => i % 3 === 0)
        } else if (coordinate.length > 40) {
            coordinate = coordinate.filter((_, i) => i % 4 === 0)
        } else if (coordinate.length > 10) {
            coordinate = coordinate.filter((_, i) => i % 5 === 0)
        }
        coordinate.unshift(s)
        coordinate.push(s)

        return coordinate.map(([e, n]) => [f(e), f(n)])
    })
for (const {
    geometry: { coordinates, type },
    ...feature
} of d.features) {
    feature.geometry = { type }
    switch (type) {
        case 'Polygon':
            feature.geometry.coordinates = clear(coordinates)
            break
        case 'MultiPolygon':
            feature.geometry.coordinates = coordinates.map(clear)
            break
        default:
            break
    }
    features.push(feature)
}

export default { features, type: 'FeatureCollection' }
