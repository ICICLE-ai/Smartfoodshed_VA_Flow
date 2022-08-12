<template>
    <Page/>
</template>

<script>
import Page from '@/views/Page'
export default {
  name: 'App',

  components: {
    Page
  },

  data: () => ({
    //
  }),
};
</script>

<style>
  .slide-fade-enter{
    transform: translateX(100px);
    opacity: 0
  } 

  .slide-fade-enter-active, .slie-fade-leave-active{
    transition: all 0.3s ease; 
  }

  .slide-fade-leave-to{
    transform: translateX(-100px); 
    opacity: 0;
  }

  .v-data-footer{
    height: 50px;
  }

  .v-card__title{
    height: 70px;
  }


  .d3-tip {
    line-height: 3;
    font-weight: 400;
    font-family:"avenir next", Arial, sans-serif;
    padding: 6px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 1px;
    pointer-events: none;
    }

    /* Creates a small triangle extender for the tooltip */
  .d3-tip:after {      
    box-sizing: border-box;
    display: inline;
    font-size: 8px;
    width: 100%;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.6);
    position: absolute;
    pointer-events: none;
    
  }

  /* Northward tooltips */
  .d3-tip.n:after {
    content: "\25BC";
    margin: -1px 0 0 0;
    top: 100%;
    left: 0;
    text-align: center;
  }

  /* Eastward tooltips */
  .d3-tip.e:after {
    content: "\25C0";
    margin: -4px 0 0 0;
    top: 50%;
    left: -8px;
  }

  /* Southward tooltips */
  .d3-tip.s:after {
    content: "\25B2";
    margin: 0 0 1px 0;
    top: -8px;
    left: 0;
    text-align: center;
  }

  /* Westward tooltips */
  .d3-tip.w:after {
    content: "\25B6";
    margin: -4px 0 0 -1px;
    top: 50%;
    left: 100%;
  }
</style>