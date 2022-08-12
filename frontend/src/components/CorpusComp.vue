<template>
  <div>
    <v-hover
      v-slot="{hover}"
    >
      <v-card
        :elevation="hover ? 12 : 5"
        class="card-documents"
        :draggable="draggable"
        @dragstart="dragStart"
        outlined
        :id="itemProps.id"
        ref="cardComp"
        @dblclick.stop="cardDoubleClick"
        @contextmenu = "rightClickMenuShow"
        :style="{top: marginTop + 'px', left: marginLeft +'px', width: `${width}px`, height: `${height}px`, position: 'absolute'}"
        :loading="itemProps.loadingStatus"
      >
        <v-card-text v-if="!data" class="card-name">
          <v-icon>
            mdi-database  
          </v-icon>
          {{selectedCorpusName}}
        </v-card-text>
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

      <v-dialog
        v-model="dialog"
        max-width="800"
      >
        <CorpusLoader
          @loaderAction="loaderAction"
        />
      </v-dialog>
  
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
        store="corpus"
      /> 
    </v-menu>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import RightClickMenu from '@/components/RightClickMenu'
import InoutputBtns from '@/components/InoutputBtns'
import CorpusLoader from '@/components/CorpusLoader'
export default {
  props: [
    'itemProps'
  ],
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

      dialog: false,

  

    }
  },
  methods:{
    cardDoubleClick(){
      this.dialog = true;
    },
    dragStart(e){
      // if(!this.initialX){
      //   this.initialX = e.clientX; 
      //   this.initialY = e.clientY;
      // }
      // e.dataTransfer.setData('item-id', e.target.id);
      // e.dataTransfer.setData('initialX', this.initialX);
      // e.dataTransfer.setData('initialY', this.initialY);
      const el = document.querySelector(`#${e.target.id}`); 
      const initialLeft = parseInt(el.style.left.split('px')[0]) - e.clientX;
      const initialTop = parseInt(el.style.top.split('px')[0]) - e.clientY;
      e.dataTransfer.setData('item-id', e.target.id);
      e.dataTransfer.setData('initialLeft', initialLeft);
      e.dataTransfer.setData('initialTop', initialTop);
      this.$store.dispatch('changeCurrentDraggingVM', this);
    }, 

    addLink(){
      this.$store.dispatch('changeLinkDrawingStatus', true);
    },

    finishLink(){
      this.$store.dispatch('changeLinkDrawingStatus', false);
    },

    mouseDownHandler(e){
      
      // this.$store.dispatch('changeResizerStatus', true);
      this.resizeX = e.clientX; 
      this.resizeY = e.clientY;
      document.addEventListener('mousemove', this.mouseMoveHandler); 
      document.addEventListener('mouseup', this.mouseUpHandler); 
      this.resizingStatus = true;
    }, 

    mouseMoveHandler(e){
      const dx = e.clientX - this.resizeX; 
      const dy = e.clientY - this.resizeY; 
      this.width = this.resizeWidth + dx;
      this.height = this.resizeHeight + dy;
      
    }, 

    mouseUpHandler(e){
      this.resizeWidth = this.width; 
      this.resizeHeight = this.height; 
      document.removeEventListener('mousemove', this.mouseMoveHandler); 
      document.removeEventListener('mouseup', this.mouseUpHandler)
      // this.$store.dispatch('changeResizerStatus', false)
      this.resizingStatus = false;
    },

    rightClickMenuShow(e){
      e.preventDefault();
      this.showRightClickMenu = true;
      this.rightMenuX = e.clientX;
      this.rightMenuY = e.clientY;
    },

    loaderAction(e){
      if(e.status == "success"){
        delete e.status
        e.selected.cardId = this.itemProps.id
        this.$store.dispatch('corpus/addCorpus', e.selected)
      }
      this.dialog = false;
    }

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

    selectedCorpusName(){
      if(this.itemProps.selectedTable){
        return this.itemProps.selectedTable.table
      }else{
        return 'No Corpus'
      }
    }
  },

  components: {
    RightClickMenu,
    InoutputBtns,
    CorpusLoader
  }
}
</script>

<style scoped> 
  .card-name{
    text-align: center;
    display: flex; 
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
  }

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