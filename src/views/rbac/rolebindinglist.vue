<template>
  <div>
    <div style="padding: 20px">
      选择命名空间:
      <el-select placeholder="选择命名空间" @change="changeNs" v-model="namespace">
        <el-option v-for="ns in nslist "
                   :label="ns.Name"
                   :value="ns.Name"/>
      </el-select>

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
      <el-table-column label="绑定名称" width="350">
        <template slot-scope="scope">
          <p>{{ scope.row.Name }}  </p>
          <p>
            <el-tag closable :type="getType(sub.kind)" v-for="sub in scope.row.Subject">{{sub.name}}({{sub.kind}})</el-tag>
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
import { getRoleBindingList,deleteRole } from '@/api/rbac'
import { NewClient } from "@/utils/ws";
import { getList  as getNsList } from '@/api/ns'
export default {
  data(){
    return {
      list: null,
      listLoading: true,
      namespace: 'default',
      nslist:[] , //ns列表
    }
  },
  created() {
    getNsList().then(rsp=>{
      this.nslist=rsp.data
    })
    this.fetchData()

  },
  methods: {
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
          if (object.type === 'rolebinding') {
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
</style>
