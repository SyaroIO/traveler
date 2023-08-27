import Router from '@koa/router'
import bmap from '@/proxies/bmap'

const proxies = new Router().use('/bmap', bmap)

export const router = new Router().use('/proxy', proxies.routes(), proxies.allowedMethods())

export default () => router.routes()
