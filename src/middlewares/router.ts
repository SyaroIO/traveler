import Router from 'koa-router';

export const router = new Router()
    .get('/api', async (ctx) => {
        ctx.body = { message: 'Hello World!' };
    })
    .get('/timeout/:time', async (ctx) => {
        const time = parseInt(ctx.params.time);
        if (isNaN(time) || time < 0 || time > 10000) {
            ctx.status = 400;
            ctx.body = { message: 'Invalid time!' };
            return;
        }
        ctx.body = await new Promise(r => setTimeout(() => r({ message: `timeout ${time}` }), time));
    })
    .get('/airplane', async (ctx) => {
        ctx.body = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <link rel="icon" type="image/svg+xml" href="/airplane.svg" />
            <meta charset="UTF-8" />
            <title>AirPlane</title>
          </head>
          <body>
            <object data="/airplane.svg" type="image/svg+xml">
              <img src="/airplane.svg" alt="airplane" />
            </object>
          </body>
        </html>
        `;
    });

export default () => router.routes();