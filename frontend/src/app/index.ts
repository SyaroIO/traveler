export default class App {
  #level = new Map()
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
