import yaml 
import requests
import networkx as nx
"""
sparql generation
"""
def SparqlGen(user_query, user_filter, linkml, vocab):
    linkml = loadYAML(linkml, True)
    vocab = loadYAML(vocab, True)
    select_query = "SELECT DISTINCT"
    where_query = f"""
    WHERE {{
    """
    select_ont = user_query['ont'] ## user selected ontology e.g. 'Person', 'Role'
    select_ont_names = [] ## corresding names for the selected ontology, e.g. '?person', '?role'
    select_items = [] ## all the entity names related to the selected ontology, e.g. '?person_label', '?person_email'
    for ele in select_ont:
        ## 1. the user direct query 
        class_uri, slots_uri = getPredict(ele, linkml)
        ## item from user query, e.g. project 
        direct_query_items = '?'+class_uri.split(':')[1].lower()
        select_items.append(direct_query_items)
        select_ont_names.append(direct_query_items)
        ## 
        where_query += '\t'+ direct_query_items + ' a ' + class_uri +' .' +'\n'
        
        
        where_query  = genFilter(direct_query_items, class_uri, vocab, user_filter, where_query)
        ## all relations related to direct query item, such as label of project 
        for s in slots_uri:
            temp_ = s.split(':')[1].lower()
            s_name = direct_query_items+'_'+temp_
            select_items.append(s_name) ## avoid duplicate relation name 
            where_query += '\t'+direct_query_items + ' ' + s + ' ' + s_name + ' .\n'
        
    ## build the query for 
    for ele in select_items:
        select_query += " " + ele
    
    for i in range(len(select_ont)):
        for j in range(i+1, len(select_ont)):
            where_query = findLink(select_ont[i], select_ont[j], linkml, select_ont_names[i], select_ont_names[j], where_query)
    
    where_query += '}'
    
    
    final_query = f"""
    {select_query}{where_query}
    LIMIT 10
    """
    print(final_query)
    
    return final_query, select_items
"""
whether the target is a true range or not
"""
def findObject(slot, target):
    if slot.get('range') != None:
        if isinstance(slot['range'], str) and target == slot['range']:
            return True
        elif isinstance(slot['range'], list) and target in slot['range']:
            return True 
        else:
            return False
    else:
        return False 
"""
find link between two types of entity
"""
def findLink(en1, en2, linkml, en1_name, en2_name, where_query):
    classes = linkml['classes']
    slots_info = linkml['slots']
    rel1 = classes[en1]['slots']
    rel2 = classes[en2]['slots']
    
     ## subject, predicate, object
    for r in rel1:
    ## en1 --> en2 
        if findObject(slots_info[r], en2):
            where_query += '\t' + en1_name + ' ' + slots_info[r]['slot_uri'] + ' ' + en2_name + ' .\n' 
    for r in rel2:
    ## en2 --> en1
        if findObject(slots_info[r], en1):
            where_query += '\t' + en2_name + ' ' + slots_info[r]['slot_uri'] + ' ' + en1_name + ' .\n' 
    return where_query

"""
generate filtering queries 
"""
def genFilter(class_name, class_uri, vocab, user_filter, where_query):

    for f in user_filter:
        vocab_info = vocab['enums'][f]
        values = user_filter[f]
        ## check whether this class-uri is related to this vocab filter 
        if class_uri in vocab_info['head_uri'] and len(values)>0:
            where_query += '\t' + class_name + ' ' + vocab_info['relation'] + ' ?'+f+"_temp" + ' .\n'
            where_query += '\t FILTER (?'+f+"_temp IN(" 
            ## we use or for conditions in the same filter 
            temp_conditions = ""
            for v in values:
                temp_conditions += v+','
            where_query += temp_conditions[:-1]+') ) .\n' 
    return where_query 
            


"""
linkml: ontology yaml file 
entity_type: given a specific entity type 
output: return uri, the predicates related to the given entity
"""
def getPredict(entity_type, linkml):
    entity_attribute = linkml['classes'][entity_type]
    class_uri = entity_attribute['class_uri']
    slots = entity_attribute['slots']
    
    slots_uri = []
    for slot in slots:
