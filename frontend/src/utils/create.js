import Vue from 'vue'
export default function(Component, props, container) {
  // Here Container is a querySelector e.g. <div class=".dashboard-container"></div>
  const vm = new Vue({
    render(h){
      // Generate a virtual DOM
      return h(Component, {props});
    }
  }).$mount();

  container.appendChild(vm.$el);
  console.log(container);
  console.log('check here!!!')
  console.log(vm, vm.$children[0]);
  return vm;
}