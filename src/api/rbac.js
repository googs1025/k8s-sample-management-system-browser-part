import request from '@/utils/request'
export function getRoleList(ns) {
  return request({
    url: '/roles?ns=' + ns,
    method: 'get',
  })
}
export function getRoleBindingList(ns) {
  return request({
    url: '/rolebindings?ns=' + ns,
    method: 'get',
  })
}
export function createRole(data) {
  return request({
    url: '/roles',
    data,
    method: 'post',
  })
}
export function deleteRole(ns,name) {
  return request({
    url: '/roles?ns='+ns+"&name="+name,
    method: 'delete',
  })
}
