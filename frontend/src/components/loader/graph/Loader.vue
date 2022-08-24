<template>
  <v-card>
    <v-card-title class="headline">
      Graphs 
    </v-card-title>
    <v-divider></v-divider>

    <v-card-actions class="mt-5">
      <v-row>
        <v-col cols="12">      
          <v-file-input
            label="Upload your graph data"
            outlined
            dense
            full-width
            v-model="uploaded_file"
          ></v-file-input>
        </v-col>
      </v-row>
    </v-card-actions>
    
    <v-card-title class="headline">
      Select Existing GraphDB Instances
    </v-card-title>
    <template>
      <v-data-table
      v-model="selected"
      :headers="headers"
      :items="desserts"
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
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      desserts: [
        {
          table: 'PPOD',
          size: '1.3Mb', 
          status: 'online',
          last_time: '2022-7-23',
          upload_date: '2022-04-12',
        },    
        {
          table: 'CFS',
          size: '5.6Mb', 
          status: 'online',
          last_time: '2022-7-23',
          upload_date: '2022-07-12',
        }, 
      ], 
      uploaded_file: null,
    }
  },
  methods: {
    cancelSelect(){
      this.$emit('loaderAction', {status: 'fail'})
      this.selected = []
    },
    confirmSelect(){
      if(this.selected.length > 0){
        this.$emit('loaderAction', {status: 'success', selected: this.selected[0]})
        this.selected = []
      }else{
        if (this.uploaded_file) {
          this.$emit('loaderAction', {status: 'success', selected: this.uploaded_file, source: 'uploaded_file'})
        }else {
          this.cancelSelect()
        }
      }
      
    }
  },
  watch: {
    uploaded_files(){
      console.log(this.uploaded_files)
    }
  }
}
</script>

<style>

</style>