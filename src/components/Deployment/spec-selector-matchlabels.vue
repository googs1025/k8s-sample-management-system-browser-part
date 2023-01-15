<template>
  <el-form-item label="标签选择器(key-value)">
    <i class="ii el-icon-circle-plus"  @click="addSlice" ></i>
    <span v-show="tips">匹配pod的标签,用于选择和管理对应的pods</span>
    <el-form  :inline="true" v-for="(item,index) in matchLabels_array"  style="margin-top: 10px">
      <el-input  placeholder="填写key"  @change="parseSlice"  style="width: 250px" v-model="item.key" />
      =
      <el-input placeholder="填写value" @change="parseSlice"    style="width: 250px" v-model="item.value" />
      <el-button type="primary" @click=" matchLabels_array.splice(index,1);parseSlice()" style="margin-left: 20px"  >
        <i class="el-icon-minus"  ></i></el-button>
    </el-form>
  </el-form-item>
</template>
<script>
export default {
  props:["data","tips"],
  data(){
    return {
      matchLabels:{},
      matchLabels_array:[]  // [{key:'xx',value:''}]
    }
  },
  created(){
    this.matchLabels=this.data
    this.unParseSlice()
  },
  methods:{
    addSlice(){
      this.matchLabels_array.push({key:'',value:''})

      // this.parseSlice()
    },
    parseSlice(){  //把数组解析为对象
      this.matchLabels={}
      this.matchLabels_array.forEach(item=>{
        if(item.key!==''){
          this.matchLabels[item.key]=item.value
        }
      })

    },
    unParseSlice(){  //把对象 解析为数组， 常用于编辑状态
      this.matchLabels_array=[]
      for(var key in this.matchLabels){
        this.matchLabels_array.push({key,value:this.matchLabels[key]})
      }
    }
  },
  watch:{
    data:{
      handler:function(newVal,oldVal) {
        this.matchLabels=newVal
        this.unParseSlice()
      },
      deep: true
    },
    matchLabels:{
      handler(newVal,oldVal){
        this.$emit("update:data",newVal)
      },
      deep:true
    }
  }
}
</script>
