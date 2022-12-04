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
          <p v-html="getStatus(scope.row)"></p>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="350">
        <template slot-scope="scope">
          <p>{{ scope.row.Name }}</p>
          <p class="red">{{ getMessage(scope.row) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="命名空间" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.NameSpace }}</span>
        </template>
      </el-table-column>

      <el-table-column label="镜像" width="150" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.Images }}</p>
          <p>副本:<span class="green">{{ scope.row.Replicas[0] }}</span>/
            <span>{{ scope.row.Replicas[1] }}</span>/
            <span class="red">{{ scope.row.Replicas[2] }}</span></p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="170" align="center">
        <template slot-scope="scope">
          {{ scope.row.CreateTime }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/deployments'
import { NewClient } from '@/utils/ws'
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
      this.wsClient.onmessage = (e)=> {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data)
          if (object.type === 'deployments') {
            this.list = object.result.data
            this.$forceUpdate()
          }

        }
      }

    },
    getStatus(row){
      if(row.IsComplete)
        return "<span class='green'>Active</span>"
      return "<span class='red'>Waiting</span>"
    },
    getMessage(row){
      if(!row.IsComplete){
        return row.Message
      }
      return ''
    }
  },

}
</script>
<style>
.red{color: #d20000
}
.green{color:green}
</style>
