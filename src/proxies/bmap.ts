import Router from '@koa/router'
import { bmap as config } from '.'
import axios from 'axios'

export interface BMapProxyConfig {
    ak: string
    /** @default '3.0' */
    version?: string
}

const ak = config.ak
const v = config.version ?? '3.0'

export const router = new Router()

router.get('/:api?', async (ctx) => {
    const api = ctx.params.api ?? ''
    const params = Object.assign({ v, ak }, ctx.request.query)
    const res = await axios.get(`https://api.map.baidu.com/${api}`, { params })
    ctx.body = res.data
})

export default router.routes()
