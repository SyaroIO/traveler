export default class App {
    #level = new Map()

    debug(...data: any[]) {
        this.#logger('debug', data)
    }
    info(...data: any[]) {
        this.#logger('info', data)
    }
    warn(...data: any[]) {
        this.#logger('warn', data)
    }
    error(...data: any[]) {
        this.#logger('error', data)
    }
    #logger(level: string, args: any[]) {
        switch (level) {
            case 'debug':
                console.debug(...args)
                break
            case 'info':
                console.info(...args)
                break
            case 'warn':
                console.warn(...args)
                break
            case 'error':
                console.error(...args)
                break
            default:
                return
        }
    }

    getLevel(code: string | number) {
        return this.#level.get(code) ?? 0
    }

    setLevel(code: string | number, level: number) {
        this.#level.set(code, level)
    }

    #hsl = [225, 50, 25]
    hsl() {
        return this.#hsl
    }
    setColor(h: number, s: number, l: number) {
        this.#hsl = [h, s, l]
    }
    getColor(level: number) {
        const [h, s, l] = this.#hsl
        let a = 0
        switch (level) {
            case 1:
                a = 0.2
                break
            case 2:
                a = 0.4
                break
            case 3:
                a = 0.6
                break
            case 4:
                a = 0.8
                break
            case 5:
                a = 1
                break
        }
        return `hsla(${h},${s}%,${l}%,${a})`
    }
}

export const app = new App()
