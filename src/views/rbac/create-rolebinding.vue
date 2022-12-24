<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择角色</span>
        <el-form  :inline="true">
          <el-form-item label="绑定名称">
            <el-input v-model="metadata.name"></el-input>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-select  v-model="metadata.namespace" @change="changeNs">
              <el-option v-for="ns in nslist "
                         :label="ns.Name"
                         :value="ns.Name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="选择角色">
            <el-select  v-model="roleRef.name">
              <el-option v-for="role in rolelist "
                         :label="role.Name"
                         :value="role.Name"/>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择用户  <i class="ii el-icon-circle-plus"  @click="addSubject" ></i></span>
        <el-form  :inline="true" v-for="(sub,subindex) in subjects" style="margin-top: 20px">
          <el-form-item>
            <el-select
              v-model="sub.kind"
              placeholder="用户类型"  >
              <el-option
                label="User"
                value="User" >
              </el-option>
              <el-option
                label="ServiceAccount"
                value="ServiceAccount" >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="输入用户名" v-model="sub.name"/>
          </el-form-item>
          <el-button type="primary" v-show="subindex>0"  @click="rmSubject(subindex)">
            <i class="el-icon-minus"  ></i></el-button>
        </el-form>

      </div>
      <el-button type="primary" @click="saveRoleBinding" >保存</el-button>
    </el-card>
  </div>
</template>
<script>
import { getList  as getNsList } from '@/api/ns'
import {getResources} from "@/api/resources";
import {getRoleList,createRoleBinding} from "@/api/rbac";

const apiGroup='rbac.authorization.k8s.io'
export default {
  data(){
    return {
      metadata:{name:"",namespace:"default"},
      nslist: [],
      rolelist:[],//切换ns后 填充角色列表
      roleRef:{apiGroup,kind:"Role",name:""},
      subjects:[  //前端所使用的rule
        {apiGroup,kind:'User',name:''}
      ],
    }
  },
  created() {
    getNsList().then(rsp=>{
      this.nslist=rsp.data
      this.loadRolelist()
    })
  },
  methods:{
    changeNs(ns){
      this.roleRef.name=''
      this.loadRolelist()
    },
    loadRolelist(){
      getRoleList(this.metadata.namespace).then(rsp=>{
        this.rolelist=rsp.data
      })
    },
    addSubject(){
      this.subjects.unshift({apiGroup,kind:'User',name:''})
    },

    rmSubject(index){
      this.subjects.splice(index,1)
    },

    saveRoleBinding(){

      createRoleBinding({metadata:this.metadata,subjects:this.subjects,roleRef:this.roleRef}).then(rsp=>{
        alert("成功")
      })
    }
  }

}

</script>
<style>
.ii{font-size: 18px}
</style>
