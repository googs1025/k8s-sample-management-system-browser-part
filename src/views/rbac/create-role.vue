<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
        <el-form  :inline="true">
          <el-form-item  label="角色名称">
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
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>资源授权  <i class="ii el-icon-circle-plus"  @click="addRole" ></i></span>
        <el-form  :inline="true" v-for="(rule,ruleindex) in rules" style="margin-top: 20px">
          <el-form-item>
            <el-select
              v-model="rule.groupversion"
              allow-create
              filterable
              default-first-option
              placeholder="Api组" @change="(v)=>selectChanged(v,ruleindex)">
              <el-option-group
                v-for="(group,index) in resources"
                :key="group.Group+index"
                :label="group.Group" :value="group.Group" >
                <el-option
                  v-for="item in group.Resources"
                  :key="item.Name+index"
                  :label="item.Name"
                  :value="group.Group+':'+item.Name" >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>


          <el-form-item>
            <el-select style="width: 300px"
                       v-model="rule.verbs"
                       allow-create
                       filterable
                       multiple
                       placeholder="权限">
              <el-option v-for="v in rule.verbscopy"
                         :label="v"
                         :value="v">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary"  @click="rmRule(ruleindex)">
            <i class="el-icon-minus"  ></i></el-button>
        </el-form>

      </div>
      <el-button type="primary" @click="saveRole" >保存</el-button>
    </el-card>
  </div>
</template>
<script>
import { getList  as getNsList } from '@/api/ns'
import {getResources} from "@/api/resources";
import {createRole} from "@/api/rbac";

export default {
  data(){
    return {
      Name: "",
      NameSpace:"",
      nslist: [],
      rules:[  //前端所使用的rule
        {groupversion:'',verbs:[],verbscopy:[]}
      ],
      //提交用的
      postRules:[
        //{apiGroups:[],resources:[],verbs:[]}
      ],
      resources:[] //从后端 请求 /resources 得到所有 group 和 资源 列表
    }
  },
  created() {
    getNsList().then(rsp=>{
      this.nslist=rsp.data
    })
    getResources().then(rsp=>{
      this.resources=rsp.data
    })

  },
  methods:{
    addRole(){
      this.rules.unshift({groupversion:'',verbs:[]})
    },
    selectChanged(v,index){
      // v 包含了  group 和 resourcename .需要拆开 ,然后去 resource对象中寻找verbs
      var gv=v.split(':')
      var verbs=[]
      this.resources.forEach((item)=>{
        if(item.Group===gv[0]){
          item.Resources.forEach((res)=>{
            if(res.Name===gv[1]){
              verbs=res.Verbs
            }
          })
        }
      })
      this.rules[index].verbs=[]
      this.rules[index].verbscopy=verbs

    },
    rmRule(index){
      this.rules.splice(index,1)
    },
    //拼接
    concatRules(){
      // 合并成这样:{apiGroups:[],resources:[],verbs:[]}
      this.postRules=[]
      this.rules.forEach((rule)=>{
        var gv=rule.groupversion.split(':')  //切割 。 第一段group 第二段 resourcename，如果碰到是core ，则就是空字符串
        var g=gv[0]
        var v=gv[1]
        if(g==="core")
          g=""
        this.postRules.push({apiGroups:[g],resources:[v],verbs:rule.verbs})
      })
    },
    saveRole(){
      this.concatRules() //拼接rule对象
      const postData={metadata:{name:this.Name,namespace:this.NameSpace},rules:this.postRules}
      console.log(postData)
      createRole(postData).then(rsp=>{
        alert("成功")
      })

    }
  }

}

</script>
<style>
.ii{font-size: 18px}
</style>
