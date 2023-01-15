<template>
  <div class="app-container">
    <div>
      namespace:
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
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <p></p>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="350">
        <template slot-scope="scope">
          <p>{{ scope.row.Name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="命名空间" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.NameSpace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="170" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.CreateTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/ingress'
import { NewClient } from "@/utils/ws";
import {getList as getNsList} from "@/api/ns";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      wsClient:null,
      nslist:[] , //ns列表
      namespace: 'default'
    }
  },
  created() {
    this.fetchData()
    getNsList().then(rsp=>{
      this.nslist=rsp.data
    })
  },
  methods: {
    changeNs(ns){
      getList(ns).then(rsp=>{
        this.list=rsp.data
      })
    },
    fetchData() {
      this.listLoading = true
      // 通过rest api 获取
      getList(this.namespace).then(response => {
        this.list = response.data
        this.listLoading = false
      })
      this.wsClient = NewClient()
      this.wsClient.onmessage = (e)=>{
        if(e.data !== 'ping'){
          const object=JSON.parse(e.data)
          if(object.type === 'ingress'&& object.result.ns===this.namespace){
            this.list = object.result.data
            this.$forceUpdate()
          }
        }
      }

    },
  },

}
</script>
<style>
.red{color: #d20000
}
.green{color:green}
</style>
