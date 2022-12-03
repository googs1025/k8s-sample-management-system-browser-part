<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form  :inline="true">
        <el-form-item label="名称">
          <el-input v-model="name"   placeholder="ingress名称"></el-input>
        </el-form-item>
        <el-form-item label="命名空间">
          <!--<el-input v-model="namespace"  placeholder="如default"></el-input>-->
          <el-select @change="changeNs" v-model="namespace">
            <el-option v-for="ns in nslist "
                       :label="ns.Name"
                       :value="ns.Name"/>
          </el-select>
        </el-form-item>


      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>标签设置</span>
      </div>
      <div>
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="annotations">
        </el-input>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>规则</span>
      </div>
      <el-form v-model="rules"   v-for="(rule,ruleindex) in rules">
        <el-form  :inline="true">
          <el-form-item label="域名">
            <el-input v-model="rule.host"   placeholder="填写域名"></el-input>
          </el-form-item>
          <el-button type="primary" @click="addPathCfg(ruleindex)" >+</el-button>
        </el-form>
        <template   v-for="(pathcfg,pathindex) in rule.paths">
          <el-form :inline="true">
            <el-form-item label="Path">
              <el-input v-model="pathcfg.path"   placeholder="Path"></el-input>
            </el-form-item>
            <el-form-item label="服务名">
              <!--<el-input v-model="pathcfg.svc_name"  placeholder="填写Service Name"></el-input>-->
              <el-select v-model="pathcfg.svc_name">
                <el-option v-for="svc in svclist"
                           :label="svc.Name"
                           :value="svc.Name"/>
              </el-select>
            </el-form-item >
            <el-form-item label="端口">
              <el-input   v-model="pathcfg.port"  placeholder="填写服务端口"></el-input>
            </el-form-item>
            <el-form-item  >
              <el-button v-show="pathindex>0" type="primary" @click="rmPathCfg(ruleindex,pathindex)" >-</el-button>
            </el-form-item>
          </el-form>
        </template>

      </el-form>

    </el-card>
    <div style="text-align: center;margin-top: 20px;color:red">
      {{errorMsg}}
    </div>
    <div style="text-align: center;margin-top: 20px">
      <el-button type="primary" @click="postNew()">保存</el-button>
    </div>
  </div>
</template>
<script>
import { postIngress } from '@/api/ingress'
import { getList  as getNsList } from '@/api/ns'
import { getServiceList } from '@/api/services'
export default {
  data(){
    return {
      name:"",
      namespace: "",
      rules:[
        {host:"",paths:[{path:"",svc_name:"",port:"80"}]}
      ],
      nslist:[] , //ns列表
      svclist:[], // service 列表
      errorMsg: "", //错误信息
      annotations:"" //标签
    }
  },
  created(){
    getNsList().then(rsp=>{
      this.nslist=rsp.data
    })
  },
  methods:{
    //清空选中的svc，不然重复选会把其他namespace的service加入
    clearSelectSvc(){
      this.rules.forEach(rule=>{
        rule.paths.forEach(cfg=>{
          cfg.svc_name = ''
        })
      })
    },
    // 更换namespace时，service也换
    changeNs(ns){
      this.clearSelectSvc()
      getServiceList(ns).then(rsp=>{
        this.svclist=rsp.data
      })
    },
    // 新增path 配置
    addPathCfg(index){
      this.rules.forEach((rule,ruleindex)=>{
        if(ruleindex===index){
          rule.paths.push({path:"",svc_name:"",port:"80"})
        }
      })
    },
    // 删除path 配置
    rmPathCfg(ruleIndex,pathIndex){
      this.rules.forEach((rule,ruleindex)=>{
        if(ruleindex===ruleIndex){
          rule.paths.forEach((path,pathindex)=>{
            if(pathindex===pathIndex){
              rule.paths.splice(pathindex,1)
            }
          })
        }
      })
    },
    postNew(){ //新增ingress
      const data={Name:this.name,Namespace:this.namespace,Rules:this.rules,Annotations:this.annotations,}
      postIngress(data)
        .then((rsp)=>{
          //console.log(rsp.data)
          this.errorMsg= ''
          alert("成功")
        }).catch((error)=>{
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
