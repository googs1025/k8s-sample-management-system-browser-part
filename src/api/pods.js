import request from '@/utils/request'

// 获取所有 pods列表 by namespace
export function getPodsByNs(ns) {
  return request({
    url: '/pods?namespace=' + ns,
    method: 'get'
  })
}
