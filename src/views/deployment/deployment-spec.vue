<template>
  <div>
    <el-card class="box-card" body-style="padding:10px">
      <div slot="header" class="clearfix" >
        <span>核心设置 <Expand :expand.sync="expand"/>  </span>
      </div>
      <div v-show="expand">
        <div>
          <el-form   >
            <el-form-item label="副本数">
              <el-input-number v-model="spec.replicas"  :min="1" :max="20" label="副本数"></el-input-number>
              <span v-show="tips">deployment重要特性，来控制正常运行时pod的数量和期望保持一致</span>
            </el-form-item>
            <MatchLabels v-show="!fastmod" :data.sync="spec.selector.matchLabels" :tips="tips"/>
            <MatchExprs v-show="!fastmod" :data.sync="spec.selector.matchExpressions" :tips="tips"/>
            <TplConfig :fastmod="fastmod" :data.sync="spec.template" :tips="tips"/>
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
  props:["data","tips","fastmod"],
  data(){
    return {
      spec:{replicas:1,selector:{}, },//
      expand: true,
    }
  },
  created(){

  },
  methods:{


  },
  watch:{
    data:{
      handler:function(newVal,oldVal) {
        this.spec=newVal

      },
      deep: true
    },
    spec:{
      handler:function(newVal,oldVal) {
        this.$emit("update:data",newVal)
      },
      deep: true
    },
  },
  components:{
    Expand:()=>import("./card-expand.vue"),
    MatchLabels:()=>import('@/components/Deployment/spec-selector-matchlabels.vue'),
    MatchExprs:()=>import('@/components/Deployment/spec-selector-matchexprs.vue'),
    TplConfig:()=>import("./deployment-spec-template.vue"),
  }


}
</script>
