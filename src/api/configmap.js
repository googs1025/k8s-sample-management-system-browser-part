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
    url: '/configmaps?namespace'+ns +'&name='+name,
    method: 'delete',

  })
}
