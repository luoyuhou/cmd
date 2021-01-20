import GitDashBoard from './controller/git'

export const Routes: any = [
  {
    method: 'get',
    route: '/local/git/index',
    controller: GitDashBoard,
    action: 'index'
  },
  {
    method: 'post',
    route: '/local/git/index',
    controller: GitDashBoard,
    action: 'index'
  }
];
