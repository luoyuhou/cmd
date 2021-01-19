import Base from "../../../common/base";

export default class Index extends Base{
    constructor(ctx: object, next: any) {
        super(ctx, next, 'index', 'index');
    }

    public async index() {
        this.fetch({ data: 'test', description: 'www.baidu.com' });
        await this.display();
    }
}