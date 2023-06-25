import * as geo from './index.geo.js';
import { geoMercator, geoPath } from 'd3-geo';

export default class GeoMap {
    constructor(width=1000, height=1000, scale=1) {
        this.#w = width;
        this.#h = height;
        this.#s = scale;
        this.#r();
        geo._.features.forEach(f => {
            this.#z1[f.properties.code] = f;
        });
    }

    #w = 1000;
    #h = 1000;
    #s = 1;
    #projection = geoMercator();
    #path = geoPath();
    #z1 = {};

    resize(width, height) {
        this.#w = width;
        this.#h = height;
        this.#r();
    }

    scale(scale) {
        this.#s = scale;
        this.#r();
    }

    #r() {
        this.#projection.fitSize([this.#w*this.#s, this.#h*this.#s], geo._);
        this.#path.projection(this.#projection);
    }

    get main() {
        return geo._;
    }

    z1(code) {
        return this.#z1[code];
    }

    get(code='') {
        return geo[`_${code}`];
    }

    path(data) {
        return this.#path(data);
    }

    projection(data) {
        return this.#projection(data);
    }
}