<template>
  <div>
    <el-card class="box-card" body-style="padding:10px">
      <div slot="header" class="clearfix" >
        <span>POD模板 <Expand :expand.sync="expand"/>  </span>
      </div>
      <div v-show="expand">
        <div>
          <el-form   >
            <el-form-item  >
              <MetaData labels="true" :data.sync="template.metadata" :tips="tips"/>
            </el-form-item>
            <el-form-item>
              <Container :data.sync="template.spec.containers" :tips="tips"/>
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
      template:{metadata:{},spec:{}},//
      expand: true,
    }
  },
  created(){

  },
  methods:{


  },
  watch:{
    template:{
      handler:function(newVal,oldVal) {
        this.$emit("update:data",newVal)
      },
      deep: true
    },
  },
  components:{
    Expand:()=>import("./card-expand.vue"),
    MetaData:()=>import('./deployment-metadata.vue'),
    Container:()=>import("./deployment-spec-template-container.vue")
  }


}
</script>
