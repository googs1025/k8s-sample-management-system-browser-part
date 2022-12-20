import request from '@/utils/request'

//获取所有 ns列表
export function getList() {
  return request({
    url: '/nodes',
    method: 'get',
  })
}
