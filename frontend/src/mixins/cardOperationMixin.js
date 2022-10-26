/* eslint-disable no-inner-declarations */
import {mapState} from 'vuex'
export const cardOperationMixin ={
    data(){

    },
    created(){
        console.log('test mixin')
    },
    methods:{
        moveAt(posX, posY) { 
            const comp = document.querySelector(`#${this.itemProps.id}`)
            this.marginTop = posY 
            this.marginLeft = posX
        }, 
        draggable(){
          return !(this.drawLink || this.resizingStatus);
        }, 
        dragProxy(e) {
          if (!this.fixed) {
            this.dragStartHandler(e);
          } else {
            return;
          }
        },
        dragStartHandler(e){
            console.log(e)
            console.log(this.draggable)
            if (e.buttons == 1 && this.draggable) {
              const that = this
              const comp = document.querySelector(`#${this.itemProps.id}`)
              const initialLeft = parseInt(comp.style.left.split('px')[0]) - e.clientX
              const initialTop = parseInt(comp.style.top.split('px')[0]) - e.clientY
              function onMouseMove(event) { 
                that.moveAt(event.pageX + initialLeft, event.pageY + initialTop) 
              }
              document.addEventListener("mousemove", onMouseMove)
              comp.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove)
                comp.onmouseup = null
              }
            }
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
    }
}
