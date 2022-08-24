<template>
  <Ctemplate 
    :itemProps="itemProps" 
    @contextmenu="contextButtonClickedHandler" 
    @dblclick="dblClickHandler"
    :contextCommands="contextCommands"
    :styleProps="styleProps"
    disable-resizer
  >
    <template v-slot:fullView>
      <TabularLoaderInner :itemProps="itemProps" ref="inner"/>
    </template>
  </Ctemplate> 
</template>  

<script>
import TabularLoaderInner from './Inner.vue'
export default {
  components: {
    TabularLoaderInner 
  }, 
  props: ['itemProps'], 
  data() {
    return {
      contextCommands: [
        
      ],
      styleProps: {width: '50px', height: '50px', 'border-radius': '50%'}
    }
  }, 
  methods: {
    contextButtonClickedHandler(button) {
      alert(button)
    }, 
    dblClickHandler() {
      this.$refs.inner.triggerDialog() 
    }
  }
}
</script>