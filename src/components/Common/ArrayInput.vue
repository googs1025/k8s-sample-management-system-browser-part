<template>
  <el-input :style="'width:'+input_width" v-model="text"
            :placeholder="'多个值请用'+strsplit+'分隔'" />
</template>
<script>
export default {
  props:['data',"input_width","split"],
  data(){
    return {
      text:'',
      strsplit:","  //默认分隔符
    }
  },
  created() {
    if(this.split!==undefined)
      this.strsplit=this.split
    if(this.data!==undefined && this.data!=null){{
      //如果数组里 某一项有空格 ，两头需要加单引号 或双引号
      this.data.forEach((item,itemindex)=>{
        if(/\s+/.test(item)){
          this.data[itemindex]="'"+item+"'"
        }
      })
      this.text=this.data.join(this.strsplit)
    }
    }
  },
  methods:{
    parseData(){
      //类似 echo -c 'echo The app is running! && sleep 3600'
      //单引号和双引号 里面的内容 不做 split
      var str=this.text
      str=str.replace(/^\s+|\s+$/gm,'')  //实现trim
      var pattern =/'(.*?)'|"(.*?)"/gi;
      var mList=str.match(pattern)
      if(!mList || mList.length===0){
        str=str.replace(/\s+/g,' ')
        return str.split(' ')
      }
      for(var i=0;i<mList.length;i++){
        str=str.replace(mList[i],'_#_'+i) // _#_1  _#_2  _#_3
      }
      str=str.replace(/\s+/g,' ')  //多个空格要变成一个 空格
      var ret=str.split(" ") //数组
      var p=/^_#_(\d+)$/
      ret.forEach((item,index)=>{
        if(p.test(item)){
          //要替换掉开头和结尾的 单引号或双引号
          ret[index]=mList[RegExp.$1].replace(/^[\"|']|[\"|']$/gm,'')
        }else{
          ret[index]=ret[index].replace(/^[\"|']|[\"|']$/gm,'')
        }
      })
      return ret
    }
  },
  watch:{
    text:{
      handler(newVal,oldVal){
        this.$emit("update:data",this.parseData())
      },

    }
  }
}
</script>
