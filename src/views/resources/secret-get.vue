<template>
  <div>
    <div style="padding: 10px">
      命名空间：{{ns}}   名称:{{name}}
    </div>
    <div style="text-align: center">
      <el-table
        :data="SecretData"
        border
        style="width: 100%"
      >
        <el-table-column
          label="Key名"
          width="180">
          <template slot-scope="scope">
            <p>{{ scope.row.key }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="value值"
          width="380">
          <template slot-scope="scope">
            <p @mousedown="()=>b64Decode(scope.row.value,scope.row.key)"
               @mouseup="()=>showStr(scope.row.value,scope.row.key)"
               :ref="scope.row.key">{{ scope.row.value }}</p>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>

</template>
<script>
import {getSecret} from "@/api/secret";

export default {
  data(){
    return {
      SecretData:[],
      ns:"",
      name:""
    }
  },
  created() {
    this.ns=this.$route.params.ns
    this.name=this.$route.params.name
    // 可以测试 getSecret("default","myscret").then(rsp=>{
    getSecret(this.ns,this.name).then(rsp=>{

      for(let key in rsp.data.Data){
        this.SecretData.push(
          {key,value:rsp.data.Data[key]}
        )
      }
    })
  },
  methods:{
    // 转编码
    b64Decode (str,ref) {
      this.$refs[ref].innerHTML=decodeURIComponent(atob(str));
    },
    showStr(str,ref){
      this.$refs[ref].innerHTML=str
    }

  }

}
</script>
