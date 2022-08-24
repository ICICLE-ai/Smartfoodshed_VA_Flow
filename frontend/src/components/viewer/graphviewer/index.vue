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
      <GraphViewInner :itemProps="itemProps" ref="inner" :fixed="FIXED"/>
    </template>
  </Ctemplate>
</template>

<script>
import GraphViewInner from './Inner.vue'
export default {
  props: ['itemProps'], 
  components: {
    GraphViewInner, 
  }, 
  data() {
    return {
      contextCommands: [], 
      styleProps: {width: '500px', height: '300px'},
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
  }
}
</script>

<style scoped>
.card-name {
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