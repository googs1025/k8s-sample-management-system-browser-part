import request from '@/utils/request'

//获取所有 ingress列表
export function getList(ns) {
  return request({
    url: '/ingress?ns=' + ns ,
    method: 'get',
  })
}