#         if 'range' not in linkml['slots'][slot]:
        if 'required' in linkml['slots'][slot]:
            slots_uri.append(linkml['slots'][slot]['slot_uri'])
    
    return class_uri, slots_uri    
"""
Input: 
linkml: url for LinkML, either github url or local path 
vocab: url for Taxonomy, either github url or local path 

Output:
G: A graph format (in Neo4j format) to be visualized in our viewer. 
"""
def Parser(linkml, vocab, github):
    ## Loading YAML file 
    linkml = loadYAML(linkml, github)
    vocab = loadYAML(vocab, github)
    
    ## Construct ontology from linkml 
    G1 = constructOntogy(linkml)
    ## Combine filtering information from Taxonomy YAML file 
    G2 = G2Neo4jG(G1, vocab)
    
    return G1, G2, vocab['enums']
"""
load yaml file 
"""
def loadYAML(url, github):
    if github:
        r = requests.get(url)
        data_linkml = yaml.safe_load(r.content)
    else:
        with open(url, "r") as stream:
            data_linkml = yaml.safe_load(stream)
    return data_linkml 

def addRelation(relation_info):
    if "range" in relation_info:
        if isinstance(relation_info['range'], str):
            # only one range
            return [relation_info['range']]
        else:
            ## contain multiple range 
            return relation_info['range']
    else:
        return []

"""
Input: Read-in Yaml file 
Output: Networkx build directed graph (Ontology)
"""
def constructOntogy(linkml):
    G = nx.DiGraph()
    nodes = []
    nodes_id = []
    relationships = []
    entity_names = linkml['classes'].keys()
    
    
    for entity in entity_names:
        entity_info = linkml['classes'][entity]
        entity_slots = entity_info['slots']
        for relation_name in entity_slots :
            relation_info = linkml['slots'][relation_name]
            target_ = addRelation(relation_info)
            if len(target_) == 0:
                continue
                ## no target entity, target is a string 
            else:
                for target in target_:
                    if G.has_edge(entity, target):
                        G[entity][target]['relation'].append(relation_name)
                    else:
                        G.add_edge(entity, target, relation = [relation_name])
    
    return G
"""
Input: networkx G (ontology), taxonomy 
Output: Graph format for visualizing in Neo4jd3
"""
def G2Neo4jG(G, vocab):
    nodes = []
    nodes_id = []
    relationships = []
    count_rel = 0
    
    filters = list(vocab['enums'].keys())
#     print(filters)
    for source, target, hdata in G.edges(data=True):
        if source not in nodes_id: ## do not have this node 
            if source in filters:
                color = "green"
                vocab_flag = True
                stroke_color = "black"
#                 info = vocab['enums'][source]
            else:
                color = "blue"
                stroke_color = "black"
                vocab_flag = False
#                 info = {}
            nodes.append({
                'id': source,
                'name': source,
                'type': 'node',
                'vocab': vocab_flag,
                'color': color,
                'stroke_color': stroke_color, 
                'labels': [],
                'properties': {},
                
            })
            nodes_id.append(source)
        if target not in nodes_id:
            if target in filters:
                color = "green"
                vocab_flag = True
                stroke_color = "black"
#                 info = vocab['enums'][target]
            else:
                color = "blue"
                vocab_flag = False
                stroke_color = "black"
#                 info = {}
            nodes.append({
                'id': target, 
                'name': target,
                'type':'node',
                'vocab': vocab_flag,
                'color': color,
                'stroke_color': stroke_color, 
                'labels': [],
#                 'info': info,
                'properties': {}
            })
            nodes_id.append(target)
        
        vals = hdata['relation']
        
        relationships.append({
            'id': str(count_rel),
            'label': str(vals),
            'type': 'edge',
            'startNode': source, 
            'endNode': target,
            'properties': dict(zip(vals, vals))
        })
        count_rel+=1
    output = {
        "results": [{
            "columns":[],
            "data":[{
                "graph":{
                    "nodes": nodes,
                    "relationships":relationships
                }
            }]
        }],
        "errors":[]
    }
    return output
    