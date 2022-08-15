<template>
  <Ctemplate 
    :itemProps="itemProps" 
    @contextmenu="contextButtonClickedHandler" 
    :contextCommands="contextCommands"
    :styleProps="styleProps"
    disable-resizer
  >
    <template v-slot:fullView>
      <Inner :itemProps="itemProps" ref="inner"/>
    </template>
  </Ctemplate>
</template>

<script>
// import Ctemplate from '@/components/template'
import Inner from './Inner.vue'
export default {
  props: ['itemProps'], 
  components: {
    // Ctemplate, 
    Inner, 
  }, 
  data() {
    return {
      styleProps: {} 
    }
  }, 
  methods: {

  }
}
</script>

<style scoped>

</style>