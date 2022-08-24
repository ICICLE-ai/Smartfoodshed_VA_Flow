function export_table2cypher(card) {
  return card.selectedItems
    ? card.selectedItems 
    : []
}


export function wrapUpDataForTableExport(targetCompType, card) {
  switch(targetCompType) {
    case 'table2cypher': 
      return export_table2cypher(card)
      break
    default:
      return card.inputData
  }
}
