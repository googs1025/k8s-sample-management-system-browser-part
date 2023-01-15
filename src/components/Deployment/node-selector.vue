<template>
  <div>
    <i class="ii el-icon-circle-plus"  @click="addKey" ></i>
    <el-form v-for="(item,index) in selector" style="margin-top: 5px">
      <el-form-item >
        <el-input :placeholder="placeholder"    v-model="item.name" style="width: 120px;margin-left:10px"/>
      </el-form-item>
      <el-form-item >
        =
      </el-form-item>
      <el-form-item ><el-input :placeholder="placeholder"    v-model="item.value" style="width: 120px;margin-left:10px"/> </el-form-item>
      <el-form-item > <i class="ii el-icon-remove-outline"  @click="rmKey(index)" ></i>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>
export  default {
  props:["data","placeholder"],
  data(){
    return {
      selector:[],  //{key:'字符串',value:string}
    }
  },
  created(){
    this.initData()
  },
  methods:{
    initData(){
      this.selector=this.data
      if(this.selector===undefined || this.selector===null){
        this.$set(this,"selector",[])
      }
    },
    addKey(){
      this.selector.push({name:'',value:''})
    },
    rmKey(index){
      this.selector.splice(index,1)
    },

  },
  watch:{
    selector:{
      handler:function(newVal,oldVal) {
        console.log(111)
        var ret=[]
        newVal.forEach(item=>{
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
