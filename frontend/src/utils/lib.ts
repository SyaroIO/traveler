import { defineAsyncComponent } from 'vue'
import type { Component } from 'vue'

const BMAP = '/proxy/bmap/getscript?type=webgl&services=&t=20230614151358'
const tasks = new Map<string, { done: boolean; waitList: ((value?: unknown) => void)[] }>()
const scriptIt = async (src: string) => {
  const task = tasks.get(src)
  if (task) {
    const { done, waitList } = task
    if (done) return
    return new Promise((resolve) => {
      waitList.push(resolve)
    })
  }

  return new Promise((resolve) => {
    tasks.set(src, { done: false, waitList: [resolve] })
    const scriptElement = document.createElement('script')
    scriptElement.type = 'text/javascript'
    scriptElement.src = src
    document.head.appendChild(scriptElement)
    scriptElement.onload = () => {
      console.log('script', src, 'loaded')
      const task = tasks.get(src)
      if (!task) return
      task.done = true
      task.waitList.forEach((resolve) => resolve())
      task.waitList = []
    }
  })
}

export const loadBMap = () => scriptIt(BMAP)
export const defineAsyncBMapComponent = <T extends Component>(l: () => Promise<T>) =>
  defineAsyncComponent<T>(() => scriptIt(BMAP).then(l))
