<template>
  <div>
    <div style="padding: 20px">
      选择命名空间:
      <el-select placeholder="选择命名空间" @change="changeNs" v-model="namespace">
        <el-option v-for="ns in nslist "
                   :label="ns.Name"
                   :value="ns.Name"/>
      </el-select>
      <el-button type="primary" @click="$router.push({name:'Createrolebinding'})" >创建绑定</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="角色/绑定名称" width="350">
        <template slot-scope="scope">
          <p><span class="role">角色:</span>{{ scope.row.RoleRef.name }}</p>
          <p><span class="role">绑定名:</span>{{ scope.row.Name }}
            <i class=" el-icon-circle-plus" @click="()=>showAdd(scope.$index,scope.row.NameSpace,scope.row.Name)"  ></i>
          </p>
          <p>
            <el-tag class="ii" closable
                    :type="getType(sub.kind)"
                    v-for="sub in scope.row.Subject"
                    @close="rmUserFromBinding(scope.row.NameSpace,scope.row.Name,sub.kind,sub.name)"
            >
              {{sub.name}}({{sub.kind}})</el-tag>
          </p>
          <p v-show="addConfig.index===scope.$index" >
            <el-select v-model="addConfig.kind" style="width:80px;height:30px!important;">
              <el-option label="User" value="User"/>
              <el-option label="ServiceAccount" value="ServiceAccount"/>
            </el-select>
            <el-input placeholder="输入用户名" v-model="addConfig.name" style="width: 100px"></el-input>
            <i  class="ii el-icon-s-claim" @click="appendUserToBinding" > 保存</i>
            <i  class="ii el-icon-remove" @click="addConfig.index=-1"> 取消</i>

          </p>

        </template>
      </el-table-column>
      <el-table-column label="命名空间" width="100" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.NameSpace }}  </p>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.CreateTime }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <i @click="()=>rmRoleBinding(scope.row.NameSpace,scope.row.Name )" class="el-icon-delete" > 删除</i>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRoleBindingList,deleteRole,deleteRoleBinding,addUserToBinding ,deleteUserFromBinding} from '@/api/rbac'
import { NewClient } from "@/utils/ws";
import { getList  as getNsList } from '@/api/ns'
const apiGroup='rbac.authorization.k8s.io'
export default {
  data(){
    return {
      list: null,
      listLoading: true,
      namespace: 'default',
      nslist:[] , //ns列表
      addConfig:{
        index:-1,
        kind:'User',
        name:'',//用户名
        bindingname:'', //binding名称
        ns:'' //命名空间
      }
    }
  },
  created() {
    getNsList().then(rsp=>{
      this.nslist=rsp.data
    })
    this.fetchData()
  },
  methods: {
    showAdd(index,ns,bdname){
      this.addConfig.index=index
      this.addConfig.ns=ns
      this.addConfig.bindingname=bdname
    },
    rmUserFromBinding(ns,bdname,kind,username){
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteUserFromBinding(ns,bdname,{kind,name:username,apiGroup})
      })
    },
    appendUserToBinding(){
      const {ns,bindingname,kind,name}=this.addConfig
      //构建出一个subject
      addUserToBinding(ns,bindingname,{kind,name,apiGroup}).then(rsp=>{
        this.addConfig.index=-1
        this.addConfig.name=''
      })

    },
    rmRoleBinding(ns,name){
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteRoleBinding(ns,name)
      })
    },
    getType(kind){
      if(kind==="User"){
        return "info"
      }
      return "warning"
    },
    changeNs(ns){
      getRoleBindingList(this.namespace).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    fetchData()
    {
      this.listLoading = true
      // 通过rest api 获取
      getRoleBindingList(this.namespace).then(response => {
        this.list = response.data
        this.listLoading = false
      })
      this.wsClient = NewClient()
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data)
          if (object.type === 'rolebinding' && object.result.ns===this.namespace) {
            this.list = object.result.data
            this.$forceUpdate()
          }

        }
      }

    }
    ,
  }
}
</script>
<style>
i{cursor: pointer}
.ii{margin-left: 10px;font-size: 14px}
.role{color:green}
</style>
