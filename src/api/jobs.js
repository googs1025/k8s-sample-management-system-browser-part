import request from '@/utils/request'

// getList 拿到namespace下的jobs
export function getJobList(namespace) {
  return request({
    url: '/jobs?namespace=' + namespace,
    method: 'get'
  })
}
