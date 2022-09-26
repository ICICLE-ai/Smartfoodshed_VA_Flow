<template>
    <div>
      <v-hover
        v-slot="{hover}"
      >
        <v-card
          outlined
          :elevation="hover ? 12 : 5"
          class="card-documents"
          :draggable="false"
          @mousedown="dragStartHandler"
          @dragstart="false"
          :id="itemProps.id"
          @dblclick.stop="cardDoubleClick"
          @contextmenu = "rightClickMenuShow"
          :style="{top: marginTop + 'px', left: marginLeft +'px', width: `${width}px`, height: `${height}px`, position: 'absolute'}"
          :loading="itemProps.loadingStatus"
        >
          <slot name="view"></slot>
  
          <v-card-actions>
            <InoutputBtns
              :resizingStatus="resizingStatus"
              :width="width"
              :height="height"
              :marginLeft="marginLeft"
              :marginTop="marginTop"  
              :componentId="itemProps.id"       
              :hover="hover"
            />
          </v-card-actions>
  
          <div 
            class="resizer resizer-r"
            @mousedown="mouseDownHandler"
          ></div>
          <div 
            class="resizer resizer-b"
            @mousedown="mouseDownHandler"
          ></div>
        </v-card>
      </v-hover>
  
      <v-menu
        v-model="showRightClickMenu"
        :position-x="rightMenuX"
        :position-y="rightMenuY"
        absolute
        offset-y
      >
        <RightClickMenu 
          :vue="this" 
          :container="container" 
          :itemProps="itemProps"
          store="loadertext"
        /> 
      </v-menu>
    </div>
  </template>
  
  <script>
  import {mapState} from 'vuex'
  import RightClickMenu from '@/components/Common/RightClick/RightClickMenu'
  import InoutputBtns from '@/components/Common/Menu/Buttons/InoutputBtns'
  import {cardOperationMixin} from '@/mixins/cardOperationMixin.js'
  export default {
    props: [
      'itemProps'
    ],
    mixins:[cardOperationMixin],
    data(){
      return {
        initialX: undefined,
        initialY: undefined,
        data: undefined,
        resizeX: undefined,
        resizeY: undefined,
        // draggable: true,
        width: 200,
        height: 50, 
        resizeWidth: 0, //
        resizeHeight: 0,
        marginTop: 0,
        marginLeft: 0,
        topMargin: window.innerHeight / 2,
        leftMargin: window.innerWidth / 2,
        resizingStatus: false,
  
        showRightClickMenu: false,
        rightMenuX: 0,
        rightMenuY: 0,
  
        // for right click menu
        items: [
          { title: 'Remove node' },
        ], 
  
        container: '.corpus-components-list',
        rightBtn: true,
        topBtn: false,
        leftBtn: false, 
        // dialog: false,
      }
    },
    methods:{
      cardDoubleClick(){
        // this.dialog = true;
        // console.log('test')
        // this.$router.push({ name: 'Component'})
      },
      // toggleDialog() {
      //   this.dialog = !this.dialog
      // },
      // closeDialog() {
      //   this.dialog = false
      // } 
  
  
    },
    created(){
      // Initialize initial position
      this.marginTop = this.topMargin - this.height/2; 
      this.marginLeft = this.leftMargin - this.width/2;
      this.resizeWidth = this.width;
      this.resizeHeight = this.height; 
    },
  
    computed:{
      ...mapState(['drawLink']),
  
      // Determine Whether the component is draggable
      // Not allowed when resizing and drawling link
      draggable(){
        return !(this.drawLink || this.resizingStatus);
      }, 
  
    },
  
    components: {
      RightClickMenu,
      InoutputBtns,
    }
  }
  </script>
  
  <style scoped> 
    /* .card-actions{
      position: absolute;
      transform: translate(300px, -150px);
      padding: 0;
    } */
  
    .resizer{
      position: absolute;
    }
  
    .resizer-r {
      cursor: col-resize;
      height: 100%;
      right: 0;
      top: 0;
      width: 5px;
    }
  
    /* Placed at the bottom side */
    .resizer-b {
      bottom: 0;
      cursor: row-resize;
      height: 5px;
      left: 0;
      width: 100%;
    }
  
    .card-documents:hover{
      cursor: pointer;
    }
  </style>
  