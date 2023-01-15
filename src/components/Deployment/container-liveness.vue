<template>
  <el-form-item >

    <el-form    style="width: 90%;margin:10px auto">
      <el-form-item label="Exec模式" style="width: 100%;margin-bottom: 10px">
        <ArrayInput split=" " :data.sync="livenessProbe.exec.command" input_width="400px"/>
      </el-form-item>
      <el-form-item label="延迟探测" style="width: 100%;margin-bottom: 10px">
        <el-input-number :min="0" v-model="livenessProbe.initialDelaySeconds"></el-input-number>
        <span v-show="tips">执行第一次探测前应该等待的秒数</span>
      </el-form-item>
      <el-form-item label="探测周期">
        <el-input-number :min="0"  v-model="livenessProbe.periodSeconds"></el-input-number>
        <span v-show="tips">每 多少 秒执行一次存活探测</span>
      </el-form-item>
    </el-form>
  </el-form-item>
</template>
<script>
export default {
  props:["data","tips"],
  data(){
    return {
      livenessProbe:{
        exec:{command:[]},
        initialDelaySeconds:0,
        periodSeconds:0,
      }
    }
  },
  created(){

  },
  methods:{
    initData(data){
      this.livenessProbe=data
      if(this.livenessProbe===undefined){
        this.livenessProbe={
          exec:{command:[]},
          initialDelaySeconds:0,
          periodSeconds:0,
        }
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
    livenessProbe:{
      handler(newVal,oldVal){
        this.$emit("update:data",newVal)
      },
      deep:true
    }
  },
  components:{
    ArrayInput:()=>import("@/components/Common/ArrayInput")
  }
}
</script>
