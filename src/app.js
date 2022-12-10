import * as geo from './geo/index.js';

export default class App {
    constructor() {
        //
    }

    #ws;

    async init() {
        // this.#ws = await new Promise((resolve) => new WebSocket(`ws://${window.location.hostname}:8080`).onopen = e => resolve(e.target));
        window.onerror = (message, source, lineno, colno, error) => this.error(message, source, lineno, colno, error);
    }

    get(code) {
        return geo[`c${code}`];
    }

    debug(...data) {this.#logger('debug', data);}
    info(...data) {this.#logger('info', data);}
    warn(...data) {this.#logger('warn', data);}
    error(...data) {this.#logger('error', data);}
    #logger(level, args) {
        console[level](...args);
        // this.#ws.send(JSON.stringify({level, args}));
    }
}