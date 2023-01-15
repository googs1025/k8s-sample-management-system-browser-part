<template>
  <div>
    <el-card class="box-card" body-style="padding:10px">
      <div slot="header" class="clearfix" >
        <span>metadata设置 <Expand :expand.sync="expand"/>  </span>
        <div v-show="tips">
          元数据，包含name、namespace、labels(标签)等设置
        </div>
      </div>
      <div v-show="expand">
        <div>
          <el-form  :inline="true">
            <el-form-item label="名称" v-show="!this.labels">
              <el-input v-model="metadata.name"   placeholder="deployment名称"></el-input>
            </el-form-item>
            <el-form-item v-show="!this.labels" label="命名空间">
              <el-select   v-model="metadata.namespace">
                <el-option v-for="ns in nslist "
                           :label="ns.Name"
                           :value="ns.Name"/>
              </el-select>
            </el-form-item>
          </el-form>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span  >标签 <i class="ii el-icon-circle-plus"  @click="addLabel" ></i>  </span>
            </div>
            <el-form  :inline="true" v-for="(label,index) in store.labels"  style="margin-top: 10px">
              <el-input  placeholder="填写key" @change="parseLabel" style="width: 250px" v-model="label.key" />
              -
              <el-input placeholder="填写value" @change="parseLabel"  style="width: 250px" v-model="label.value" />
              <el-button type="primary" style="margin-left: 20px"  @click="rmLabel(index)">
                <i class="el-icon-minus"  ></i></el-button>
            </el-form>
          </el-card>
        </div>
      </div>

    </el-card>
  </div>
</template>
<script>
import { getList  as getNsList } from '@/api/ns'
function copyObject(obj){
  var str=JSON.stringify(obj)
  return JSON.parse(str)
}
export default {
  //labels 代表只显示labels
  props:["data","tips","labels"],
  data(){
    return {
      metadata:{name:'',namespace:'default',labels:{}},//metadata:{name:'',namespace:'default',lables:{},_lables:[]}
      store:{labels:[]},
      nslist:[] , //ns列表
      expand: true
    }
  },
  created(){
    getNsList().then(rsp=>{
      this.nslist=rsp.data
    })
  },
  methods:{
    checkProp(){  //对于一些自定的属性要做初始化检查
      if(this.metadata.labels===undefined) this.metadata.labels={}
    },
    addLabel(){
      this.checkProp()
      this.store.labels.push({key:'',value:''})

    },
    rmLabel(index){
      this.store.labels.splice(index,1)
    },
    unParseLabel(){
      //编辑状态下 需要解析 labels对象 为 _labels数组
      this.checkProp()
      this.store.labels=[]
      for(var key in this.metadata.labels){
        this.store.labels.push({key,value:this.metadata.labels[key]})
      }

    },
    parseLabel(){
      //把_labels数组解析为 label对象
      this.checkProp()
      this.metadata.labels={} //清空
      for(var i=0;i<this.store.labels.length;i++){
        if(this.store.labels[i].key==='') continue
        this.metadata.labels[this.store.labels[i].key]=this.store.labels[i].value
      }
    },
    setObject(v){
      this.metadata=copyObject(v)
      this.unParseLabel()
    },
    output(){
      return ''
    },
  },
  watch:{
    data:{
      handler:function(newVal,oldVal) {
        this.metadata=newVal
        this.unParseLabel()
      },
      deep: true
    },
    metadata:{
      handler:function(newVal,oldVal) {
        if(this.labels){ //只显示标签
          delete newVal.name
          delete newVal.namespace

        }
        console.log(newVal)
        this.$emit("update:data",newVal)


      },
      deep: true
    },
  },
  components:{
    Expand:()=>import("./card-expand.vue"),
  }


}
</script>
