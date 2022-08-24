import { apiClient } from "../api/apiClient";


class GraphInstance {
  constructor(instance) {
    this.instance = instance
  } 

  query(conditions) {

  }
}

export function updateGraphInstance(selectedInstance) {
  return new GraphInstance(selectedInstance)    
}