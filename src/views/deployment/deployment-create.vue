<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置
          <el-switch
            v-model="tips"
            active-text="打开教学"
            inactive-text="关闭教学"
          >
          </el-switch>
       </span>
      </div>
      <MetaDataConfig ref="metaData" @Update="UpdateObject"></MetaDataConfig>
      <SpecConfig ref="specData" @Update="UpdateObject" :tips="tips"></SpecConfig>
    </el-card>
    <div>
      <DeployYaml :deployment="deployment" />
    </div>
    <div style="text-align: center;margin-top: 20px">
      <el-button type="primary"  >保存</el-button>
    </div>
  </div>
</template>
<script>
import DeployYaml from  './deployment-yaml'
import {loadDeploy} from "@/api/deployments";

export default {
  data(){
    return {
      deployment:{ apiVersion:'apps/v1',Kind:'Deployment',
        metadata:{name:'',namespace:'default'},},
      tips:false,
      isUpdate: false
    }
  },
  created(){
    if(this.$route.params.ns!==undefined && this.$route.params.name!==undefined){
      const ns=this.$route.params.ns
      const name=this.$route.params.name
      loadDeploy(ns,name).then(rsp=>{
        this.deployment=rsp.data
        this.isUpdate=true
        this.$refs.metaData.setObject(this.deployment.metadata)
        this.$refs.specData.setObject(this.deployment.spec)
      })
    }
  },
  methods:{
    UpdateObject(key,value){
      this.$set(this.deployment,key,value)


    },
    postNew(){ //新增ingress

    }
  },
  components:{
    DeployYaml,
    MetaDataConfig:()=> import("./deployment-metadata"),
    SpecConfig:()=>import("./deployment-spec"),
  }

}

</script>
