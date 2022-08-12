<template>
  <div>
    <v-btn
      small
      icon
      outlined
      class="card-actions"
      :id="'right-btn-' + componentId"
      @mousedown="addLink"
      @mouseup="finishLink"
      v-show="!resizingStatus"
      :style="{
        position: 'absolute', 
        padding: 0, 
        margin: 0,
        left: `${width}px`, 
        top: `${height/2}px`,
        transform: `translate(0%, -50%)`,
      }"
      v-if="hover || rightBtn"
    >
      <v-icon 
        small
        pos="right-btn-icon"  
      >
        mdi-plus
      </v-icon>
    </v-btn>

    <v-btn
      small
      icon
      outlined
      class="card-actions"
      :id="'left-btn-' + componentId"
      @mousedown="addLink"
      @mouseup="finishLink"
      ref="addLinkBtn"  
      v-show="!resizingStatus"
      :style="{
        position: 'absolute', 
        padding: 0, 
        margin: 0,
        left: 0, 
        top: `${height/2}px`,
        transform: `translate(-120%, -50%)`
      }"
      v-if="hover || leftBtn"
    >
      <v-icon 
        large
        pos="left-btn-icon"  
      >
        mdi-menu-right
      </v-icon>
    </v-btn>
    
    <v-btn
      small
      icon
      outlined
      class="card-actions"
      :id="`top-btn-${componentId}`"
      @mousedown="addLink"
      @mouseup="finishLink"
      ref="addLinkBtn"  
      v-show="(hover || topBtn) && !resizingStatus"
      :style="{
        position: 'absolute', 
        padding: 0, 
        margin: 0,
        left: `${width/2}px`, 
        top: 0,
        transform: `translate(-50%,-120%)`
      }"
      
    >
      <v-icon 
        large
        pos="top-btn-icon"  
      >
        mdi-menu-down
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import * as d3 from 'd3'
import {mapState} from 'vuex'


