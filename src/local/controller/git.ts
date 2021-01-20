import Base from '../../../common/base';
import shell = require('shelljs');

export default class GitDashBoard extends Base {
  constructor (ctx: object, next: any) {
    super(ctx, next, 'local', 'git')
  }

  public async index () {
    const { method }: any = this.ctx;
    if (method === 'GET') {
      this.fetch({ data: 'git dashboard', port: process.env.SOCKET_PORT });
      await this.display('index')
    } else if (method === 'POST') {
      const { request } : any = this.ctx;
      const { path, cmd }: any = request.body;
      shell.cd(path);

      (this.ctx as any).status = 200;
      try {
        (this.ctx as any).body = await shell.exec(cmd)
      } catch (e) {
        (this.ctx as any).status = 500;
      }
    }
  }
}
