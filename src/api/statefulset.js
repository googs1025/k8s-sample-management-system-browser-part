import request from '@/utils/request'

// getList 拿到namespace下的jobs
export function getStatefulSetList(namespace) {
  return request({
    url: '/statefulsets?namespace=' + namespace,
    method: 'get'
  })
}
