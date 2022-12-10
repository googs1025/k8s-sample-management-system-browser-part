<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
        <el-form  :inline="true">
          <el-form-item  label="配置名称">
            <el-input  v-model="Name"></el-input>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-select  v-model="NameSpace">
              <el-option v-for="ns in nslist "
                         :label="ns.Name"
                         :value="ns.Name"/>
            </el-select>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
    <Component :is="currCom" v-bind:Name="Name" v-bind:NameSpace="NameSpace"></Component>

  </div>
</template>

<script>
import { getList  as getNsList } from '@/api/ns'
export default {
  data(){
    return {
      Name: "",
      NameSpace:"",
      nslist: [],
      currCom: "Kvs",

    }
  },
  created() {
    getNsList().then(rsp=>{
      this.nslist=rsp.data
    })

  },
  components:{
    Kvs: () => import('./configmap-create-kvs'),
  }
}

</script>
