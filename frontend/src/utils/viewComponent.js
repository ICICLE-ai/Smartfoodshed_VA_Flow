function addComponent(vm, module){
  vm.$store.dispatch(`${module}/addComp`);
}

function deleteComponent(vm, module, id){
  vm.$store.dispatch(`${module}/deleteComp`, id);
}

export {addComponent, deleteComponent}