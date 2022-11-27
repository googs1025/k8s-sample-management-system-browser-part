<template>
  <div>
    <el-container v-for="ns in nslist" >
      <el-header>{{ ns.Name }}</el-header>
      <el-main>
        <el-table
          :data="pods[ns.Name]"
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
          <el-table-column label="镜像" width="500" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.Images }}</p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.CreateTime }}
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>

</template>
<script>
import { getList } from "@/api/ns";
import { getPodsByNs } from "@/api/pods";

export default {
  data(){
    return {
      nslist:null,
      pods:{},
    }
  },
  created() {
    getList().then(response => {
      this.nslist = response.data  // namespace 列表
      this.nslist.forEach(ns=>{ //循环获取pods
        this.loadPods(ns.Name)
        this.$forceUpdate()
      })

    })
  },
  methods:{
    loadPods(ns){
      getPodsByNs(ns).then(rsp=>{
        this.pods[ns] = rsp.data
        this.$forceUpdate()
      })
    }
  }
}

</script>
<style>
.el-header, .el-footer {
  background-color: #7cd1c0;
  color: #fff;
  text-align: center;
  line-height: 60px;

}
</style>
