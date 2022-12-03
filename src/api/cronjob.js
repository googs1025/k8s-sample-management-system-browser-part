import request from '@/utils/request'

// getList 拿到namespace下的jobs
export function getCronJobList(namespace) {
  return request({
    url: '/cronjobs?namespace=' + namespace,
    method: 'get'
  })
}
