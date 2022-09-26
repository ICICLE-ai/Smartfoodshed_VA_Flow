<template>
  <div>
    <v-tooltip right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn 
          class="ma-2 menu-btn"
          icon
          text
          draggable="true"
          @dblclick="addCards"
        >
          <v-icon
            v-bind="attrs"
            v-on="on"
            :color="item.color"
          >
            {{item.icon}}
          </v-icon>
        </v-btn>
      </template>
      <span>{{item.label}}</span>
    </v-tooltip>
  </div>
</template>

<script>
import create from '@/utils/create'
import {addComponent, deleteComponent} from '@/utils/viewComponent'
export default {
  data(){
    return {
      
    }
  }, 
  props: ['item'],
  methods: {
    addCards(){
      console.log('adding' + this.item.store);
      addComponent(this, this.item.store);
    },
  },
}
</script>

<style>
  .menu-btn:hover{
    transform: scale(1.5);
  }
</style>