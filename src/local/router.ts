import Git from './controller/git';

export const Routes: any = [
    {
        method: 'get',
        route: '/local/git/index',
        controller: Git,
        action: 'index'
    },
    {
        method: 'post',
        route: '/local/git/index',
        controller: Git,
        action: 'index'
    }
];