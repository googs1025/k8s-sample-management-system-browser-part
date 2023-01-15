<template>
  <el-form  style="width: 100%;margin:10px auto">
    <el-form-item>
      <ArrayInput split=" " :data.sync="exec.command" input_width="400px"/>
      <span v-show="tips">填写命令：如 sh -c xxxx ，多个命令用空格分开</span>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props:["data","tips"],
  data(){
    return {
      exec:{}
    }
  },
  created(){
    this.initData(this.data)
  },
  methods:{
    clearData(){
      this.$set(this.exec,"command",[])
      this.$forceUpdate()
    },
    initData(data){
      this.exec=data
      if(this.exec===undefined){
        this.exec={}
      }
    }
  },
  watch:{
    data:{
      handler:function(newVal,oldVal) {
        this.initData(newVal)
      },
      deep: true
    },
    exec:{
      handler(newVal,oldVal){
        this.$emit("update:data",newVal)
      },
      deep:true
    }
  },
  components:{
    ArrayInput:()=>import("@/components/Common/ArrayInput"),

  }
}
</script>
