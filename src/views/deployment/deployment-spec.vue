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
              <span v-show="$parent.$parent.tips">deployment重要特性，来控制正常运行时pod的数量和期望保持一致</span>
            </el-form-item>
            <el-form-item label="标签选择器(key-value)">
              <i class="ii el-icon-circle-plus"  @click="addSlice('matchLabels')" ></i>
              <span v-show="$parent.$parent.tips">匹配pod的标签,用于选择和管理对应的pods</span>
              <el-form  :inline="true" v-for="(item,index) in store.matchLabels"  style="margin-top: 10px">
                <el-input  placeholder="填写key"  @change="parseSlice('matchLabels', 'selector.matchLabels')"  style="width: 250px" v-model="item.key" />
                =
                <el-input placeholder="填写value" @change="parseSlice('matchLabels', 'selector.matchLabels')"    style="width: 250px" v-model="item.value" />
                <el-button type="primary" @click="()=>{rmSlice('matchLabels',index);parseSlice('matchLabels', 'selector.matchLabels')}" style="margin-left: 20px"  >
                  <i class="el-icon-minus"  ></i></el-button>
              </el-form>
            </el-form-item>
            <el-form-item label="标签选择器(表达式)">
              <i class="ii el-icon-circle-plus"  @click="addEmptyObject('selector.matchExpressions',{key: '', operator: 'In', values: []})" ></i>
              <span v-show="$parent.$parent.tips">同上,支持In、NotIn、Exists 和 DoesNotExist</span>
              <el-form  :inline="true" v-for="(item,index) in spec.selector.matchExpressions"  style="margin-top: 10px">
                <el-input  placeholder="填写key"    style="width: 250px" v-model="item.key" />
                <el-select v-model="item.operator">
                  <el-option label="包含" value="In"/>
                  <el-option label="不包含" value="NotIn"/>
                  <el-option label="存在" value="Exists"/>
                  <el-option label="不存在" value="DoesNotExist"/>
                </el-select>
                <el-input placeholder="填写value"  style="width: 250px" v-model="item.values[0]" />
                <el-button type="primary" @click="()=>{rmOrginSlice('selector.matchExpressions',index)}" style="margin-left: 20px"  >
                  <i class="el-icon-minus"  ></i></el-button>
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
  data(){
    return {
      spec:{replicas:1,selector:{}},//
      store:{matchLabels:[]},  //做了下改进，为了不影响 原生yaml，放到单独对象里
      expand: true
    }
  },
  created(){

  },
  methods:{
    //用于设置一些初始值
    setInitValue(obj,key,v){
      if(obj[key]===undefined)
        obj[key]=v
    },
    checkProp(){  //对于一些自定的属性要做初始化检查
      this.setInitValue(this.spec,"selector",{})
    },
    setObject(v){
      this.spec=copyObject(v)
      this.checkProp() //检查必须存在的对象 或属性
      this.unParseSlice("matchLabels","selector.matchLabels")
    },
    addSlice(key,defaulObj){  // 对于类似 selector 这样的数组转对象，做个通用方法 (操作this.store对象)
      if(defaulObj===undefined){
        defaulObj={key:'',value:''}
      }
      this.store[key].push(defaulObj)
    },

    rmSlice(key,index){  // 对于类似 selector 这样的数组转对象，做个通用方法(操作this.store对象)
      this.store[key].splice(index,1)
    },
    //返回对象{destObject,lastKey}
    genObjectString(destKey){ // 生成对象字符串  如this.spec['selector']['mathcLabels']支持多级

      //this.spec['selector']      'matchLabels'
      var destObject="this.spec"  //凑字符串
      var lastKey=''
      var destArray=destKey.split('.')
      if(destArray.length>1){
        for(var j=0;j<destArray.length-1;j++){
          destObject+='[\''+destArray[j]+'\']'
        }
        lastKey=destArray[destArray.length-1]
      }else{
        lastKey=destArray[0]
      }
      return {destObject,lastKey}
    },
    //后面 可能还要修改和扩展 。 默认取 数组的key和value
    // destkey 可能有多级。 如 selector.matchLabes
    parseSlice(sliceKey,destKey){// 对于类似 selector 这样的数组转对象 , 这个方法是 数组->对象
      const {destObject,lastKey}=this.genObjectString(destKey)
      var obj={}
      for(var i=0;i<this.store[sliceKey].length;i++){
        if(this.store[sliceKey][i].key==='') continue
        obj[this.store[sliceKey][i].key]=this.store[sliceKey][i].value
      }
      eval('this.$set('+destObject+',\''+lastKey+'\',obj)')   //Vue
    },
    // 对于类似 selector 这样的数组转对象 , 这个方法是 对象-->数组
    unParseSlice(sliceKey,destKey){
      const {destObject,lastKey}=this.genObjectString(destKey)
      this.store[sliceKey]=[] //清空数组
      var obj

      eval('obj='+destObject+'[\''+lastKey+'\']')
      if(obj!==undefined){
        for(var key in obj){
          this.store[sliceKey].push({key,value:obj[key]})
        }
      }
    },
    rmOrginSlice(key,index){ //操作spec对象，删除数组中某个元素
      const {destObject,lastKey}=this.genObjectString(key)
      eval(destObject+'[\''+lastKey+'\'].splice(index,1)')
    },
    //在spec对象中添加空对象,,,用于 对象值 是一个数组的形式 如 spect.matchExpressions
    addEmptyObject(destKey,obj){
      const {destObject,lastKey}=this.genObjectString(destKey)
      eval('if('+destObject+'[\''+lastKey+'\']===undefined) '+'this.$set('+destObject+',\''+lastKey+'\',[])')

      eval(destObject+'[\''+lastKey+'\'].push(copyObject(obj))')
    }

  },
  watch:{
    spec:{
      handler:function(newVal,oldVal) {
        this.$emit("Update","spec",newVal)
      },
      deep: true
    },
  },
  components:{
    Expand:()=>import("./card-expand.vue"),
  }


}
</script>
