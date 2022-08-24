<template>
  <Ctemplate 
    :itemProps="itemProps" 
    @contextmenu="contextButtonClickedHandler" 
    @dblclick="dblClickHandler"
    :styleProps="styleProps"
    disable-resizer
  > 
    <template v-slot:fullView>
      <GraphLoaderInner 
        ref="inner"
        :itemProps="itemProps"
      />
    </template>
  </Ctemplate>
</template>

<script>
import GraphLoaderInner from './Inner.vue'
export default {
  props: ['itemProps'], 
  data() {
    return {
      styleProps: {width: '50px', height: '50px', 'border-radius': '50%'}
    }
  }, 
  components: {
    GraphLoaderInner 
  },
  methods: {
    dblClickHandler() {
      this.$refs.inner.triggerDialog() 
    }, 
    contextButtonClickedHandler(button) {
      alert(button)
    }
  }
}
</script>

<style>

</style>