<template>
  <div>
    <i class="ii el-icon-circle-plus"  @click="addMapSlice" ></i>
    <el-form v-for="(item,index) in mapSlice" style="margin-top: 5px">

      <el-form-item >
        <el-input :placeholder="placeholder"    v-model="item.key" style="width: 120px;margin-left:10px"/>
      </el-form-item>
      <el-form-item >
        =
      </el-form-item>
      <el-form-item ><el-input :placeholder="placeholder"    v-model="item.value" style="width: 120px;margin-left:10px"/> </el-form-item>
      <el-form-item > <i class="ii el-icon-remove-outline"  @click="rmMapSlice(index)" ></i>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>
import {objIsEqual} from "@/utils/helper";

export  default {
  props:["data","placeholder"],
  data(){
    return {
      mapSlice:[],  //{key:'字符串',value:string}
      mapObject:{}   //最终 产生的对象 {xxx:xxxx}

    }
  },
  mounted(){

  },
  methods:{
    addMapSlice(){
      this.mapSlice.push({key:'',value:''})
    },
    rmMapSlice(index){
      this.mapSlice.splice(index,1)
    },
    change(index){
      if(this.mapSlice[index].key!==''){
        this.mapObject[this.mapSlice[index].key]=this.mapSlice[index].value
      }
    },
    //把 slice解析为object
    parseSliceToObject(){
      var obj={}
      for(var i=0;i<this.mapSlice.length;i++){
        if(this.mapSlice[i].key!==''){
          obj[this.mapSlice[i].key]=this.mapSlice[i].value
        }
      }
      this.mapObject=obj
    }
  },
  watch:{
    data:{
      handler:function(newVal,oldVal) {
        if(objIsEqual(newVal,oldVal)) return

        this.mapObject=newVal
        this.mapSlice=[]
        for(var key in this.mapObject){
          this.mapSlice.push({key,value:this.mapObject[key]})
        }
      },
      deep: true
    },
    mapSlice:{
      handler:function(newVal,oldVal) {
        this.parseSliceToObject()
      },
      deep: true
    },
    mapObject:{
      handler:function(newVal,oldVal) {
        if(objIsEqual(newVal,oldVal)) return

        this.$emit("update:data",newVal)
      },
      deep: true

    },
  },
  components:{

  }
}
</script>
