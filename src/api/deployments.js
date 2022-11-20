import request from '@/utils/request'

// getList 拿到namespace下的deployments
export function getList(namespace) {
  return request({
    url: '/deployments?namespace=' + namespace,
    method: 'get'
  })
}
