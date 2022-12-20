<template>

  <div style="min-height: 500px;padding: 10px">

    <div id="terminal" ref="terminal"></div>
  </div>

</template>
<script>
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
export default {
  data(){
    return {
      rows: 40,
      cols: 100,
      term:null,//终端对象
      ws:null, //ws 客户端
      wsInited:false , //是否初始化完毕

    }
  },
  mounted() {
    this.initShell()
  },
  methods:{
    initShell() {
      this.initWS()// 初始化 websocket
      this.initTerm() //初始化term
    },
    //初始化 websocket 客户端
    initWS(){
      var ws = new WebSocket("ws://localhost:8080/nodews")
      ws.onopen = function(){
        console.log("open");
      }
      ws.onmessage = (e)=>{
        this.wsInited=true //初始化完毕了
        this.term.write(e.data)
      }
      ws.onclose = function(e){
        console.log("close");
      }
      ws.onerror = function(e){
        console.log(e);
      }
      this.ws=ws
    },
    //初始化shell组件
    initTerm(){
      let term = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: parseInt(this.rows), //行数
        cols: parseInt(this.cols), // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        disableStdin: false, //是否应禁用输入。
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
          foreground: "#7e9192", //字体
          background: "#002833", //背景色
          cursor: "help", //设置光标
          lineHeight: 16
        }
      });
      // 创建terminal实例
      term.open(this.$refs["terminal"]);
      term.prompt = () => {
        term.writeln("\n\n 节点远程可视化介面 ");
        term.writeln("\n 正在初始化终端");
      };
      term.prompt();
      term.onData((key)=> {
        if(this.wsInited){
          this.ws.send(key)
        }
      });
      this.term=term
    }
  }
}
</script>
