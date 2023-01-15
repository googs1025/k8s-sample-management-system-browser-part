<template>
  <div>
    <!-- deployment 的基本信息 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息
       </span>
      </div>
      <el-form :inline="true">
        <el-form-item label="名称：">
          {{deployment.metadata.name}}
        </el-form-item>
        <el-form-item label="命名空间：">
          {{deployment.metadata.namespace}}
        </el-form-item>
        <el-form-item label="副本数：" style="width: 100%">
          <el-input-number :min="0" v-model="deployment.spec.replicas"/>

        </el-form-item>
      </el-form>

    </el-card>

    <!-- pods 列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Pods列表
       </span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="podslist"
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
            {{scope.row.status.phase}}
          </template>
        </el-table-column>
        <el-table-column label="名称" width="300">
          <template slot-scope="scope">
            {{scope.row.metadata.name}}
          </template>
        </el-table-column>
        <el-table-column label="镜像" width="250" align="center">
          <template slot-scope="scope">
            <p>镜像:{{ scope.row.spec.containers[0].image }}</p>

            <p>
              {{ scope.row.status.podIP }}
            </p>

          </template>
        </el-table-column>
        <el-table-column label="主机" width="250" align="center">
          <template slot-scope="scope">

            <p>
              {{scope.row.spec.nodeName}}({{ scope.row.status.hostIP }})
            </p>


          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">

          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>

import {loadDeploy,loadDeployPods} from "@/api/deployments";
export default {
  data(){
    return {
      deployment:{metadata:{},spec:{}},
      podslist:[],
      listLoading:false,
    }
  },
  created(){
    if(this.$route.params.ns!==undefined && this.$route.params.name!==undefined){
      const ns=this.$route.params.ns
      const name=this.$route.params.name
      loadDeploy(ns,name).then(rsp=>{
        this.deployment=rsp.data
        //加载pods列表
        loadDeployPods(ns,name).then(rsp=>{
          console.log(rsp.data)
          this.podslist=rsp.data
        })
      })
    }else{
      this.$router.push({name:"Deployments"})
    }
  },
  methods:{


  },
  watch:{

  },
  components:{

  }

}

</script>
<style>
.el-card__header{
  padding-top:10px;
  padding-bottom: 10px;
}
.el-card__body{padding: 10px}
</style>
