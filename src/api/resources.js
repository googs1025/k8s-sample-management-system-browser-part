import request from '@/utils/request'
export function getResources() {
  return request({
    url: '/resources',
    method: 'get',
  })
}
