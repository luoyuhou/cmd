import Koa from 'koa'
import '../common/config'
import router from '../common/router'
import logger from '../common/logger'
import bodyParser = require('koa-bodyparser');
import path = require('path');
import staticFiles = require('koa-static');

const app = new Koa();
app.use(staticFiles(path.join(path.dirname(__dirname), 'static')));
app.use(bodyParser());

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  logger.info(`${ctx.method} ${ctx.url} - ${rt}`)
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`)
});

app.use(router.routes());

const { SERVER_PORT: port } = process.env;
app.listen(port, logger.info(`running: http://localhost:${port}`));
