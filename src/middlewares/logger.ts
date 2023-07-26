import { getLogger } from '../logger/index.js'

const logger = getLogger('request');
export default () => async (ctx, next) => {
    const start = Date.now();
    const { method, url, res } = ctx;
    try {
        await next();
    } catch (err) {
        logger.error(method, url, err);
        throw err;
    }

    const done = _ => {
        res.removeListener('finish', done);
        res.removeListener('close', done);
        logger.info(method, url, ctx.status || 404, Date.now() - start, ctx.response.length);
    }

    res.once('finish', done);
    res.once('close', done);
};


