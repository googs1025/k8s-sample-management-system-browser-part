import request from '@/utils/request'

//获取所有 secrets列表
export function getSecretList(ns) {
  return request({
    url: '/secrets?namespace=' + ns ,
    method: 'get',
  })
}

export function rmSecret(ns,name) {
  return request({
    url: '/secrets?namespace='+ns +'&name='+name,
    method: 'delete',

  })
}

export function postSecret(data) {
  return request({
    url: '/secrets',
    method: 'post',
    data
  })
}

export function getSecret(ns, name) {
  return request({
    url: '/secrets/' + ns + '/' + name,
    method: 'get',
  })
}

