<template>
  <Ctemplate 
    :itemProps="itemProps" 
    @contextButtonClicked="contextButtonClickedHandler" 
    :contextCommands="contextCommands"
  >
    <template v-slot:minimizeView>
      <span>testing corpus</span>
    </template>
    <template v-slot:fullView>
      <span>testing fullview</span>
    </template>
  </Ctemplate> 
</template>  

<script>
import Ctemplate from '@/components/template'
export default {
  components: {
    Ctemplate 
  }, 
  props: ['itemProps'], 
  data() {
    return {
      contextCommands: [
        {icon: 'mdi-gauge', command: 'Modify Threshold'}, 
        {icon: 'mdi-export', command: 'Export to CSV'}
      ],
    }
  }, 
  methods: {
    contextButtonClickedHandler(button) {
      alert(button)
    },
  }
}
</script>