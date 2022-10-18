<template>
  <div class="card-inner">
    <!-- <vega-lite :data="values" mark="bar" :encoding="encoding"/> -->
    <!-- {{itemProps.inputData}} -->
    <div v-for="(item, index) in itemProps.data" :key="index">
      <vega-lite :data="item.data.values" :mark="item.mark" :encoding="item.encoding"/>
    </div>
  </div>
</template>

<script>
import VueVega from 'vue-vega'
import Vue from 'vue'

Vue.use(VueVega)
export default {
  props: ['itemProps'], 
  data() {
    return {
    }
  }, 
  methods: {

  
  },
  watch: {
   
   
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

.card-inner{
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
  overflow:scroll;
}
</style>