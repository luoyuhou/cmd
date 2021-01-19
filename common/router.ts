const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const router = new Router();

let files = fs.readdirSync('./src').map((value) => { return `./src/${value}`});

while (files.length) {
    const dirs = [];
    files.map((value) => {
        if ((value.includes('router.ts') || value.includes('router.js')) && fs.statSync(value).isFile()) {
            import(path.join('../', value)).then(({ Routes }) => {
                Routes.forEach(route => {
                    router[route.method](route.route, async (ctx, next) => await new route.controller(ctx, next)[route.action]())
                })
            });
        } else if (fs.statSync(value).isDirectory()) {
            const temp = fs.readdirSync(value).map((val) => { return `${value}/${val}`;});
            dirs.push(...temp);
        }
    });
    files = dirs;
}

export default router;

