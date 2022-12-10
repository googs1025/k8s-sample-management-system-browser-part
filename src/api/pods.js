import request from '@/utils/request'

// 获取所有 pods列表 by namespace
export function getPodsByNs(ns) {
  return request({
    url: '/pods?namespace=' + ns,
    method: 'get'
  })
}

//获取pod的容器列表 （只返回名称)
export function getPodContainers(ns,podname) {
  return request({
    url: '/pods/containers?namespace=' + ns + '&name=' +podname,
    method: 'get',
  })
}

//获取pod的日志
export function getPodsLogs(ns,podname,cname) {
  return request({
    url: '/pods/logs?namespace=' + ns + '&podname=' +podname + '&cname=' +cname,
    method: 'get',
  })
}


