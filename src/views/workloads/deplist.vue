<template>
  <div class="app-container">
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
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <p v-html="getStatus(scope.row)"></p>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="350">
        <template slot-scope="scope">
          <p>
            <router-link :to="{name:'Createdeploy',params:{ns:scope.row.NameSpace,name:scope.row.Name}}">{{ scope.row.Name }}</router-link></p>
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
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="danger" @click="()=>delDeploy(scope.row.NameSpace,scope.row.Name )" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList,rmDeploy } from '@/api/deployments'
import { NewClient } from "@/utils/ws";
import { getList as getNsList } from '@/api/ns'
export default {
  data() {
    return {
      namespace:'default',
      list: null,
      listLoading: true,
      wsClient:null,
      nslist:[]
    }
  },
  created() {
    getNsList().then(rsp=>{
      this.nslist=rsp.data
      this.fetchData()
    })
  },
  methods: {
    delDeploy(ns,name){
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        rmDeploy(ns,name)
      })

    },
    changeNs(ns){
      getList(this.namespace).then(response => {
        this.list = response.data
        this.listLoading = false
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
          if(object.type === 'deployments' && object.result.ns===this.namespace){
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
