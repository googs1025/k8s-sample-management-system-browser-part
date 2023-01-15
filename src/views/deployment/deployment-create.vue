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
           <el-switch style="margin-left: 50px"
                      v-model="fastmod"
                      active-text="快捷模式"
                      inactive-text="详细模式"
           >
          </el-switch>
       </span>
      </div>

      <MetaDataConfig :fastmod="fastmod" :data.sync="deployment.metadata"  :tips="tips"></MetaDataConfig>
      <SpecConfig :fastmod="fastmod" :data.sync="deployment.spec"   :tips="tips"></SpecConfig>
    </el-card>
    <div>
      <DeployYaml :deployment="deployment" />
    </div>
    <div style="text-align: center;margin-top: 20px">
      <el-button type="primary"  @click="postDeploy" >保存</el-button>
    </div>
  </div>
</template>
<script>
import DeployYaml from  './deployment-yaml'
import {loadDeploy,createDeploy,updateDeploy} from "@/api/deployments";
import {clearEmptyObject} from "@/utils/helper";

export default {
  data(){
    return {
      deployment:{ apiVersion:'apps/v1',Kind:'Deployment',
        metadata:{}},
      tips:false,
      fastmod: false,//快捷模式
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

      })
    }
  },
  methods:{

    postDeploy(){ //新增ingress
      const operatorFunc=this.isUpdate?updateDeploy:createDeploy
      // console.log(this.deployment.spec.template.spec.containers[0])
      const cleardObject=clearEmptyObject(this.deployment)
      console.log(cleardObject)
      operatorFunc(cleardObject,this.fastmod).then(rsp=>{
        alert("成功")
        this.$router.push({name:"Deployments"})
      })
    }
  },
  watch:{

  },
  components:{
    DeployYaml,
    MetaDataConfig:()=> import("./deployment-metadata"),
    SpecConfig:()=>import("./deployment-spec"),
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
