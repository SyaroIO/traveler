import { fingerprint } from '@/cookies'
const level = new Map<number, number>()

export const getLevel = (code: number) => level.get(code) ?? 0
export const setLevel = (code: number, value: number) => level.set(code, value)

export const hsl = [225, 50, 25]
export const getHsl = () => [...hsl]
export const setColor = (h: number, s: number, l: number) => {
  hsl[0] = h
  hsl[1] = s
  hsl[2] = l
}
export const getColor = (level: number) => {
  const [h, s, l] = hsl
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

export const init = async () => fingerprint()
