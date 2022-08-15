<template>
  <path
    :class="link.class"
    :d="link.d"
    :stroke="link.stroke || 'black'"
    :stroke-width="linkWidth || '1px'"
    :fill="link.fill || 'none'"
    @mouseover="mouseover"
    @mouseout="mouseout"
    @contextmenu="rightClickMenuShow"
  />
</template>

<script>
export default {
  props: ['link'],
  data(){
    return {
      linkWidth: 0
    }
  }, 
  methods: {
    mouseover(){
      this.linkWidth = '3px'
    }, 
    mouseout(){
      this.linkWidth = '1px'
    },
    rightClickMenuShow(e){
      e.preventDefault()
      console.log(123)
      this.$emit('rightClick', e.clientX, e.clientY, this.link)
    }
  },
  created(){
    this.linkWidth = this.link.link_width || '1px'
  }
}
</script>

<style>

</style>