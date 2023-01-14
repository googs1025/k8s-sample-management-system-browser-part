import request from '@/utils/request'

// getList 拿到namespace下的deployments
export function getList(namespace) {
  return request({
    url: '/deployments?namespace=' + namespace,
    method: 'get'
  })
}

export function loadDeploy(ns,name) {
  return request({
    url: '/deployments/' + ns + "/" + name,
    method: 'get',
  })
}

export function rmDeploy(ns,name) {
  return request({
    url: '/deployments/'+ns+'/'+name,
    method: 'delete',
  })
}
export function createDeploy(data) {
  return request({
    url: '/deployments',
    data,
    method: 'post',
  })
}
