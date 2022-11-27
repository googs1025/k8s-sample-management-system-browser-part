import request from '@/utils/request'

export function getList() {
  return request({
    url: '/namespaces',
    method: 'get'
  })
}
