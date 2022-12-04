<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>TLS类型

        </span>
      </div>
      <div >

        <el-form   label-width="80px"  >
          <el-form-item label="私钥Key">
            <el-input style="width:200px"  v-model="kvs[0].key"></el-input>
          </el-form-item>
          <el-form-item label="私钥内容">
            <el-input  placeholder="-----BEGIN RSA PRIVATE KEY-----开头的内容"   type="textarea" :row="2" v-model="kvs[0].value"></el-input>
            <a href="javascript:" class="file">从文件导入
              <input  @change="()=>fileChange('filekey')" ref="filekey" type="file"  accept=".txt,.pem,.key,.pkey"></input>
            </a>
          </el-form-item>

          <el-form-item label="证书key">
            <el-input   style="width:200px"  v-model="kvs[1].key"></el-input>
          </el-form-item>
          <el-form-item label="证书内容">
            <el-input  placeholder="-----BEGIN CERTIFICATE-----开头的内容" type="textarea" :row="2" v-model="kvs[1].value"></el-input>
            <a href="javascript:" class="file">从文件导入
              <input  @change="()=>fileChange('filecrt')" type="file" ref="filecrt" accept=".txt,.pem,.crt,.cert"></input>
            </a>
          </el-form-item>

        </el-form>

        <el-button type="primary" @click="Save" icon="el-icon-success">保存</el-button>
      </div>
      <div style="text-align: center;margin-top: 20px;color:red">
        {{errorMsg}}
      </div>
      <div>


      </div>
    </el-card>
  </div>
</template>
<script>
import {postSecret} from '@/api/secret'
export default{
  props:["Name","NameSpace"],
  data(){
    return {
      kvs:[
        {key:"tls.key",value:""},
        {key:"tls.crt",value:""}
      ],
      errorMsg: ""
    }
  },
  methods:{
    fileChange(fileName){
      if(this.$refs[fileName].value!==''){
        const reader=new FileReader()
        reader.readAsText(this.$refs[fileName].files[0],'UTF-8')
        reader.onload=(e)=>{
          if(fileName==='filekey') //私钥
          {
            this.kvs[0].value=e.target.result
          }else{
            this.kvs[1].value=e.target.result
          }
        }
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    Save(){
      // 把kv数组整合成一个大对象
      let postData={}
      this.kvs.forEach((item)=>{
        postData[item.key]=item.value // 给对对象赋值 包含(key ,value)
      })


      const postModel={
        Name:this.$props.Name,
        NameSpace:this.$props.NameSpace,
        Type:"kubernetes.io/tls",
        Data:postData,
      }

      postSecret(postModel)
        .then(rsp=>{
          alert("创建成功")
        }).
      catch((error)=>{
        if(error.response){
          this.errorMsg = JSON.stringify(error.response.data)
        }else{
          this.errorMsg = JSON.stringify(error.message)
        }
      })
    }
  }
}
</script>
<style>
.file {
  position: relative;
  display: inline-block;
  background: #D0EEFF;
  border: 1px solid #99D3F5;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #1E88C7;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
.file:hover {
  background: #AADFFD;
  border-color: #78C3F3;
  color: #004974;
  text-decoration: none;
}
</style>
