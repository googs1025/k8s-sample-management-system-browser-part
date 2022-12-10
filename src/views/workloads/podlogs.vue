<template>
  <div>
    <div style="padding-left: 20px;padding-top:30px">
      容器: <el-select  @change="containerChange"  placeholder="选择容器"
                      v-model="selectedContainer">
      <el-option v-for="c in containers "
                 :label="c.Name"
                 :value="c.Name"/>
    </el-select>
    </div>
    <div class="logs">
      {{logs}}
    </div>
  </div>
</template>
<script>
import {  getPodContainers ,getPodsLogs } from "@/api/pods";
import request from '@/utils/request'
export default {
  data(){
    return {
      containers: [],
      selectedContainer: "",
      logs: ""
    }
  },
  created() {
    getPodContainers("k8s-operator-practice-easy-system","k8s-operator-practice-easy-controller-manager-5f69769dbb-7vvw4").then(rsp=>{
      this.containers=rsp.data
    })
  },
  methods:{
    containerChange(){
      // 单次访问用
      // getPodsLogs("k8s-operator-practice-easy-system","k8s-operator-practice-easy-controller-manager-5f69769dbb-7vvw4",this.selectedContainer)
      //   .then(rsp=>{
      //     this.logs=rsp.data
      //   })
      // 流式读取用
      const ns="k8s-operator-practice-easy-system"
      const podname="k8s-operator-practice-easy-controller-manager-5f69769dbb-7vvw4"
      const cname=this.selectedContainer
      request({
        url: '/pods/logs?namespace=' + ns + '&podname=' +podname + '&cname=' +cname,
        method: 'GET',
        onDownloadProgress: e => {
          const dataChunk = e.currentTarget.response;
          this.logs+=dataChunk

        }
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
