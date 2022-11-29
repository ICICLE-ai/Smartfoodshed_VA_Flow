<template>
  <div class="card-inner">
    <!-- <vega-lite :data="values" mark="bar" :encoding="encoding"/> -->
    <!-- {{itemProps.inputData}} -->
    <div v-for="(item, index) in vegaLite" :key="index">
        <div v-bind:id=item.ID></div>
      <!-- <vega-lite :data="item.data.values" :mark="item.mark" :encoding="item.encoding" :color="item.color" :shape="item.shape"/> -->
    </div>
  </div>
</template>

<script>
import VueVega from 'vue-vega'
import Vue from 'vue'
import vegaEmbed from 'vega-embed'

Vue.use(VueVega)
export default {
  props: ['itemProps'], 
  data() {
    return {
      vegaLite: []
    }
  }, 
  methods: {
    replace(data, column_name){
      if(column_name in data['data']['values'][0]){
        // we need to replace the date with Date type
        var temp = {
          'color': data['color'],
          'mark': data['mark'],
          'encoding': data['encoding'],
          'data': {
            'values': []
          }
        }
        for(let i=0; i<data['data']['values'].length; i++){
          let current_ = data['data']['values'][i]
          // current_['year'] = new Date(current_['year'])
          current_[column_name]  = new Date(current_[column_name])
          temp['data']['values'].push(current_)
        }
        return temp 

      }else{
        return data 
      }
    }
  
  },
  watch: {
    "itemProps.data": function(newRaw, oldVal){
      console.log('=========== props !!!!!=============',this.itemProps)
      // console.log(this.itemProps.info, this.itemProps.data)
      var id = this.itemProps.id
      var cleaned_data = []
      for(let j=0; j<this.itemProps.data.length; j++){
          var one_data = this.itemProps.data[j]
          for(let i=0; i<this.itemProps.info['date_column'].length; i++){
            var date_column_name = this.itemProps.info['date_column'][i]
             one_data = this.replace(one_data, date_column_name)
          }
          one_data['ID'] = id+"chart"+ j.toString()
          cleaned_data.push(one_data)
          
      }
      // console.log(cleaned_data)
      this.vegaLite = cleaned_data
      for(let j=0; j<this.vegaLite.length;j++){
        console.log('rendering...')
        vegaEmbed("#"+id+'chart'+j.toString(), this.vegaLite[j])
      }
      
      
      // if(newRaw.length>0){
      //   var newVal = newRaw[0]
      //   var temp = {
      //     'color': newVal['color'],
      //     'mark': newVal['mark'],
      //     'encoding': newVal['encoding'],
      //     'data': {
      //       'values': []
      //     }
      //   }
      //   for(let i=0; i<newVal['data']['values'].length; i++){
      //     let current_ = newVal['data']['values'][i]
      //     // current_['year'] = new Date(current_['year'])
      //     temp['data']['values'].push({
      //       'name': current_['name'],
      //       'selling_price': current_['selling_price'],
      //       'year': new Date(current_['year'])
      //     })
      //   }
      //   console.log('after cleaning', temp)
      //   this.vegaLite = [temp] 
      // }
    }
   
  }
}
</script>

<style scoped>
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
  overflow:scroll;
}
svg{
  width:245;
  height:245
}
</style>