<template>
  <div>
    <div style="padding-left: 20px;padding-top:30px">
      选择容器:
      <el-select placeholder="选择容器" @change="containerChange" v-model="selectedContainer">
      <el-option v-for="c in containers "
                 :label="c.Name"
                 :value="c.Name"/>
    </el-select>
      <el-button type="primary" @click="showLogs">显示日志</el-button>
      <el-button  @click="logs=''">清空</el-button>
    </div>

    <div class="logs" ref="logs">
      {{logs}}
    </div>

  </div>
</template>
<script>
import {  getPodContainers ,getPodsLogs  } from "@/api/pods";
import request from '@/utils/request'

export default {
  data(){
    return {
      containers: [],
      selectedContainer: "",
      logs: "",
      ns: "",
      pod:""
    }
  },
  created() {
    const ns=this.$route.params.ns
    const pod=this.$route.params.pod
    if(ns===undefined || pod===undefined) {
      alert("错误的参数")
      this.$router.push({name:"Pods"})  //跳回pod列表页
    }else{
      this.ns=ns
      this.pod=pod
      getPodContainers(this.ns,this.pod).then(rsp=>{
        this.containers=rsp.data
      })
    }
  },
  methods:{
    containerChange(){
      getPodsLogs(this.ns,this.pod,this.selectedContainer)
        .then(rsp=>{
          this.logs=rsp.data
        })
    },
    showLogs() {
      request({
        url: '/pods/logs?namespace=' + this.ns
          + '&podname=' +this.pod +
          '&cname=' +this.selectedContainer,
        method: 'GET',
        onDownloadProgress: e => {
          console.log(e)
          const dataChunk = e.currentTarget.response;
          this.logs+=dataChunk
          if(this.$refs['logs']!==undefined && this.$refs['logs'].scrollTop!==undefined){
            this.$refs['logs'].scrollTop =  this.$refs['logs'].scrollHeight;
          }
        }
      }).catch(e=>{
        //偶尔发现 一些第三方软件 出错后 也会采取跳转的方法
        this.$router.push({name:"Pods"})  //跳回pod列表页


      });





    }
  }
}
</script>
<style>
.logs{
  overflow: auto;

  margin:10px auto;
  min-height: 200px;
  max-height: 400px;
  border: solid 1px black;
  background-color: #454545;
  padding: 10px;

  color:#27aa5e;
  line-height: 21pt;
  white-space: pre;
  width: 90%
}
</style>
