<template>
  <div>
    <v-list>
      <v-list-item
        v-if="!reload"
      >
        <v-btn 
          text
          @click="remove"
        >
          <v-icon 
            left
            medium
          >
            mdi-delete
          </v-icon>
          Remove node
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn 
          text
          @click="keepInVis"
        >
          <v-icon 
            left
            medium
            :color="itemProps.keep_in_vis_mode?'green':'none'"
          >
            mdi-eye
          </v-icon>
          Keey in vis mode
        </v-btn>
      </v-list-item>
      <v-list-item
        v-if="additionalCommands"
        v-for="command in commands"
        :key="command.command"
      >
        <v-btn
          text
          @click="buttonClick(command.command)"
        >
         <v-icon
            v-if="command.icon" 
            left
            medium
          >
            {{command.icon}}
          </v-icon> 
          {{command.command}}
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  props: [
    'vue', 
    'container',
    'itemProps',
    'store',
    'commands',
    'reload'
  ], 
  methods: {
    data(){
      return {
        defaultCommands: [
          {icon: "mdi-delete", command: "Remove node"},
          {icon: "mdi-eye", command: "Keep in vis mode"}
        ], 
      }
    },
    remove(){
      console.log(this.itemProps.id)
      this.$store.dispatch(`${this.store}/deleteComp`, this.itemProps.id);
      
    },
    keepInVis() {
      this.$store.dispatch(`${this.store}/keepInVis`, this.itemProps.id); 
    },
    buttonClick(button){
      this.$emit("contextButtonClicked", button)
    }
  },
  computed: {
    additionalCommands(){
      if(this.commands.length > 0){
        return true
      }else{
        return false
      }
    }
  },
  created(){
    console.log(this.commands);
  }
}
</script>

<style>

</style>