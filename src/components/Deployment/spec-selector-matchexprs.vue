<template>
  <el-form-item label="标签选择器(选择器)">
    <i class="ii el-icon-circle-plus"  @click="addEmptyObject" ></i>
    <span v-show="tips">同上,支持In、NotIn、Exists 和 DoesNotExist</span>
    <el-form  :inline="true" v-for="(item,index) in matchExpressions"  style="margin-top: 10px">
      <el-input @change="change"  placeholder="填写key"    style="width: 250px" v-model="item.key" />
      <el-select v-model="item.operator">
        <el-option label="包含" value="In"/>
        <el-option label="不包含" value="NotIn"/>
        <el-option label="存在" value="Exists"/>
        <el-option label="不存在" value="DoesNotExist"/>
      </el-select>
      <ArrayInput :data.sync="item.values" input_width="200px" />
      <!--<el-input  @change="change" placeholder="填写value,多个用逗号分开"  style="width: 250px" v-model="item._values" />-->
      <el-button type="primary" @click="matchExpressions.splice(index,1)" style="margin-left: 20px"  >
        <i class="el-icon-minus"  ></i></el-button>
    </el-form>
  </el-form-item>
</template>
<script>
export default {
  props:["data","tips"],
  data(){
    return {
      matchExpressions:[],
      store:{_values:[]}
    }
  },
  created(){
    this.matchExpressions=this.data
    if(this.matchExpressions===undefined || this.matchExpressions===null)
      this.matchExpressions=[]

    this.unParseSlice()
  },
  methods:{
    addEmptyObject(){
      this.matchExpressions.push({key: '', operator: 'In', values: []})

    },
    unParseSlice(){ //编辑状态下，需要把 values  整合成_values(数组变成 ,号分割的字符串)
      if(this.matchExpressions===undefined){
        return
      }
      this.matchExpressions.forEach(item=>{
        item._values=item.values.join(',')
      })
    },
    change(index){
      this.matchExpressions.forEach((item,itemindex)=>{
        if(itemindex===index && item.key!==''){
          item.values=item._values.split(',')
        }
      })
    }
  },
  watch:{
    data:{
      handler:function(newVal,oldVal) {
        this.matchExpressions=newVal
        this.unParseSlice()
      },
      deep: true
    },
    matchExpressions:{
      handler(newVal,oldVal){
        this.$emit("update:data",newVal)
      },
      deep:true
    }
  },
  components:{
    ArrayInput:()=>import('@/components/Common/ArrayInput.vue')
  }
}
</script>
