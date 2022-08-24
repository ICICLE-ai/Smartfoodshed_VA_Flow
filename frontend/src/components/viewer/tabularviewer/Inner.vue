<template>
  <div class="card-inner">
    <v-card-text v-if="!dataStatus" class="card-name">
      No Table Data
    </v-card-text>
    
    <template v-if="dataStatus">
      <div>
        <v-sheet
          class="mx-auto sheetname"
          max-width="900"
          style="margin-top:10px"
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
            :height="`${itemProps.height - 50 - 70}px`"
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
  </div>
</template>

<script>

export default {
  props: ['itemProps'], 
  data() {
    return {
      dataStatus: false, 
      loadingStatus: undefined,
      selected: [],
      search: "",
      sheets: [], 
      headers: [],
      desserts: [],
      currentDataBase: [],
      answerBasedRetrieval: {},
      currentSheet: "", 
      flag: false,
      tableItemKey: "",
    }
  }, 
  methods: {
    toggleSheet(sheetName){
      if (this.currentSheet != sheetName) {
        this.currentSheet = sheetName;
        this.sheetDataUpdate(this.currentSheet);
      }
    },
    sheetDataUpdate(sheetName){
      const val = this.itemProps.inputData; 
      const {tableData, tableInfo} = val["data"][sheetName];
      this.headers = []
      let relation_id_exist = false 
      let id_exist = false 
      if (tableData.length > 0) {
        tableInfo.forEach(info => {
          this.headers.push({
            text: info.label, 
            value: info.value
          })
          info.value == 'relation_id' 
            ? (relation_id_exist = true) 
            : info.value == 'id' 
              ? (id_exist = true )
              : -1
        })
        this.tableItemKey = relation_id_exist 
          ? 'relation_id'
          : id_exist 
            ? 'id'
            : this.headers[0].value
        this.currentDataBase = tableData
        this.desserts = tableData
      }
    }
  },
  watch: {
    "itemProps.inputData": function (val, oldVal) {
    
      console.log("newVal, oldVal");
      if (val) {
        this.loadingStatus = true;
        this.dataStatus = val.tableNames;
        this.headers = [];

        console.log(val)
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
    },
    selected() {
      console.log(`table ${this.itemProps.id} selected items updated`) 
      console.log(this.selected)
      this.$store.dispatch('documents/updateSelectedItems', {id: this.itemProps.id, selected: this.selected})
    }
  }
}
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

.card-inner{
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
}
</style>