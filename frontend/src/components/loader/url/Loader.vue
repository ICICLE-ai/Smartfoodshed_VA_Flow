<template>
  <v-card>
    <v-card-title class="headline">
      Online URL  
    </v-card-title>
    <v-divider></v-divider>
    
    <v-row  style="margin:10px">
      <v-col cols="18">
        <v-text-field
          solo
          v-model="url_linkml"
          label="LinkMl"
        ></v-text-field>
        <v-text-field
          solo
          v-model="url_vocab"
          label="Vocabulary"
        ></v-text-field>
        <v-text-field
          solo
          v-model="url_ttl"
          label="Turtle File"
        ></v-text-field>
        <v-btn @click="loadGithub">Confirm</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  data(){
    return {
      // url_linkml: "https://raw.githubusercontent.com/yasmineTYM/PPOD_KG/main/PPOD_new.yaml",
      // url_vocab: "https://raw.githubusercontent.com/yasmineTYM/PPOD_KG/main/vocabs_new.yaml",
      // url_ttl: "https://raw.githubusercontent.com/yasmineTYM/PPOD_KG/main/PPOD7.ttl", 
      url_linkml: "https://raw.githubusercontent.com/adhollander/PPODLinkML/main/PPOD.yaml",
      url_vocab: "https://raw.githubusercontent.com/adhollander/PPODLinkML/main/vocabs.yaml",
      url_ttl: "https://raw.githubusercontent.com/adhollander/PPODtottl/main/PPOD0.ttl"
      // url_linkml: "",
      // url_vocab: "",
      // url_ttl: "",
    }
  },
  methods: {
    loadGithub(){
      // console.log('load github')
      this.$emit('loaderAction', {status: 'success', linkml: this.url_linkml, vocabulary: this.url_vocab, ttl: this.url_ttl})
    },
  },
  watch: {
  }
}
</script>

<style>

</style>