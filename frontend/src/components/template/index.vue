<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-card :elevation="hover ? 12 : 5" 
        class="card-tabular" 
        @mousedown="dragProxy" 
        outlined 
        :id="itemProps.id"
        @dblclick="dblclickHandler"
        @contextmenu="rightClickMenuShow" 
        :style="{
          top: marginTop + 'px',
          left: marginLeft + 'px',
          width: `${width}px`,
          height: `${height}px`,
          position: 'absolute',
          'border-radius': styleProps['border-radius'] ? styleProps['border-radius'] : 'none', 
          border: getBorder
        }">
        <slot v-if="minimizeStatus" name="minimizeView">
          <v-card-text class="card-name">
            Empty Container
          </v-card-text>
        </slot>
        <slot v-else name="fullView">
          <v-card-text class="card-name">
            Empty Container
          </v-card-text>
        </slot>
        <slot name="popup">
        </slot>
        <div v-if="!disableResizer" class="resizer resizer-r" @mousedown="mouseDownHandler"></div>
        <div v-if="!disableResizer" class="resizer resizer-b" @mousedown="mouseDownHandler"></div>
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
        :itemProps="itemProps" 
        :store="currentStore" 
        :commands="commands"
        @contextButtonClicked="contextButtonClickedHandler"
      />
    </v-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RightClickMenu from "@/components/common/rightclick/RightClickMenu";
import InoutputBtns from "@/components/common/menu/buttons/InoutputBtns";
export default {
  props: {
    itemProps: {
      type: Object,
      required: true
    }, 
    contextCommands: {
      type: Array, 
      required: false, 
    }, 
    styleProps: {
      type: Object,
      required: false, 
    },
    'disable-resizer': {
      type: Boolean,
      required: false
    },
    fixed: {
      type: Boolean, 
      required: false, 
    }
  },
  data() {
    return {
      dataStatus: false,
      resizeX: undefined,
      resizeY: undefined,
      width: 300,
      height: 300,
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
      loadingStatus: undefined,
      items: [{ title: "Remove node" }],
      container: ".documents-components-list",
      minimize: false, 
    };
  },
  methods: {
    dragProxy(e) {
      if (!this.fixed) {
        this.dragStartHandler(e);
      } else {
        return;
      }
    },
    moveAt(posX, posY) {
      const comp = document.querySelector(`#${this.itemProps.id}`)
      this.marginTop = posY
      this.marginLeft = posX
      this.$store.dispatch(`${this.currentStore}/updatePos`, {id: this.itemProps.id, marginLeft: this.marginLeft, marginTop: this.marginTop})
    },
    dblclickHandler() {
      this.$emit('dblclick')
    },
    dragStartHandler(e) {
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
    mouseDownHandler(e) {
      this.resizeX = e.clientX;
      this.resizeY = e.clientY;
      document.addEventListener("mousemove", this.mouseMoveHandler);
      document.addEventListener("mouseup", this.mouseUpHandler);
      this.resizingStatus = true;
    },

    mouseMoveHandler(e) {
      const dx = e.clientX - this.resizeX;
      const dy = e.clientY - this.resizeY;
      this.width = this.resizeWidth + dx;
      this.height = this.resizeHeight + dy;
      this.$store.dispatch(`${this.currentStore}/updateSize`, {id: this.itemProps.id, width: this.width, height: this.height})
    },

    mouseUpHandler(e) {
      this.resizeWidth = this.width;
      this.resizeHeight = this.height;
      document.removeEventListener("mousemove", this.mouseMoveHandler);
      document.removeEventListener("mouseup", this.mouseUpHandler);
      // this.$store.dispatch('changeResizerStatus', false)
      this.resizingStatus = false;
    },

    rightClickMenuShow(e) {
      e.preventDefault();
      this.showRightClickMenu = true;
      this.rightMenuX = e.clientX;
      this.rightMenuY = e.clientY;
    },
    contextButtonClickedHandler(button) {
      this.$emit('contextmenu', button)
    }
  },
  created() {
    // Initialize initial position
    console.log('check this')
    console.log(this.styleProps)
    this.styleProps.top 
      ? this.marginTop = +this.styleProps.top.split('px')[0]
      : this.marginTop = 500
    this.styleProps.left
      ? this.marginLeft = +this.styleProps.left.split('px')[0]
      : this.marginLeft = 200
    this.styleProps.width 
      ? this.width = +this.styleProps.width.split('px')[0]
      : -1 
    this.styleProps.height
      ? this.height = +this.styleProps.height.split('px')[0]
      : -1

    this.resizeWidth = this.width;
    this.resizeHeight = this.height;
    console.log(this.disableResizer)
  },

  computed: {
    // Determine Whether the component is draggable
    // Not allowed when resizing and drawling link
    ...mapState(["drawLink", "resizer", "vismode"]),
    getBorder() {
      return this.fixed ? "2px solid grey" : "None";
    },
    draggable() {
      return !(this.drawLink || this.resizingStatus);
    },
    minimizeStatus() {
      return this.$slots.minimizeView && this.minimize 
    }, 
    commands() {
      const rightClickCommands = {icon: "mdi-window-minimize", command: "Minimize"}
      let commands = [] 
      this.$slots.minimizeView && this.$slots.fullView 
        ? commands.push(rightClickCommands)
        : -1 
      commands = this.contextCommands
        ? commands.concat(this.contextCommands)
        : commands
      console.log('commands!!!')
      console.log(commands)
      return commands
    }, 
    currentStore() {
      return this.itemProps.id.split('-')[1]
    }
  },

  components: {
    RightClickMenu, 
    InoutputBtns
  },

  watch: {
  
  },
};
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


.resizer {
  position: absolute;
}

.resizer-r {
  cursor: col-resize;
  height: 100%;
  right: -1%;
  top: 0;
  width: 5px;
}

/* Placed at the bottom side */
.resizer-b {
  bottom: -1%;
  cursor: row-resize;
  height: 5px;
  left: 0;
  width: 100%;
}
</style>                                                                   