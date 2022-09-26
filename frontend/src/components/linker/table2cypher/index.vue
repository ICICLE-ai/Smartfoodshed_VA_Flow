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
      styleProps: {width: '70px', height: '70px', 'border-radius': '50%'}
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
    }, 
    func(value) {
      value.forEach(c => console.log(c.id)) 
    }
  },
  created() {
    
  }
}
</script>

<style>

</style>