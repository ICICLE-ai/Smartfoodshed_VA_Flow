<template>
  <div 
    class="dashboard-container"
    @dragover="dragOver"
    @drop="dropHandler"
    @mousemove="mouseMove"
    @mouseup="mouseUp"
  > 
    <div class="background-canvas">
        <svg
          class="svg-canvas"
          v-show="!vismode"
        >
          <LinkComp 
            v-for="path in link.links"
            :link="path"
            :key="path.id"
            @rightClick="rightClick"
          />
        </svg>
        <v-menu
          v-model="showRightClickMenu"
          :position-x="rightMenuX"
          :position-y="rightMenuY"
          absolute
          offset-y
        >
          <RightClickMenu 
            :vue="this" 
            :container="123" 
            :itemProps="linkItem"
            store="link"
          /> 
        </v-menu>
    </div>

    <MenuBar v-show="!vismode"/>
    <!-- <DocumentsComp/>
    <GlobalViewComp/> -->
    <ul class="topic-components-list">
      <li
        :is="topics.component"
        v-for="item in topics.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item"
      >
      </li>
    </ul>

    <ul class="graph-components-list">
      <li
        :is="graph.component"
        v-for="item in graph.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item"
      >
      </li>
    </ul>

    <ul class="documents-components-list">
      <li
        :is="documents.component"
        v-for="item in documents.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item"
      >
      </li>
    </ul>

    <ul class="globalview-components-list">
      <li
        :is="globalview.component"
        v-for="item in globalview.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item"
      >
      </li>
    </ul>

    <ul class="corpus-components-list">
      <li
        :is="corpus.component"
        v-for="item in corpus.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item"
      >
      </li>
    </ul>
    
    <ul class="table2cypher-components-list">
      <li
        :is="table2cypher.component"
        v-for="item in table2cypher.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item"
      >
      </li>
    </ul>

    <ul class="graphviewer-components-list">
      <li
        :is="graphviewer.component"
        v-for="item in graphviewer.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item"
      >
      </li>
    </ul>
     <ul class="vegaRender-components-list">
      <li
        :is="vegaRender.component"
        v-for="item in vegaRender.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item"
      >
      </li>
    </ul>
    <ul class="ontparser-components-list">
      <li
        :is="ontparser.component"
        v-for="item in ontparser.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item">
      </li>
    </ul>
    <ul class="kgquerier-components-list">
      <li
        :is="kgquerier.component"
        v-for="item in kgquerier.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item">
      </li>
    </ul>
    <ul class="codeeditor-components-list">
      <li
        :is="codeeditor.component"
        v-for="item in codeeditor.cards"
        v-show="!vismode || (vismode && item.keep_in_vis_mode)"
        :key="item.id"
        :itemProps="item">
      </li>
    </ul>
  </div>
</template>

<script>
import MenuBar from '@/components/common/menu/MenuBar'
import DocumentsComp from '@/components/viewer/tabularviewer'
import GraphViewer from '@/components/viewer/graphviewer'
import GlobalViewComp from '@/components/GlobalViewComp'
import LinkComp from '@/components/common/link/LinkComp'
import OntologyComp from "@/components/OntologyComp"
import RightClickMenu from '@/components/common/rightclick/RightClickMenu'
import VegaRender from '@/components/viewer/VegaRender'
// import KGQuerier from '@/componnets/analyzer/KGQuerier'

import {mapState} from 'vuex'
export default {
  data(){
    return {
      showRightClickMenu: false,
      rightMenuX: 0,
      rightMenuY: 0,

      items: [
        { title: 'Remove node' },
      ], 

      container: '.documents-components-list',

      linkItem: undefined
    }
  },
  methods: {
    dragOver(e){
      e.preventDefault();
      return false;
      // console.log(e)
    },
    dropHandler(e){
      const currentX = e.clientX;
      const currentY = e.clientY; 
      if(!e.dataTransfer.getData('item-id')){
        return false; 
      }
      const initialLeft = e.dataTransfer.getData('initialLeft');
      const initialTop = e.dataTransfer.getData('initialTop');
      const id = e.dataTransfer.getData('item-id'); //
      const el = document.querySelector(`#${id}`);
      // this.updatePos(currentX-initialX, currentY-initialY, el);
      el.style.left = (currentX + parseInt(initialLeft)) + 'px';
      el.style.top = (currentY + parseInt(initialTop)) + 'px';
      if(this.currentDragging){
        this.currentDragging.marginLeft = el.style.left;
        this.currentDragging.marginTop = el.style.top;
      }
      e.preventDefault();
      return false;
    },
    updatePos(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }, 
    mouseMove(){
      if(this.drawLink === true){
        console.log('linking')
      }
    },
    mouseUp(){
      if(this.drawLink === true){
        console.log('Finish drawing'); 
        this.$store.dispatch('changeLinkDrawingStatus', false);
      }
    },
    rightClick(x, y, linkData){
      this.showRightClickMenu = true;
      this.rightMenuX = x; 
      this.rightMenuY = y;
      this.linkItem = linkData;
    }

  },

  computed:{
    ...mapState([
      'drawLink', 
      'currentDragging', 
      'topics', 
      'globalview', 
      'documents',
      'corpus',
      'link',
      'ontology',
      'graph',
      'vegaRender',
      'table2cypher',
      'graphviewer',
      'vismode',
      'ontparser',
      'kgquerier',
      'codeeditor'
      ]), 
  },
  
  created(){
    console.log('here!!!!!')
    console.log(this.topics);
    console.log('here!!!!!')
  },

  components: {
    MenuBar,
    DocumentsComp,
    // TopicComp,
    VegaRender,
    GraphViewer,
    GlobalViewComp,
    LinkComp,
    RightClickMenu, 
    OntologyComp, 
    // KGQuerier
  }, 
}
</script>

<style>
  .dashboard-container{
    height: 100%
  }
  .svg-canvas{
    position: absolute; 
    top: 0;
    left: 0;
    width: 100%; 
    height: 100%;
  }

  ul{
    list-style-type: none;
  }
</style>