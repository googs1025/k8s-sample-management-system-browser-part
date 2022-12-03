import request from '@/utils/request'

//获取所有 ingress列表
export function getList(ns) {
  return request({
    url: '/ingress?ns=' + ns ,
    method: 'get',
  })
}

// 新增ingress
export function postIngress(data) {
  return request({
    url: '/ingress',
    method: 'post',
    data
  })
}

