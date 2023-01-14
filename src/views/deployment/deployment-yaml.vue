<template>
  <div class="yaml-editor">
    <textarea ref="yamltext"></textarea>
  </div>
</template>
<script>

import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/yaml-lint'
window.jsyaml = require('js-yaml')
export default {
  props:['deployment'],
  data(){
    return {
      yaml_text: '' ,// 传过来的yaml内容
      yamlEditor: null //编辑器对象
    }
  },
  mounted(){

    this.initYaml()
    this.yaml_text=window.jsyaml.dump(this.$props.deployment)
    this.yamlEditor.setValue(this.yaml_text)
  },

  watch: {
    deployment:{
      handler(newValue,oldValue){
        this.yaml_text=window.jsyaml.dump(this.$props.deployment)
        this.yamlEditor.setValue(this.yaml_text)
      },
      deep:true //为true，表示深度监听
    }
  },
  methods:{
    initYaml(){
      //初始化 yaml 编辑器
      this.yamlEditor = CodeMirror.fromTextArea(this.$refs.yamltext, {
        lineNumbers: true, // 显示行号
        mode: 'text/x-yaml', // 语法model
        gutters: ['CodeMirror-lint-markers'],  // 语法检查器
        theme: 'monokai', // 编辑器主题
        lint: true // 开启语法检查
      })




      //对编辑器设置值

    }

  },


}

</script>
<style>
.yaml-editor{
  height: 80%!important;
  position: relative;
}
.yaml-editor  .CodeMirror {
  height: auto;
  min-height: 300px;
}
.yaml-editor  .CodeMirror-scroll{
  min-height: 300px;
}
.yaml-editor .cm-s-rubyblue span.cm-string {
  color: #F08047;
}

</style>
