<template>
  <div>
  <v-hover
    v-slot="{ hover }"
  >
    <v-card
      :elevation="hover? 12 : 5"
      class="card-gloablview"
      :draggable="draggable"
      @dragstart="dragStart"
      outlined
      :id="itemProps.id"
      ref="cardComp"
      @contextmenu = "rightClickMenuShow"
      :style="{top: marginTop + 'px', left: marginLeft +'px', width: `${width}px`, height: `${height}px`, position: 'absolute'}"
    > 
      <v-card
        loading
        v-if="loadingStatus"
        :width="width"
        :height="height"
      ></v-card>
      <v-card-text 
        v-if="!dataStatus" 
        class="card-name"
      >
        No Global View Yet
      </v-card-text>
      <div 
        class="canvas-container"
        v-if="dataStatus" 
      >
        <svg
          :class="`globalview-canvas-${itemProps.id}`" 
         
          :viewBox="[0, 0, width, height]"
        >

        </svg>
      </div>
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
      store="globalview"
    /> 
  </v-menu>

  </div>
</template>

<script>
import {mapState} from 'vuex'
import RightClickMenu from "@/components/common/rightclick/RightClickMenu";
import InoutputBtns from "@/components/common/buttons/InoutputBtns";
import * as d3 from 'd3'
import * as d3tip from '@/utils/d3-tip'

