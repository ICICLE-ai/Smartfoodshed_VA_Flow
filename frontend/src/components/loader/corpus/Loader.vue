<template>
  <v-card>
    <v-card-title class="headline">
      Corpus
    </v-card-title>
    <v-divider></v-divider>

    <v-card-actions class="mt-5">
      <v-row>
        <v-col cols="12">      
          <v-file-input
            @change="uploadfiles"
            label="Upload your corpus data"
            outlined
            dense
            full-width
          ></v-file-input>
        </v-col>
      </v-row>
    </v-card-actions>
    
    <v-card-title class="headline">
      Existing Corpus
    </v-card-title>
    <template>
      <v-data-table
      v-model="selected"
      :headers="headers"
      :items="tableData"
      :single-select="true"
      item-key="table"
      show-select
      class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            class="mr-2"
            
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </template>
    <v-card-actions class="mt-5">
      <v-spacer></v-spacer>
      <v-btn
        text
        color="error"
        @click="cancelSelect"
      >
        Cancel
      </v-btn>
       <v-btn
        text
        color="primary"
        @click="confirmSelect"
       >
        Confirm
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import PouchDB from 'pouchdb'
export default {
  data(){
    return {
      singleSelect: false,
      selected: [],
      headers: [
        {
          text: 'Table',
          align: 'start',
          sortable: false,
          value: 'table',
        },
        { text: 'Size', value: 'size' },
        { text: 'Last use', value: 'last_time' },
        { text: 'Uploaded date', value: 'upload_date' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      tableData: [
        
        {
          table:'car_template.csv',
          size:'355KB',
          id: '2',
          last_time: "Today",
          upload_date: '2022-10-06'
        },
        {
          table:'iris.csv',
          size:'4KB',
          id: '2',
          last_time: "Today",
          upload_date: '2022-10-06'
        },
        {
          table:'node-level-resilience.csv',
          size:'12KB',
          id: '3',
          last_time: "Today",
          upload_date: '2022-11-26'
        },
        {
          table:'network-level-resilience.csv',
          size:'12KB',
          id: '4',
          last_time: "Today",
          upload_date: '2022-11-26'
        },
        
      ],
      db: new PouchDB("test_db"),
      results:[]
    }
  },
  methods: {
    readcsvfile(reader,file){
      var that = this
      const res = new Promise((resolve,reject)=>{
        reader.addEventListener('load',function get(){
          //console.log(reader)
          const d = reader.result
          const headers = d.slice(0,d.indexOf("\n")).replace('\r', '').split(',')
          const q = d.slice(d.indexOf("\n") + 1).split("\n")
          const rows = [];
          for(let i=0;i<Object.keys(q).length;i++){ //removing all \r from rows
            rows.push(q[i].replace('\r',''))
          }
          //console.log(rows)
          const arr = rows.map(function(row) {
          const values = row.split(',');
          const el  = headers.reduce(function(object,header,index){
            object[header] = values[index];
            return object
          },{});
          return el
        });
        console.log(arr)
        // const text = JSON.stringify(arr)
        // resolve(text)
        that.$emit('loaderAction', {status: 'local', data: arr})
        reader.removeEventListener('load',get)
        })
      })
      reader.readAsText(file)
      //console.log(res)
      
      // return res
  },
    async uploadfiles(w){
      const reader = new FileReader()
      // this.results.splice(0)
      if(w["type"]=="text/csv"){
        await this.readcsvfile(reader, w)
      }
      // })
      // console.log(this.results)
    },
    cancelSelect(){
      this.$emit('loaderAction', {status: 'fail'})
      this.selected = []
    },
    confirmSelect(){
      if(this.selected.length > 0){
        this.$emit('loaderAction', {status: 'existing', selected: this.selected[0]})
        this.selected = []
      }else{
        this.cancelSelect()
      }
    }
  }
}
</script>

<style>

</style>