export default {
  props: [
    'resizingStatus', 
    'width', 
    'height', 
    'marginLeft', 
    'marginTop',
    'hover',
    'componentId',
  ],
  data(){
    return {

      rightBtn: true,
      topBtn: false,
      leftBtn: false, 
      lineKeep: false,
      linePath: undefined, 
      xy0: undefined, 
      keep: false,
      rightLink: [], 
      topLink: [],
      leftLink: [],
      canvas: d3.select('.svg-canvas')
    }
  },
  methods: {
    addLink(e){
      this.$store.dispatch('changeLinkDrawingStatus', true);
      const vm = this;
      let xy0; 
      const canvas = d3.select('.svg-canvas');
      const markerBoxWidth = 20; 
      const markerBoxHeight = 15;
      const refX = markerBoxWidth / 2;
      const refY = markerBoxHeight / 2;      
      const arrowPoints = [[0, 0], [0, 15], [20, 7.5]];

      canvas.append('defs')
        .append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
        .attr('refX', refX)
        .attr('refY', refY)
        .attr('markerWidth', markerBoxWidth)
        .attr('markerHeight', markerBoxHeight)
        .attr('orient', 'auto-start-reverse')
        .attr('opacity', 0.6)
        .append('path')
        .attr('d', d3.line()(arrowPoints))
        .attr('stroke', 'black');
      
      this.keep = true; 

      xy0 = this.onclickPosRight();
      
      this.$store.dispatch('setCurrentLink', {
        id: this.componentId,
        pos: xy0, 
        in_out: 'source'
      })



      const line = d3.line()
                   .x(d=>d[0])
                   .y(d=>d[1])
      

      // const className = `${this.componentId}-outlink`;
      const className = 'drawing';
      let pathGroup = canvas.selectAll(`.${className}`).data([0])
      let pathGroupEnter = pathGroup.enter().append('path').attr('class', className)
      pathGroupEnter.merge(pathGroup)
        .attr('d', line([xy0, xy0]))
        .attr('marker-end', 'url(#arrow)')
        .attr('stroke', 'black')
        .attr('stroke-width', '1px')
        .attr('stroke-dasharray', (5,5))
      
    
      canvas.call(drawLine);

      function drawLine(canvas){     
        canvas
          .on('mousemove', function(){
            
            if(vm.keep){
              pathGroupEnter.merge(pathGroup)
                .attr('d', line([xy0, d3.mouse(this).map(x=>x-1)]))
            }
          })
          .on('mouseup', function(){
            vm.keep = false;
            pathGroupEnter.merge(pathGroup)
                .attr('d', null)
          })
      }

    },
  
    
    finishLink(e){
      if(!this.drawLink || !this.currentLink.source || this.currentLink.source.id === this.componentId){
        this.finishLinking();
        this.canvas
          .on('mousemove', null)
          .on('mouseup', null)
        return;
      }

      let xy1; 
      let xy0;
      const canvas = d3.select('.svg-canvas')

      xy0 = this.currentLink.source.pos;
      xy1 = this.onclickPos(e.target.getAttribute('pos'))

      
      this.$store.dispatch('setCurrentLink', {
        id: this.componentId, 
        pos: xy1, 
        in_out: 'target'
      })
      
      
      this.linkDrawing(canvas, {source: xy0, target: xy1}, this.currentLink.source.id+'_'+this.currentLink.target.id) 

      // remove the currentLinking and dispatch the status in store
      this.finishLinking();
     
    },

    finishLinking(){
      if(this.drawLink){
        // Draw Link First and then remove the drawing one
        this.canvas.selectAll('.drawing').attr('d', null); 
        this.canvas.on('mousemove', null);
        this.canvas.on('mouseup', null)
        this.keep = false;
        // Finish drawing Link
        this.$store.dispatch('changeLinkDrawingStatus', false);
      }
    },

    linkDrawing(container, data, classId){
      const line = d3.linkHorizontal()
                   .x(d=>d[0])
                   .y(d=>d[1])
      const linkGroup = container.selectAll(`.${classId}`).data([0]);
      const linkGroupEnter = linkGroup.enter().append('path').attr('class', classId)
      linkGroup.merge(linkGroupEnter)
        .attr('d', line(data))
        .attr('stroke', 'black')
        .attr('stroke-width', '1px')
        .attr('fill', 'none')
        .on('mouseover', function(){
          d3.select(this).attr('stroke-width', '3px')
        })
        .on('mouseout', function(){
          d3.select(this).attr('stroke-width', '1px')
        })
        
      
    }, 

    // Input the position of a button and get is central pos 
    onclickPos(pos){
      if(pos.includes('right')){
        this.rightBtn = true;
        return this.onclickPosRight()
      } else if(pos.includes('top')){
        this.topBtn = true
        return this.onclickPosTop()
      } else if(pos.includes('left')){
        this.leftBtn = true
        return this.onclickPosLeft()
      }

    }, 
    onclickPosRight(){
      const x = parseInt(this.marginLeft) + parseInt(this.width) + 14; 
      const y = parseInt(this.marginTop) + parseInt(this.height) / 2; 
      return [x, y]
    },

    onclickPosTop(){
      const x = parseInt(this.marginLeft) + parseInt(this.width/2); 
      const y = parseInt(this.marginTop) - 14; 
      return [x, y]
    },

    onclickPosLeft(){
      const x = parseInt(this.marginLeft) - 14; 
      const y = parseInt(this.marginTop) +  parseInt(this.height) / 2; 
      return [x, y]
    },
    
  },
  created(){
  },

  computed: {
    ...mapState(['currentLink','drawLink'])
  },

  watch:{
    marginLeft: function (){
      console.log('left change!!!')
    }, 
    marginTop: function(){
      console.log('top change!!!')
    },
    width: function(){
      console.log('width change !!!')
    },
    height: function(){
      console.log('height change !!!')
    }
  }
}
</script>

<style>

</style>