import request from '@/utils/request'

//获取所有 node列表
export function getList() {
  return request({
    url: '/nodes',
    method: 'get',
  })
}

//获取node详细
export function getDetail(nodeName) {
  return request({
    url: '/nodes/'+ nodeName,
    method: 'get',
  })
}

// 保存 一下
export function saveNode(data) {
  return request({
    url: '/nodes',
    data,
    method: 'post',
  })
}
