<template>
  <v-card>
    <v-card-title class="headline">
      Parsing Script
    </v-card-title>
    <v-divider></v-divider>
    <prism-editor class="my-editor" v-model="code" language="html" :highlight="highlighter" line-numbers></prism-editor>
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
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism-tomorrow.css";
export default {
  components: {
    PrismEditor
  },  
  data(){
    return {
      singleSelect: false,
      selected: [],
      uploaded_file: null,
      code: `function generationEntityRelations(items){\n    let nodes = []\n    let relations = [] \n    items.forEach(item => {\n        if(item.relation_id != null){\n            relations.push(item.relation_id)\n        }else if(item.id != null) {\n            nodes.push(item.id)\n        }else{\n            console.log("Error, item doesn't have id or relation_id")\n        }\n    })\n    return {nodes, relations}\n}`
    }
  },
  methods: {
    highlighter(code) {
        return highlight(
        code,
        {
          ...languages['markup'],
          ...languages['js'],
          ...languages['css'],
        },
        'markup'
      );
    },
    cancelSelect(){
      this.$emit('loaderAction', {status: 'fail'})
      this.selected = []
    },
    confirmSelect(){
      const func = eval(`(${this.code})`)
      this.$emit('loaderAction', {status: 'success', script: func})
    }
  },
  watch: {
    uploaded_files(){
      console.log(this.uploaded_files)
    }
  }
}
</script>

<style lang="scss">
.my-editor {
  background-color: #fafafa;
  color: black;
  max-height: 400px;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px 10px;
  font-weight: bold;
}

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>