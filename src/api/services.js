import request from '@/utils/request'

// getServiceList 拿到namespace下的services
export function getServiceList(namespace) {
  return request({
    url: '/services?namespace=' + namespace,
    method: 'get'
  })
}
