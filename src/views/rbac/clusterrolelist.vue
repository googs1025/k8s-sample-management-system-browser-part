<template>
  <div>

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
      <el-table-column label="角色名" width="350">
        <template slot-scope="scope">
          <p><router-link :to="{name:'Createrole',
              params:{ns:'cluster',name:scope.row.metadata.name,isCluster:true}}">
            {{scope.row.metadata.name }}</router-link>  </p>
        </template>
      </el-table-column>


      <el-table-column label="创建时间" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.metadata.creationTimestamp }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i @click="()=>rmClusterRole(scope.row.metadata.name )" class="el-icon-delete" > 删除</i>
          &nbsp;&nbsp;&nbsp;&nbsp;

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getClusterRoleList,deleteClusterRole } from '@/api/rbac'
import { NewClient } from "@/utils/ws";

export default {
  data(){
    return {
      list: null,
      listLoading: true,
      wsClient:null,
      namespace: 'default',

    }
  },
  created() {

    this.fetchData()

  },
  methods: {
    rmClusterRole(name){
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteClusterRole(name)
      })

    },

    fetchData()
    {
      this.listLoading = true
      // 通过rest api 获取
      getClusterRoleList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
      this.wsClient = NewClient()
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data)
          if (object.type === 'clusterrole') {
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
