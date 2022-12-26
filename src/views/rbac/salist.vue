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
      <el-table-column label="账号名称" width="350">
        <template slot-scope="scope">
          <p>{{ scope.row.metadata.name }}
            <i class="el-icon-paperclip" @click="()=>showToken(scope.row.secrets[0].name )"> </i>
          </p>


        </template>
      </el-table-column>
      <el-table-column label="命名空间" width="100" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.metadata.namespace }}  </p>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.metadata.creationTimestamp}}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i @click="()=>rmRole(scope.row.NameSpace,scope.row.Name )" class="el-icon-delete" > 删除</i>
          &nbsp;&nbsp;&nbsp;&nbsp;

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {  getSaList } from '@/api/rbac'
import { NewClient } from "@/utils/ws";
import { getList  as getNsList } from '@/api/ns'
import { getSecret} from "@/api/secret";

export default {
  data(){
    return {
      list: null,
      listLoading: true,
      wsClient:null,
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
    showToken(name){
      getSecret(this.namespace,name).then(rsp=>{

        let token=rsp.data.Data["token"]

        this.$alert(window.atob(token), name, {
          confirmButtonText: '确定',

        });
      })

    },
    rmRole(ns,name){
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteRole(ns,name)
      })

    },
    changeNs(ns){
      getSaList(ns).then(rsp=>{
        this.list=rsp.data
      })
    },
    fetchData()
    {
      this.listLoading = true
      // 通过rest api 获取
      getSaList(this.namespace).then(response => {
        this.list = response.data
        console.log(this.list)
        this.listLoading = false
      })
      this.wsClient = NewClient()
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data)
          if (object.type === 'sa' &&  object.result.ns===this.namespace) {
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
