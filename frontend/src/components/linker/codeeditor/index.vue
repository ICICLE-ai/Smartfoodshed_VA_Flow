<template>
  <Ctemplate 
    :itemProps="itemProps" 
    @contextmenu="contextButtonClickedHandler" 
    :contextCommands="contextCommands"
    :styleProps="styleProps"
    @dblclick="dblclickHandler"
    :fixed="FIXED"
    
  >
    <template v-slot:fullView>
      <CodeEditor :itemProps="itemProps" ref="inner" :innerStyle="innerStyle" :fixed="FIXED"/>
    </template>
  </Ctemplate>
</template>

<script>
import CodeEditor from './Inner.vue'
export default {
  props: ['itemProps'], 
  components: {
    CodeEditor, 
  }, 
  data() {
    return {
      contextCommands: [], 
      styleProps: {width: '400px', height: '300px'},
      FIXED: false 
    }
  }, 
  methods: {
    contextButtonClickedHandler(button) {
      alert(button)
    }, 
    dblclickHandler() {
      this.toggleFixCompPos();
    }, 

    toggleFixCompPos() {
      this.FIXED = !this.FIXED;
      if (!this.dataStatus) {
        return;
      }
      if (this.FIXED) {
        componentDisableDragHandler(
          `.globalview-canvas-${this.itemProps.id}`,
          this.toolStatus
        );
      } else {
        componentEnableDragHandler(
          `.globalview-canvas-${this.itemProps.id}`,
          this.toolStatus
        );
      }
    },
  },
  computed:{
    innerStyle(){
      return {
        'height': parseInt(this.styleProps['height'].replace('px','')),
        'width': parseInt(this.styleProps['width'].replace('px',''))
      }
    }
  }
}
</script>

<style scoped>
.card-ontparser {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
}
.sheetname{
  margin-top: 10px;
  height: 20px;
}
</style>