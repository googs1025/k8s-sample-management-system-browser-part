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

export function createDeploy(data,fast) {
  let url='/deployments'
  if(fast){
    url+="?fast=1"
  }
  return request({
    url,
    data,
    method: 'post',
  })
}

// 修改模式与创建相同，只是增加一个update=1的query参数过去
export function updateDeploy(data,fast) {
  let url='/deployments'
  if(fast){
    url+="?fast=1&update=1"
  }else{
    url+="?update=1"
  }
  return request({
    url,
    data,
    method: 'post',
  })
}
