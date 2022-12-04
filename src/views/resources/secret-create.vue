<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
        <el-form  :inline="true">
          <el-form-item  label="密文名称">
            <el-input  v-model="Name"></el-input>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-select  v-model="NameSpace">
              <el-option v-for="ns in nslist "
                         :label="ns.Name"
                         :value="ns.Name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="类型">
            <el-select  v-model="currCom">
              <el-option v-for="com in comlist "
                         :label="com.key"
                         :value="com.value"/>
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
      currCom: "Opaque",
      comlist: [
        {key: "基本类型", value:"Opaque"},
        {key: "TLS类型", value: "TLS"}
      ]
    }
  },
  created() {
    getNsList().then(rsp=>{
      this.nslist=rsp.data
    })

  },
  components:{
    Opaque: () => import('./secret-create-opaque'),
    TLS: () => import('./secret-create-tls')
  }
}

</script>
