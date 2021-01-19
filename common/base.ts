import fs = require('fs');
import path = require('path');

export default class Base {
    private module: string;
    private controller: string;
    protected ctx: object;
    private readonly next: any;
    private fetchData: object;

    constructor(ctx: object, next: any, module: string, controller: string) {
        this.module = module;
        this.controller = controller;
        this.ctx = ctx;
        this.next = next;
    }

    public async display(view: string = this.controller, suffix: string = process.env.OUTPUT_SUFFIX || 'html') {
        try {
            const self = this;
            (this.ctx as any).body = (fs.readFileSync(path.join(path.join(path.join(path.join('./src/' + this.module), 'views'), this.controller), `${view}.${suffix}`)))
                .toString().replace(/{{\s*(.*?)\s*}}/g, function (context: string, objKey: string) {
                    return self.fetchData[objKey] || '';
                });
            (this.ctx as any).status = 200;
        } catch (e) {
            (this.ctx as any).body = 'Not Found.';
            (this.ctx as any).status = 404;
        }
        if (typeof this.next === 'function') {
            await this.next();
        }
    }

    public fetch(dataObj: object) {
        this.fetchData = dataObj;
    }
}