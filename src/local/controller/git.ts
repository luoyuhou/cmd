import Base from "../../../common/base";
import shell = require('shelljs');

export default class Git extends Base{
    constructor(ctx: object, next: any) {
        super(ctx, next, 'local', 'git');
    }

    public async index() {
        // @ts-ignore
        const method = this.ctx.method;
        if (method === 'GET') {
            this.fetch({ data: 'git dashboard', port: process.env.SOCKET_PORT });
            await this.display('index');
        } else if(method === 'POST') {
            // @ts-ignore
            const { path, cmd } = this.ctx.request.body;
            shell.cd(path);

            // @ts-ignore
            this.ctx.status = 200;
            try {
                // @ts-ignore
                this.ctx.body = await shell.exec(cmd)
            } catch (e) {
                // @ts-ignore
                this.ctx.status = 500;
            }
        }
    }
}