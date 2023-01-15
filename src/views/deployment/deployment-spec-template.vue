<template>
  <div>
    <el-card class="box-card" body-style="padding:10px">
      <div slot="header" class="clearfix" >
        <span>POD模板 <Expand :expand.sync="expand"/>  </span>
      </div>
      <div v-show="expand">
        <div>
          <el-form   >
            <el-form-item  >
              <MetaData v-show="!fastmod" labels="true" :data.sync="template.metadata" :tips="tips"/>
            </el-form-item>
            <el-form-item v-show="!fastmod">
              <Container defaultname="init" title="Init容器" :data.sync="template.spec.initContainers" :tips="tips"/>
              <span v-show="tips">(Init 容器是一种特殊容器，在 Pod 内的应用容器启动之前运行)</span>
            </el-form-item>
            <el-form-item>
              <Container :fastmod="fastmod" defaultname="container" title="业务容器" :data.sync="template.spec.containers" :tips="tips"/>
            </el-form-item>
            <el-form-item v-show="!fastmod">
              <Schedular :nodeName.sync="template.spec.nodeName" :tips="tips" :nodeSelector.sync="template.spec.nodeSelector"/>
              <span v-show="tips">(调度设置，包含了节点名称、节点标签选择、节点亲和性等)</span>
            </el-form-item>
          </el-form>

        </div>
      </div>

    </el-card>
  </div>
</template>
<script>

import {initIfNil} from  "../../utils/helper";
function copyObject(obj){
  var str=JSON.stringify(obj)
  return JSON.parse(str)
}
export default {
  props:["data","tips","fastmod"],
  data(){
    return {
      template:{metadata:{},spec:{containers:[]},},//
      expand: true,
    }
  },
  created(){

  },
  methods:{


  },
  watch:{
    data:{
      handler:function(newVal,oldVal) {
        //  newVal=initIfNil(newVal,"spec.containers",[])
        this.template=newVal
      },
      deep: true
    },
    template:{
      handler:function(newVal,oldVal) {
        this.$emit("update:data",newVal)
      },
      deep: true
    },
  },
  components:{
    Expand:()=>import("./card-expand.vue"),
    MetaData:()=>import('./deployment-metadata.vue'),
    Container:()=>import("./deployment-spec-template-container.vue"),
    Schedular:()=>import("./deployment-spec-template-scheduler.vue"),
  }


}
</script>
