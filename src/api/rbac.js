import request from '@/utils/request'
export function getRoleDetail(ns,name) {
  return request({
    url: '/roles/'+ns+'/'+name,
    method: 'get',
  })
}

//修改 角色
export function updateRole(ns,name,data) {
  return request({
    url: '/roles/'+ns+'/'+name,
    data,
    method: 'post',
  })
}

export function addUserToBinding(ns,bdname,data) {
  return request({
    url: '/rolebindings?ns='+ns+'&name='+bdname,
    data,
    method: 'put',
  })
}

export function deleteUserFromBinding(ns,bdname,data) {
  return request({
    url: '/rolebindings?ns='+ns+'&name='+bdname+"&type=1",
    data,
    method: 'put',
  })
}

export function createRoleBinding(data) {
  return request({
    url: '/rolebindings',
    data,
    method: 'post',
  })
}

export function deleteRoleBinding(ns,name) {
  return request({
    url: '/rolebindings?ns=' +ns +"&name="+name,
    method: 'delete',
  })
}

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

//获取服务账号列表
export function getSaList(ns) {
  return request({
    url: '/sa?ns=' + ns,
    method: 'get',
  })
}

//删除clusterrole
export function deleteClusterRole(name) {
  return request({
    url: '/clusterroles?name='+name,
    method: 'delete',
  })
}
//获取clusterrole列表
export function getClusterRoleList(ns) {
  return request({
    url: '/clusterroles',
    method: 'get',
  })
}

export function getClusterRoleDetail(ns,name) {
  //这个ns依然没有用
  return request({
    url: '/clusterroles/'+name,
    method: 'get',
  })
}

//修改 角色
export function updateClusterRole(ns,name,data) {
  //这个ns参数用不到，为了前端代码方便，就没有去掉
  return request({
    url: '/clusterroles/'+name,
    data,
    method: 'post',
  })
}

export function createClusterRole(data) {
  return request({
    url: '/clusterroles',
    data,
    method: 'post',
  })
}

