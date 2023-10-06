interface Obj {
  [key: string | number]: any
}
export const merge = (src: Obj, ...args: Obj[]): Obj => {
  if (args.length === 0) return src
  const [update, ...left] = args
  for (const key in update) {
    if (typeof update[key] === 'object' && typeof src[key] === 'object') {
      merge(src[key], update[key])
    } else {
      src[key] = update[key]
    }
  }
  return merge(src, ...left)
}

export const rgb = (hex: string) => {
  let l = ['0', '0', '0']
  if (hex.length == 4) {
    const m = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(hex)
    if (m) l = [m[1] + m[1], m[2] + m[2], m[3] + m[3]]
  } else {
    const m = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(hex)
    if (m) l = [m[1], m[2], m[3]]
  }
  return l.map((v) => parseInt(v, 16)) as [number, number, number]
}

const h = (n: number) => n.toString(16).padStart(2, '0')
export const hex = ([r, g, b]: [number, number, number], p: number) =>
  `#${h(p * r)}${h(p * g)}${h(p * b)}`
