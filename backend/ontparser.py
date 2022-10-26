import yaml 
import requests
import networkx as nx
"""
sparql generation
"""
def SparqlGen(user_query, user_filter, linkml, vocab):
    linkml = loadYAML(linkml, True)
    vocab = loadYAML(vocab, True)

    prefix_query = ""
    for pre in linkml['prefixes']:
        prefix_query += "PREFIX"+' '+pre+":"+" "+linkml['prefixes'][pre]+'\n'
    select_query = "SELECT DISTINCT"
    where_query = f"""
    WHERE {{
    """
    select_ont = user_query['ont'] ## user selected ontology e.g. 'Person', 'Role'
    select_ont_names = [] ## corresding names for the selected ontology, e.g. '?person', '?role'
    select_items = [] ## all the entity names related to the selected ontology, e.g. '?person_label', '?person_email'
    print(select_ont)
    for ele in select_ont:
        ## 1. the user direct query 
        class_uri, slots_uri = getPredict(ele, linkml)
        ## item from user query, e.g. project 
        # direct_query_items = '?'+class_uri.split(':')[1].lower()
        direct_query_items = "?"+ele.lower()
        select_items.append(direct_query_items)
        select_ont_names.append(direct_query_items)
        ## 
        where_query += '\t'+ direct_query_items + ' a ' + class_uri +' .' +'\n'
        
        
        where_query, add_to_select  = genFilter(direct_query_items, class_uri, vocab, user_filter, where_query, linkml)
        select_items += add_to_select
        ## all relations related to direct query item, such as label of project 
        for s in slots_uri:
            temp_ = s.split(':')[1].lower()
            s_name = direct_query_items+'_'+temp_
            select_items.append(s_name) ## avoid duplicate relation name 
            where_query += '\t'+direct_query_items + ' ' + s + ' ' + s_name + ' .\n'
        
    ## build the query for 
    ## remove duplidates 
    select_items = list(set(select_items))
    for ele in select_items:
        select_query += " " + ele
    
    for i in range(len(select_ont)):
        for j in range(i+1, len(select_ont)):
            where_query = findLink(select_ont[i], select_ont[j], linkml, select_ont_names[i], select_ont_names[j], where_query)
    
    where_query += '}'
    
    
    final_query = f"""
    {prefix_query}{select_query}{where_query}
   
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
given a vocab, 
find head entity uri and the predicate uri 
"""
def findHeadURI(linkml, ele):
    output = {'head_uri': [], "relation":""}
    predicate_name = ""
    found=False ## have
    for slot_name in linkml['slots']:
        slot = linkml['slots'][slot_name]
        if slot.get('range')!=None:
            if slot['range']==ele:
                output['relation'] = slot['slot_uri']
                predicate_name = slot_name
                found = True
    
    if found==False:
        print('no definitions of the vocab', ele)
    

    for class_name in linkml['classes']:
        class_ = linkml['classes'][class_name]
        
        if class_.get('slots')!=None and predicate_name in class_['slots']:
            output['head_uri'].append(class_['class_uri'])
    
    return output

    

"""
generate filtering queries 
"""
def genFilter(class_name, class_uri, vocab, user_filter, where_query,linkml):
    filters = []
    for f in user_filter:
        vocab_info = vocab['enums'][f]
        values = user_filter[f]
        ## generate head-uri and relation uri for this filter entity:
        temp_ = findHeadURI(linkml, f)
        vocab_info['relation'] = temp_['relation']
        vocab_info['head_uri'] = temp_['head_uri']
        
        ## check whether this class-uri is related to this vocab filter 
        if class_uri in vocab_info['head_uri'] and len(values)>0:
            filters.append('?'+f+'_temp')
            print('class uri', class_uri,vocab_info['head_uri'], values)
            where_query += '\t' + class_name + ' ' + vocab_info['relation'] + ' ?'+f+"_temp" + ' .\n'
            where_query += '\t FILTER (?'+f+"_temp IN(" 
            ## we use or for conditions in the same filter 
            temp_conditions = ""
            for v in values:
                if "http" in v: ## should have <> outside 
                    v = "<"+v+">"
                temp_conditions += v+','
            where_query += temp_conditions[:-1]+') ) .\n' 
    return where_query , filters
            
            

            


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

def Parser(linkml, vocab, github, remove_node_list):
    ## Loading YAML file 
    linkml = loadYAML(linkml, github)
    vocab = loadYAML(vocab, github)
    
    ## Construct ontology from linkml 
    G1 = constructOntogy(linkml, remove_node_list)
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
def constructOntogy(linkml, remove_node_list):
    G = nx.DiGraph()
    nodes = []
    nodes_id = []
    relationships = []
    entity_names = linkml['classes'].keys()
    
    
    for entity in entity_names:
        if entity not in remove_node_list:
            entity_info = linkml['classes'][entity]
            if 'slots' in entity_info: ## check whether we have the attribute of slot
                entity_slots = entity_info['slots']
                for relation_name in entity_slots :
                    relation_info = linkml['slots'][relation_name]
                    target_ = addRelation(relation_info)
                    if len(target_) == 0:
                        continue
                        ## no target entity, target is a string 
                    else:
                        for target in target_:
                            if target not in remove_node_list:
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
    