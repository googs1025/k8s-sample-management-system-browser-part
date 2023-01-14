<template>
  <el-input :style="'width:'+input_width" v-model="text" placeholder="多个值请用逗号分隔" />
</template>
<script>
export default {
  props:['data',"input_width"],
  data(){
    return {
      text:'',
    }
  },
  created() {
    if(this.data!==undefined && this.data!=null){
      this.text=this.data.join(',')
    }
  },
  watch:{
    text:{
      handler(newVal,oldVal){
        this.$emit("update:data",this.text.split(','))
      },

    }
  }
}
</script>