export default {
  props: [
    'itemProps'
  ],
  data(){
    return {
      initialX: undefined,
      initialY: undefined,
      dataStatus: undefined,
      resizeX: undefined,
      resizeY: undefined,
      // draggable: true,
      width: 500,
      height: 500, 
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

      items: [
        { title: 'Remove node' },
      ],

      container: '.globalview-components-list',

      rightBtn: true,

      topBtn: false,

      leftBtn: false,

      loadingStatus: false,

      onOperation: false, 

      // colors: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"], 
      colors: ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928']
    }
  },
  methods:{
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
      console.log(111);
      this.$store.dispatch('changeLinkDrawingStatus', true);
    },

    finishLink(){
      console.log(222);
      this.$store.dispatch('changeLinkDrawingStatus', false);
    },

    // Handler for div resizing
    mouseDownHandler(e){
      
      // this.$store.dispatch('changeResizerStatus', true);
      this.resizeX = e.clientX; 
      this.resizeY = e.clientY;
      console.log(this.resizeX, this.resizeY)
      document.addEventListener('mousemove', this.mouseMoveHandler); 
      document.addEventListener('mouseup', this.mouseUpHandler); 
      this.resizingStatus = true
      
    }, 

    // Handler for moving mouse to resize 
    mouseMoveHandler(e){
      const dx = e.clientX - this.resizeX; 
      const dy = e.clientY - this.resizeY; 
      this.width = this.resizeWidth + dx;
      this.height = this.resizeHeight + dy;
      
    }, 

    // Handler for mouse up and remove the EventListener
    mouseUpHandler(e){
      this.resizeWidth = this.width; 
      this.resizeHeight = this.height; 
      document.removeEventListener('mousemove', this.mouseMoveHandler); 
      document.removeEventListener('mouseup', this.mouseUpHandler)
      this.resizingStatus = false
      // this.$store.dispatch('changeResizerStatus', false)
    },

    rightClickMenuShow(e){
      e.preventDefault();
      this.showRightClickMenu = true;
      this.rightMenuX = e.clientX;
      this.rightMenuY = e.clientY;
    }, 

    draw(){
      if(!this.itemProps.vis_tsne){
        alert('No vis data but still triggered! check GLobalViewComp.vue')
      }

      
      let tip = d3tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Title: </strong><span class='details'>" + d.title + "<br></span>";
            })

      let visData = this.itemProps.vis_tsne.tsne.data; 
      let visArea = this.itemProps.vis_tsne.tsne.area;
      
      console.log('print vis data');
      console.log(visData);

      console.log('print vis area');
      console.log(visArea);
      const canvasContainer = d3.select(`.globalview-canvas-${this.itemProps.id}`);
      const canvasGroup = canvasContainer.selectAll('g').data([0]);
      const canvasEnter = canvasGroup.enter().append('g')

      const canvas = canvasGroup.merge(canvasEnter);

      const classColors = this.colors;
      const areaLine = d3.line()
        .x(d => d[0])
        .y(d => d[1])
        .curve(d3.curveCatmullRomClosed);
      console.log(classColors);


      const width = this.width
      const height = this.height
      const xScale = d3.scaleLinear()
                      .domain(d3.extent(visData, d=>d.embedding[0]))
                      .range([0, width])
      
      const yScale = d3.scaleLinear()
                      .domain(d3.extent(visData, d=>d.embedding[1]))
                      .range([0, height])


      // for(let i in Object.keys(visArea)){
      //   if(i==1 || i == 17){
      //     let queryId = visArea[i];
          
      //     canvas.append("path")
      //     .attr("fill", classColors[i % classColors.length])
      //     .attr("stroke", "steelblue")
      //     .attr("stroke-width", 3)
      //     .attr("opacity", 0.2)
      //     .attr("d", areaLine(hull(visArea[`q_${i}`].map(d=>[xScale(d[0]), xScale(d[1])]))));
      //   }
        
      // }


      const h = canvas.append("path").attr("class", "polyhull-01").style("stroke", "gray").style("stroke-width","3px").style("fill-opacity", "0.3").style("fill", "lightblue");
      const circleGroup = canvas.selectAll('circle').data(visData); //
      const circleGroupEnter = circleGroup.enter().append('circle')
     
      circleGroupEnter.merge(circleGroup)
        .attr('cx', d=>xScale(d.embedding[0]))
        .attr('cy', d=>yScale(d.embedding[1]))
        .attr('r', d=>{
          return 1
        })
        .attr('fill', d=>{
          // if(d['q_1']){
          //   return classColors[5]
          // }
          // if(d['q_17']){
          //   return classColors[6]
          // }
          return 'steelblue'
        })
        .on('mouseover', function(d){
          tip.show(d);
          d3.select(this)
            .attr('r', 1.5)
            .style('stroke', 'black')
            
        })
        .on('mouseout', function(d){
          tip.hide(d);
          d3.select(this)
            .attr('r', 1)
            .style('stroke', null)
            
        })

      
      

      function zoomed() {
        console.log(111);
        const {transform} = d3.event;
        canvas.attr("transform", transform);
      }


      canvasContainer.on('dblclick', ()=>{
        console.log(111)
        canvasContainer.call(d3.zoom()
          .extent([[0, 0], [width, height]])
          .scaleExtent([1, 8])
          .on("zoom", zoomed));

        canvasContainer.style('border', '1px solid red')
      })

      canvasContainer.on('mouseleave', ()=>{
        console.log('mouseout');
        console.log(canvasContainer)
        canvasContainer.on('.zoom', null);
        canvasContainer.style('border', null)
      })
      // canvasContainer.call(d3.zoom()
      //   .extent([[0, 0], [width, height]])
      //   .scaleExtent([1, 8])
      //   .on("zoom", zoomed));

      canvasContainer.call(tip);

      const pointsTemp = visData.slice(1000, 1010); 
      // console.log("Check Here!");
      // console.log(pointsTemp);
      const hullCurve = hull(pointsTemp.map(obj => [xScale(obj.embedding[0]), yScale(obj.embedding[1])])); 
      h.attr("d", `M${hullCurve.join("L")}Z`)

      function hull(points) {
        // No sense in rendering a hull for fewer than two points
        if (points.length < 2) return;

        // polygonHull seems to require a minimum of three points, but works
        // just fine if two of the points are identical, so we can patch over
        // the problem of a two point cluster by duplicating the first point.
        if (points.length < 3) return d3.polygonHull([points[0], ...points]);

        return d3.polygonHull(points);
      }

    },


    

  },

  created(){
    // Initialize initial position
    this.marginTop = this.topMargin - this.height/2; 
    this.marginLeft = this.leftMargin - this.width/2;

    // Initialize resizeWidth and resizeHeight
    this.resizeWidth = this.width;
    this.resizeHeight = this.height; 
  },

  computed:{
    ...mapState(['drawLink','resizer']),
    draggable(){
      return !(this.drawLink || this.resizingStatus);
    }
  },

  components: {
    RightClickMenu,
    InoutputBtns
  },

  watch: {
    'itemProps.inputData': function(newVal, oldVal){
      if(newVal){
        this.loadingStatus = true
        this.dataStatus = true // means loading
        console.log('globalView component triggered newVal')
        console.log(newVal);
      }else{
        this.loadingStatus = false
        this.dataStatus = false
      }
    }, 

    'itemProps.vis_tsne': function(newVal, oldVal){
      console.log('visData newVal, oldVal'); //
      console.log(newVal); //
      console.log(oldVal);
      if(newVal && newVal.tsne){
        this.loadingStatus = false
        this.dataStatus = true // no longer loading
        console.log('here')
        console.log(this.dataStatus);
        this.draw();
      }else{
        this.loadingStatus = false
        this.dataStatus = false;
      }
    },

    width: function (){
      if(this.itemProps.vis_tsne){
        this.draw()
      }
      
    }, 

    height: function(){
      if(this.itemProps.vis_tsne){
        this.draw()
      }
    }
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
</style>