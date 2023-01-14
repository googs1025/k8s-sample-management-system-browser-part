<template>
  <div>
    <el-card class="box-card" body-style="padding:10px">
      <div slot="header" class="clearfix" >
        <span>容器配置  <Expand :expand.sync="expand"/>
          <i class="ii el-icon-circle-plus"  @click="containers.push({name:'',image:'',ports:[]})" ></i>  </span>
      </div>
      <div v-show="expand">
        <div>
          <el-form >
            <el-form-item  >
              <el-form style="margin-bottom: 20px" :inline="true" v-for="(item,cindex) in containers">
                <el-form-item label="容器名">
                  <el-input v-model="item.name" />
                </el-form-item>
                <el-form-item label="镜像">
                  <el-input placeholder="如nginx:1.18-alpine" v-model="item.image" />
                </el-form-item>
                <el-form-item  >
                  <el-button type="primary" style="margin-left: 20px"  @click="containers.splice(cindex,1)"><i class="el-icon-minus"  ></i></el-button>
                </el-form-item>
              </el-form>
            </el-form-item>

          </el-form>

        </div>
      </div>

    </el-card>
  </div>
</template>
<script>

function copyObject(obj){
  var str=JSON.stringify(obj)
  return JSON.parse(str)
}
export default {
  props:["data","tips"],
  data(){
    return {
      containers:[{name:'',image:'',ports:[]}],//
      expand: true,
    }
  },
  created(){

  },
  methods:{
  },
  watch:{
    containers:{
      handler:function(newVal,oldVal) {
        this.$emit("update:data",newVal)
      },
      deep: true
    },
  },
  components:{
    Expand:()=>import("./card-expand.vue"),
    MetaData:()=>import('./deployment-metadata.vue'),

  }


}
</script>
