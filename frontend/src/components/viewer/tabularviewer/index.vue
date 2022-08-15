<template>
  <Ctemplate 
    :itemProps="itemProps" 
    @contextmenu="contextButtonClickedHandler" 
    :contextCommands="contextCommands"
    :styleProps="styleProps"
  >
    <template v-slot:fullView>
      <Inner :itemProps="itemProps" ref="inner"/>
    </template>
  </Ctemplate>
</template>

<script>
import Inner from './Inner.vue'
export default {
  props: ['itemProps'], 
  components: {
    Inner, 
  }, 
  data() {
    return {
      contextCommands: [], 
      styleProps: {width: '500px', height: '300px'} 
    }
  }, 
  methods: {
    contextButtonClickedHandler(button) {
      alert(button)
    }
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