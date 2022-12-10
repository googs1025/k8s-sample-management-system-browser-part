<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span >配置详细

        </span>
      </div>
      <div >

        <el-form  :inline="true" label-width="80px" v-for="(item,itemindex) in kvs">
          <el-form-item label="key">
            <el-input  v-model="item.key"></el-input>
          </el-form-item>
          <el-form-item label="value">
            <el-input  v-model="item.value"></el-input>
          </el-form-item>
          <el-button v-show="itemindex>0" @click="rmKV(itemindex)" type="primary" icon="el-icon-minus" circle></el-button>
        </el-form>
        <el-button type="primary" @click="addKV" icon="el-icon-plus"  >添加配置</el-button>

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
import {postConfigMap} from '@/api/configmap'
export default{
  props:["Name","NameSpace"],
  data(){
    return {
      kvs:[
        {key:"",value:""}
      ],
      errorMsg: ""
    }
  },
  methods:{
    addKV(){
      this.kvs.push({key:"",value:""})
    },
    rmKV(index){
      this.kvs.splice(index,1)
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
        Data:postData,
      }

      postConfigMap(postModel)
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
