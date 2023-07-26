import serve from 'koa-static';

export default () => serve('frontend/dist', { maxage: 1000 * 60 * 60 * 24 * 7 });