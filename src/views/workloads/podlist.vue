<template>
  <div>
    <div style="margin:30px 0 30px 10px">
      <p><label>Pod总数:</label>
        <span>{{podsNum}}</span>

        <label>就绪:</label>
        <span class="green"> {{ podsReadyNum }}</span>

      </p>

    </div>
    <el-container v-for="ns in nslist" >
      <el-header>{{ ns.Name }}</el-header>
      <el-main>
        <el-table
          :data="pods[ns.Name]"
          border
          fit
          highlight-current-row
          :summary-method="getCount"
          show-summary
        >
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template slot-scope="scope">
              <p v-html="getStatus(scope.row.IsReady )"></p>
            </template>
          </el-table-column>
          <el-table-column label="名称" width="350">
            <template slot-scope="scope">
              <p>{{ scope.row.Name }}</p>
              <p class="red">{{ getMessage(scope.row) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="镜像" width="250" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.Images }}</p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.CreateTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <router-link icon="el-icon-edit" :to="{name:'Podshell',
              params:{ns:scope.row.NameSpace,pod:scope.row.Name}}"><el-link >远程<i class="el-icon-s-platform el-icon--right"></i></el-link></router-link>
              <router-link :to="{name:'Podlogs',
              params:{ns:scope.row.NameSpace,pod:scope.row.Name}}"> <el-link  >日志<i class="el-icon-view el-icon--right"></i></el-link></router-link>
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
import { NewClient } from "@/utils/ws";

export default {
  data(){
    return {
      nslist:null,
      pods:{},
      podsNum:0,
      podsReadyNum:0,
    }
  },
  created() {
    getList().then(response => {
      this.nslist = response.data  // namespace 列表
      this.nslist.forEach(ns=>{ //循环获取pods
        this.loadPods(ns.Name)
      })
      this.wsClient = NewClient()
      this.wsClient.onmessage = (e)=>{
        if(e.data !== 'ping'){
          const object=JSON.parse(e.data)
          if(object.type === 'pods'){
            this.pods[object.result.ns] = object.result.data
            this.$forceUpdate()
          }

        }
      }

    })
  },
  methods:{
    loadPods(ns){
      getPodsByNs(ns).then(rsp=>{
        this.pods[ns] = rsp.data
        this.pods[ns].forEach(item=>{
          this.podsNum++
          if (item.IsReady){
            this.podsReadyNum++
          }
        })
        this.$forceUpdate()
      })
    },
    getStatus(isReady) {
      if (isReady)
        return "<span class='green'>Active</span>"
      return "<span class='red'>Waiting</span>"
    },
    getCount(param){
      const { data } =param
      let podAllNum=0
      const sum=[]
      sum[0] = 'pods合计'
      data.forEach(item=>{
        podAllNum++
      })
      sum[1]=podAllNum
      return sum
    },
    getMessage(row){
      if(!row.IsReady){
        return row.Message
      }
      return ''
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
.red{color: #d20000
}
.green{color:green}
</style>
