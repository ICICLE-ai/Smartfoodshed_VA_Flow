<template>
  <div>
    <v-tooltip right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn 
          class="ma-2 menu-btn"
          icon
          text
          x-small
          draggable="true"
        >
          <v-icon
            v-bind="attrs"
            v-on="on"
            :color="item.active?'green':'black'"
            @click="toolClickHandler(item)"
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
export default {
  data(){
    return {
      
    }
  }, 
  props: ['item'],
  methods: {
    toolClickHandler(toolItem){
      toolItem.active = !toolItem.active
    
      this.$emit('toolEnableToggle', toolItem)
    }
  },
}
</script>

<style>
  .menu-btn:hover{
    transform: scale(1.5);
  }
</style>