import request from '@/utils/request'

//获取所有 secrets列表
export function getConfigmapList(ns) {
  return request({
    url: '/configmaps?namespace=' + ns ,
    method: 'get',
  })
}

export function rmConfigmap(ns,name) {
  return request({
    url: '/configmaps?namespace='+ns +'&name='+name,
    method: 'delete',

  })
}

export function postConfigMap(data) {
  return request({
    url: '/configmaps',
    method: 'post',
    data
  })
}
// 获取详细
export function getConfigMap(ns,name) {
  return request({
    url: '/configmaps/' +ns +'/'+name,
    method: 'get',
  })
}
