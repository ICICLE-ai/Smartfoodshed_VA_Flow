<template>
    <Ctemplate 
      :itemProps="itemProps" 
      @contextmenu="contextButtonClickedHandler" 
      :contextCommands="contextCommands"
      :styleProps="styleProps"
      @dblclick="dblclickHandler"
      :fixed="FIXED"
    >
      <!-- <template v-slot:fullView>
        
      </template> -->
      <template #minimizeView>
        <span>Ontology Parser</span>
        <OntParser :itemProps="itemProps" ref="inner" :innerStyle="innerStyle" :fixed="FIXED"/>
      </template>
      <template #fullView>
        <OntParser :itemProps="itemProps" ref="inner" :innerStyle="innerStyle" :fixed="FIXED"/>
      </template>
    </Ctemplate>
  </template>
  
  <script>
  import OntParser from './Inner.vue'
  export default {
    props: ['itemProps'], 
    components: {
        OntParser, 
    }, 
    data() {
      return {
        contextCommands: [], 
        styleFull: {width: '1000', height: '800'},
        styleMinimize: {width: '200', height: '100'},
        minimizeStatus: false, 
        FIXED: false 
      }
    }, 
    methods: {
      contextButtonClickedHandler(button) {
        // alert(button)
        if (button === 'Minimize/Maximize') {
          this.minimizeStatus = !this.minimizeStatus 
        }
        
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
      }, 
      styleProps() {
        if (this.minimizeStatus) {
          return this.styleMinimize
        }else {
          return this.styleFull
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