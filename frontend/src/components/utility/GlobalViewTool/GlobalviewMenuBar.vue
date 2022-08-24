<template>
  <div
    class="globaloverview-menu"
  >
    <v-btn
      icon
      x-small
      color="black"
      class="globaloverviewTrigger"
      @click="toggleMenuShow"
    >
      <v-icon>mdi-format-align-left</v-icon>
    </v-btn>
    <v-slide-y-transition>
      <template v-if="showMenuBar">
        <div>
          <v-card
            outlined
          >
            <v-row
              v-for="tool in tools"
              :key="tool.label"
              no-gutters
            >
              <v-col>
                <GlobalviewMenuBtn
                  :item="tool"
                  @toolEnableToggle="toolEnableToggleHandler"
                />

              </v-col>
            </v-row>
          </v-card>
        </div>
      </template>
    </v-slide-y-transition>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import GlobalviewMenuBtn from './GlobalviewMenuBtn.vue'
export default {
  data(){
    return {
      items: [],
      showMenuBar: false, 
      tools: [
        {
          label: 'lasso', 
          icon: 'mdi-lasso',
          active: false, 
        }, 
      ]
    }
  },
  methods: {
    toggleMenuShow() {
      this.showMenuBar = !this.showMenuBar
    },
    toolEnableToggleHandler(e){
      this.$emit('toolEnableToggle', e)
    }
  },
  computed: {
  },
  components: {
    GlobalviewMenuBtn,
  },
  created(){
  }
}
</script>

<style scoped>
  .globaloverview-menu{
    position: absolute; 
    top: 5px;
    left: 10px;
  }
  .globaloverviewTrigger{
    margin-left: 7px;
  }
</style>