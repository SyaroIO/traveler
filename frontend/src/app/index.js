import GeoMap from './geo/index.js';
export default class App {

    #ws;
    #geomap;
    #level = {};
    get geomap() { return this.#geomap; }

    async init() {
        this.#geomap = new GeoMap();
        // this.#ws = await new Promise((resolve) => new WebSocket(`ws://${window.location.hostname}:8080`).onopen = e => resolve(e.target));
        window.onerror = (message, source, lineno, colno, error) => this.error(message, source, lineno, colno, error);
    }

    debug(...data) {this.#logger('debug', data);}
    info(...data) {this.#logger('info', data);}
    warn(...data) {this.#logger('warn', data);}
    error(...data) {this.#logger('error', data);}
    #logger(level, args) {
        console[level](...args);
        // this.#ws.send(JSON.stringify({level, args}));
    }

    getLevel(code) {
        return this.#level[code] ?? 0;
    }

    setLevel(code, level) {
        this.#level[code] = level;
    }

    #hsl = [225, 50, 25];
    hsl() { return this.#hsl; }
    setColor(h,s,l) {
        this.#hsl = [h,s,l];
    }
    getColor(level) {
        const [h,s,l] = this.#hsl;
        let a = 0;
        switch (level) {
            case 1: a = 0.2; break;
            case 2: a = 0.4; break;
            case 3: a = 0.6; break;
            case 4: a = 0.8; break;
            case 5: a = 1; break;
        }
        return `hsla(${h},${s}%,${l}%,${a})`;
    }
}
