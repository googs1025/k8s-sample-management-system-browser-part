<template>
  <div>
    <i class="ii el-icon-circle-plus"  @click="addHeader" ></i>
    <el-form v-for="(item,index) in httpHeaders" style="margin-top: 5px">
      <el-form-item >
        <el-input :placeholder="placeholder"    v-model="item.name" style="width: 120px;margin-left:10px"/>
      </el-form-item>
      <el-form-item >
        =
      </el-form-item>
      <el-form-item ><el-input :placeholder="placeholder"    v-model="item.value" style="width: 120px;margin-left:10px"/> </el-form-item>
      <el-form-item > <i class="ii el-icon-remove-outline"  @click="rmHeader(index)" ></i>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>
export  default {
  props:["data","placeholder"],
  data(){
    return {
      httpHeaders:[],  //{key:'字符串',value:string}
    }
  },
  created(){
    this.initData()
  },
  methods:{
    initData(){
      this.httpHeaders=this.data
      if(this.httpHeaders===undefined || this.httpHeaders===null){
        this.$set(this,"httpHeaders",[])
      }
    },
    addHeader(){
      this.httpHeaders.push({name:'',value:''})
    },
    rmHeader(index){
      this.httpHeaders.splice(index,1)
    },

  },
  watch:{
    httpHeaders:{
      handler:function(newVal,oldVal) {
        var ret=[]
        this.httpHeaders.forEach(item=>{
          if(item.name!=='' && item.value!==''){
            ret.push(item)
          }
        })
        this.$emit("update:data",ret)
      },
      deep: true

    },
  },
  components:{

  }
}
</script>

