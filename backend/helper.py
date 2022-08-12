import networkx as nx 
## geneerate ontology graph for one table 
def oneTable(ont,G,tableType):
    keys = ont.keys()
    
#     G = nx.DiGraph()
    
    organized_keys = {
        'd':[],
        'o':[],
        'v':[],
        'u':[]
    }
    for k in keys:
        organized_keys[ont[k][0]].append(k)
    dList = organized_keys['d']
    if tableType=="entity":
        temp = {}
        for i in range(1, len(dList)): ## add the first node with all attributes 
            temp[dList[i]] = "string"
        G.add_nodes_from([
            (ont[dList[0]][3], temp)
        ])
        oList = organized_keys['o']+organized_keys['v']+organized_keys['u'] ## others add linkage 
        for i in oList:
            G.add_edge(ont[dList[0]][3], ont[i][3], name=ont[i][2])
    
    elif tableType=="rel":
        oList = organized_keys['o']
        source = ont[oList[0]][3]
        temp = {}
        dList = organized_keys['d']
        for i in range(1, len(oList)):
            target = ont[oList[i]][3]
            G.add_edge(source, target, name=ont[oList[i]][2] )
            for i in range(len(dList)):
                G[source][target].update({dList[i]: "string"})
    return G 

## generate for all tables or one specific table 
def generateWhole(ont, name):
    G = nx.DiGraph()
    entities = ['Organizations','Projects','Programs','People','Guidelines_Mandates','Datasets','Tools']
    rels = ['PeopleOrg','PeopleProj','PeopleProgram','OrgGM','OrgProjGM',]
    
    if name=="all":
        for ele in entities:
            print(ele)
            G = oneTable(ont[ele], G, 'entity')
        for ele in rels :
            print(ele)
            G = oneTable(ont[ele], G, 'rel')
    else:
        if name in entities:
            G = oneTable(ont[name], G, 'entity')
        else:
            G = oneTable(ont[name], G, 'rel')
    return G 


def nx2neo(H):
    new_nodes = []
    for pair in H.nodes(data=True):
        prop = {}
        if len(pair[1].keys())>0:
            
            for k in pair[1].keys():
                prop[k] = pair[1][k]
        new_nodes.append({
            'type':'node',
            'id': pair[0],
            'labels': ['ENTITY'],
            'properties':prop
        })
        
    new_edges = []
    for source, target, hdata in H.edges(data=True):
        temp = {}
        if len(hdata.keys())>1:
            
            for i in range(1, len(hdata.keys())):
                k = list(hdata.keys())[i]
                temp[k] = hdata[k]
        new_edges.append({
            'id': source+"_"+target+"_"+hdata['name'],
            'type': 'relationship',
            'startNode': source,
            'endNode': target,
            'label':  hdata['name'],
            'properties': temp
        })

    output = {
        "results": [{
            "columns":[],
            "data":[{
                "graph":{
                    "nodes": new_nodes,
                    "relationships":new_edges
                }
            }]
        }],
        "errors":[]
    }
    return output