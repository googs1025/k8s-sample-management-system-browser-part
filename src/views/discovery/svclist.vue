<template>
  <div class="app-container">
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
      <el-table-column label="服务发现种类" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Ports }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ClusterIps" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ClusterIps }}</span>
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
import { getServiceList } from '@/api/services'
import { NewClient } from '@/utils/ws'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      wsClient:null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // 通过rest api 获取
      getServiceList('default').then(response => {
        this.list = response.data
        this.listLoading = false
      })
      this.wsClient = NewClient()
      this.wsClient.onmessage = (e)=> {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data)
          if (object.type === 'services') {
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
