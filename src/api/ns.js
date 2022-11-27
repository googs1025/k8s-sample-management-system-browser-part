import request from '@/utils/request'

export function getList() {
  return request({
    url: '/nslist',
    method: 'get'
  })
}
