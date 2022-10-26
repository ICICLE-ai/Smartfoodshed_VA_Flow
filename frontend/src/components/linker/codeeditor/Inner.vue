<template>
    <div class="card-inner" :style="{border: getBorder}">
        <!-- <v-card> -->
            <!-- <v-card-title class="headline">
                Code Viewer/Editor
            </v-card-title> -->
            <v-divider></v-divider>
            <prism-editor class="my-editor" v-model="itemProps.inputData.script" language="html" :highlight="highlighter" line-numbers></prism-editor>
            <v-card-actions class="mt-5">
            <v-spacer></v-spacer>
            
            <v-checkbox
            v-model="checkbox"
            :label="`Is it a function?: ${checkbox.toString()}`"
            ></v-checkbox>
            <v-btn
                text
                color="primary"
                @click="confirmSelect"
            >
                Confirm
            </v-btn>
            </v-card-actions>
        <!-- </v-card> -->
        <v-overlay :value="loading_value">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import {componentEnableDragHandler,componentDisableDragHandler,} from "@/utils/globalViewCardUtils/toolHelper.js";
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-javascript';
import "prismjs/themes/prism-tomorrow.css";

export default{
  props: ['itemProps', 'fixed', 'innerStyle'], 
  components: {
    PrismEditor
  },  
  data () {
    return {
        selectedEntities: [], 
        selectedRelations: [],
        currentEntities: [], 
        currentRelations: [],
        lassoColor: "grey", 
        zoomPanColor: "green", 
        lassoStatus: false,
        zoomPanStatus: false, 
        lasso: null, 
        zoom: null, 
        loading_value:false,
        tip: null,
        user_defined_thre: 5,// user defined threshold to show how many nodes we want to see if we expand one node 
        neo4jd3 : null,
        brushed: {"entity_type": [], "relationship_type": []},
        showOverview:false, 
        showMaxRetrieve:false,
        fav: true,
        menu: false,
        message: false,
        hints: true,
        selectedColor: null, 
        showResThre: false, // resilience threshold bar 
        resilience_thre: 0,  // selected threshold of resilience 
        // min_resilience: 0,
        max_resilience: 1, // maximum value of the scroll bar for resilience threshold 
        FIXED: false,
       

        // custom
        // code: `
        // PREFIX owl: <http://www.w3.org/2002/07/owl#>
        // PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        // PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        // PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        // PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        // PREFIX dc: <http://purl.org/dc/elements/1.1/>
        // PREFIX : <http://dbpedia.org/resource/>
        // PREFIX dbpedia2: <http://dbpedia.org/property/>
        // PREFIX dbpedia: <http://dbpedia.org/>
        // PREFIX skos: <http://www.w3.org/2004/02/skos/core#>


        // SELECT ?resource ?link_label ?other_label WHERE {{
        //   ?resource rdfs:label  "Visualization"@en .
        //   ?other ?link ?resource .
        //   ?link rdfs:label ?link_label .
        //   ?other rdfs:label ?other_label .
        //   OPTIONAL {{
        //       ?resource ?link ?other
        //   }}
        //   FILTER (lang(?link_label) = 'en')
        //   FILTER (lang(?other_label) = 'en')
        // }} `,
        code: `
          PREFIX magp: <https://makg.org/property/>
          PREFIX foaf: <http://xmlns.com/foaf/0.1/> 
          PREFIX sioc: <http://rdfs.org/sioc/ns#>
          PREFIX dcterms: <http://purl.org/dc/terms/> 
          PREFIX tl: <http://purl.org/NET/c4dm/timeline.owl#>
          PREFIX dbo: <http://dbpedia.org/ontology/>
          PREFIX frbr: <http://purl.org/vocab/frbr/core#>
          PREFIX fabio: <http://purl.org/spar/fabio/>
          PREFIX cito: <http://purl.org/spar/cito/>
          PREFIX datacite: <http://purl.org/spar/datacite>
          PREFIX prism: <http://prismstandard.org/namespaces/basic/2.0/>
          PREFIX c4o: <http://purl.org/spar/c4o/>
          PREFIX nih: <https://uts-ws.mln.nih.gov/rest/content/2018AA/AUI/>
          PREFIX justia: <https://patents.justia.com/patent/>
          PREFIX epo: <http://data.epo.org/linked-data/id/application/>
          PREFIX pm: <https://pubmed.ncbi.nlm.nih.gov/>
          PREFIX pmc: <https://www.ncbi.nlm.nih.gov/pmc/articles/>
          PREFIX org: <http://www.w3.org/ns/org#>
          PREFIX dbr: <http://dbpedia.org/resource/>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          
          
          SELECT DISTINCT *
          where{{
              ?field rdf:type <https://makg.org/class/FieldOfStudy> .
              ?field foaf:name ?name .
              ?field magp:level ?level .
              ?field magp:paperCount ?paperCount .
              ?field magp:citationCount ?citationCount .
              ?field dcterms:created ?created .
              FILTER CONTAINS(?name, "food")
          }}
          group by ?link
        `,
        checkbox: false,
    }
  },
  created () {
    // this.$store.dispatch('getGraphOverview')
    // window['d3'] = d3
   
    
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
    dblClickHandler() {
      this.toggleFixCompPos();
    }, 
    
    toggleFixCompPos() {
      this.FIXED = !this.FIXED;
      if (!this.dataStatus) {
        return;
      }
      if (this.FIXED) {
        componentDisableDragHandler(
          `.globalview-canvas-${this.itemProps.id}`,
          this.toolStatus
        );
      } else {
        componentEnableDragHandler(
          `.globalview-canvas-${this.itemProps.id}`,
          this.toolStatus
        );
      }
    },
    toolEnableToggleHandler(e) {
      alert(e)
    },
    confirmSelect(){
      if(this.checkbox){
        var func = eval(`(${this.itemProps.inputData.script})`)
      }else{
        var func = this.itemProps.inputData.script 
      }
      this.$store.dispatch('codeeditor/updateData', {id: this.itemProps.id, isFunc: this.checkbox, script: func})
    }
    
  },
  watch: {
    brushed:{
      handler(val){
          console.log(val);
      },
      deep:true 
    },
    // 'itemProps.inputData':function(newVal, oldVal){
    //   console.log(newVal, oldVal)
    // }
  },
  computed: {
    getBorder() {
      return this.FIXED ? "2px solid grey" : "None";
    }
  }
}
</script>
<style>
.kg-view-btn{
  margin-right: 10px;
}

.circle-button:hover{
  cursor: pointer;
}

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
  overflow: scroll
}
.prism-editor-wrapper .prism-editor__editor, .prism-editor-wrapper .prism-editor__textarea{
  font-size: 13px !important
}

</style>
