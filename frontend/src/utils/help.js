export function getComponentType(componentId){
  return componentId.split('-')[1]
}

export function getTargetCard(cards, id) {
  for (let i in cards) {
    if (cards[i].id == id) {
      return cards[i]
    }
  }
  return null
}
