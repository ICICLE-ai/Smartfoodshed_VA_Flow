<template>
  <div>
    <v-hover v-slot="{ hover }">
      <v-card
        :elevation="hover ? 12 : 5"
        class="card-documents"
        :draggable="draggable"
        @dragstart="dragStart"
        outlined
        :id="itemProps.id"
        ref="cardComp"
        @contextmenu="rightClickMenuShow"
        @dblclick="printCorpus"
        :style="{
          top: marginTop + 'px',
          left: marginLeft + 'px',
          width: `${width}px`,
          height: `${height}px`,
          position: 'absolute',
        }"
      > 
        <v-card-text v-if="!dataStatus" class="card-name">
          No Table Data
        </v-card-text>
        
        <template v-if="dataStatus">
          <div>
            <v-sheet
              class="mx-auto sheetname"
              max-width="900"
            >
              <v-slide-group
                show-arrows
              >
                <v-slide-item
                  v-for="sheet in sheets"
                  :key="sheet.name"
                >
                  <v-btn
                    class="mx-2"
                    :input-value="currentSheet == sheet.name"
                    active-class="purple white--text"
                    depressed
                    rounded
                    small
                    @click="toggleSheet(sheet.name)"
                  >
                    {{sheet.name}}
                  </v-btn>
                </v-slide-item>
              </v-slide-group>
            </v-sheet>

            <v-card-title>
              {{ currentSheet.split(".")[0] }}
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <template>
              <v-data-table
                :loading="loadingStatus"
                :headers="headers"
                :items="desserts"
                :item-key="tableItemKey"
                class="elevation-1"
                :height="`${height - 50 - 70}px`"
                :search="search"
                show-select
                ref="table"
                :single-select="false"
                v-model="selected"
              >
              </v-data-table>
            </template>
          </div>
        </template>
        <v-card-actions>
          <!-- input action button on the border -->
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

        <div class="resizer resizer-r" @mousedown="mouseDownHandler"></div>
        <div class="resizer resizer-b" @mousedown="mouseDownHandler"></div>
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
        store="documents"
      />
    </v-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
import RightClickMenu from "@/components/common/rightclick/RightClickMenu";
import InoutputBtns from "@/components/common/menu/buttons/InoutputBtns";
export default {
  props: ["itemProps"],
  data() {
    return {
      initialX: undefined,
      initialY: undefined,
      dataStatus: false,
      resizeX: undefined,
      resizeY: undefined,
      // draggable: true,
      width: 500,
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
      // for right click menu
      items: [{ title: "Remove node" }],

      container: ".documents-components-list",

      rightBtn: true,

      topBtn: false,

      leftBtn: false,

      singleSelect: false,
      selected: [],
      search: "",
      sheets: [], 
      headers: [
        // {
        //   text: 'Corpus',
        //   align: 'start',
        //   sortable: false,
        //   value: 'corpus',
        // },
        // { text: 'Size', value: 'size' },
        // { text: 'Last use', value: 'last_time' },
        // { text: 'Uploaded date', value: 'upload_date' },
        // { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [],
      currentDataBase: [],
      answerBasedRetrieval: {},
      currentSheet: "", 
      flag: false,
      tableItemKey: "",
    };
  },
  methods: {
    dragStart(e) {
      // if(!this.initialX){
      //   this.initialX = e.clientX;
      //   this.initialY = e.clientY;
      // }
      // e.dataTransfer.setData('item-id', e.target.id);
      // e.dataTransfer.setData('initialX', this.initialX);
      // e.dataTransfer.setData('initialY', this.initialY);
      const el = document.querySelector(`#${e.target.id}`);
      const initialLeft = parseInt(el.style.left.split("px")[0]) - e.clientX;
      const initialTop = parseInt(el.style.top.split("px")[0]) - e.clientY;
      e.dataTransfer.setData("item-id", e.target.id);
      e.dataTransfer.setData("initialLeft", initialLeft);
      e.dataTransfer.setData("initialTop", initialTop);
      this.$store.dispatch("changeCurrentDraggingVM", this);
    },

    addLink() {

      this.$store.dispatch("changeLinkDrawingStatus", true);
    },

    finishLink() {
      this.$store.dispatch("changeLinkDrawingStatus", false);
    },

    mouseDownHandler(e) {
      // this.$store.dispatch('changeResizerStatus', true);
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

    printCorpus() {
      console.log(this.itemProps);
    },

    toggleSheet(sheetName){
      if (this.currentSheet != sheetName) {
        this.currentSheet = sheetName;
        this.sheetDataUpdate(this.currentSheet);
      }
    },

    sheetDataUpdate(sheetName){
      const val = this.itemProps.inputData; 
      const tableValue = val["data"][sheetName];
      this.headers = []
     
      if(Object.keys(tableValue).length > 0){
        for (let key of Object.keys(tableValue[0])) {
          this.headers.push({
            text: key.charAt(0).toUpperCase() + key.slice(1), //
            value: key,
          }); 
        }
        this.tableItemKey = this.headers[0]["value"];
        this.currentDataBase = Object.values(tableValue);
        this.desserts = Object.values(tableValue);
      }
    }
  },

  created() {
    // Initialize initial position
    this.marginTop = this.topMargin - this.height / 2;
    this.marginLeft = this.leftMargin - this.width / 2;
    this.resizeWidth = this.width;
    this.resizeHeight = this.height;
  },

  computed: {
    ...mapState(["drawLink", "resizer"]),

    // Determine Whether the component is draggable
    // Not allowed when resizing and drawling link
    draggable() {
      return !(this.drawLink || this.resizingStatus);
    },
  },

  components: {
    RightClickMenu,
    InoutputBtns,
  },

  watch: {
    "itemProps.inputData": function (val, oldVal) {
    
      console.log("newVal, oldVal");
      if (val) {
        this.loadingStatus = true;
        this.dataStatus = val.tableNames;
        this.headers = [];

        const tableNames = val['tableNames']; 
        tableNames.forEach(tablename => {
          this.sheets.push({
            name: tablename,
            active: true,
          })
        })
        
        this.currentSheet = tableNames[0];

        this.sheetDataUpdate(this.currentSheet);

        this.loadingStatus = false;
      } else {
        this.loadingStatus = false;
        this.dataStatus = undefined;
        this.currentDataBase = undefined;
        this.desserts = undefined;
      }
    },
  dataStatus: function(val, oldVal) {
    if (val) {
      const resizerBElelemt = document.querySelector("#" + this.itemProps.id).querySelector(".resizer-b"); 
      const heightOfSheet = 25;
      resizerBElelemt.style.bottom = (-heightOfSheet - 12) + "px"; 
    }
  }
   
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

/* .card-actions{
    position: absolute;
    transform: translate(300px, -150px);
    padding: 0;
  } */

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
  bottom: 0;
  cursor: row-resize;
  height: 5px;
  left: 0;
  width: 100%;
}

.v-data-footer {
  height: 50px !important;
}

.sheetname{
  margin-top: 10px;
  height: 20px;
}
</style>                                                                   