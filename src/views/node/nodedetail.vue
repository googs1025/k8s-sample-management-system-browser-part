<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form  :inline="true">
        <el-form-item label="名称">
          <el-input :value="node.Name" :disabled=true  placeholder="节点名称"></el-input>
        </el-form-item>
        <el-form-item label="host/ip">
          <el-input :value="node.HostName+'/'+node.IP" :disabled=true placeholder="节点名称"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>标签(系统标签请谨慎修改)<i class="ii el-icon-circle-plus"  @click="addLabel" ></i></span>
      </div>
      <template  v-for="(item,objindex) in labels"  >
        <el-form :inline="true">
          <el-form-item  >
            <el-input  v-model="item.Key"   placeholder="标签key"></el-input>
          </el-form-item>
          <el-form-item label="=">
            <el-input v-model="item.Value"    placeholder="标签值"></el-input>

          </el-form-item >
          <el-form-item  >
            <i class=" ii el-icon-remove-outline"  @click="rmLabel(objindex)" ></i>
          </el-form-item>
        </el-form>
      </template>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>污点 <i class="ii el-icon-circle-plus"  @click="addTaint" ></i></span>
      </div>
      <template  v-for="(item,objindex) in taints"  >
        <el-form :inline="true">
          <el-form-item  label="键">
            <el-input  v-model="item.Key"   placeholder="key"></el-input>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="item.Value"    placeholder="值"></el-input>
          </el-form-item >
          <el-form-item label="影响">
            <el-select v-model="item.Effect">
              <el-option label="不调度" value="NoSchedule"/>
              <el-option label="尽量不调度" value="PreferNoSchedule"/>
              <el-option label="不调度+驱逐" value="NoExecute"/>
            </el-select>

          </el-form-item >
          <el-form-item  >
            <i class=" ii el-icon-remove-outline"  @click="rmTaint(objindex)" ></i>
          </el-form-item>
        </el-form>
      </template>
    </el-card>
    <div style="text-align: center;margin-top: 20px;color:red">
      {{errorMsg}}
    </div>
    <div style="text-align: center;margin-top: 20px">
      <el-button type="primary" @click="saveNodeData" >保存</el-button>
    </div>
  </div>

</template>
<script>
import { getDetail,saveNode } from '@/api/node'
export default {
  data(){
    return{
      node: {},
      nodeName:"",
      errorMsg:'',
      labels:[

      ],
      taints:[

      ]
    }
  },
  mounted() {
    const nodeName=this.$route.params.node  //取到节点名称
    if(nodeName===undefined ) {
      this.$router.push({name:"Nodelist"})  //跳回列表页
      return
    }
    this.nodeName=nodeName
    getDetail(nodeName).then(rsp=>{
      this.node=rsp.data
      for(let key in this.node.OrginLabels){
        this.labels.push({Key:key,Value:this.node.OrginLabels[key]})
      }
      if(this.node.OrginTaints!==null){
        this.node.OrginTaints.forEach(item=>{
          this.taints.push({Key:item.key,Value:item.value,Effect:item.effect})
        })
      }
      this.$forceUpdate()
    })
  },
  methods:{
    addLabel(){
      this.labels.unshift({Key:'',Value:''})
    },
    addTaint(){
      this.taints.unshift({Key:'',Value:'',Effect:''})
    },
    rmLabel(objindex){
      this.labels.forEach((item,itemindex)=>{
        if(itemindex===objindex){
          this.labels.splice(objindex,1)
        }
      })
    },
    rmTaint(objindex){
      this.taints.forEach((item,itemindex)=>{
        if(itemindex===objindex){
          this.taints.splice(objindex,1)
        }
      })
    },
    saveNodeData(){
      const postLabels={} //构建 标签对象
      this.labels.forEach(item=>{
        postLabels[item.Key]=item.Value
      })
      const node={Name:this.nodeName,OrginLabels:postLabels,OrginTaints:this.taints}
      saveNode(node)
        .then((rsp)=>{
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
<style>
.ii{cursor: pointer;font-size: 28px}
</style>
