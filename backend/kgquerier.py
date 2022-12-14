from rdflib import Graph, Namespace

def loadGraph(url, data_format):
    g = Graph()
    g.parse(url, format=data_format)
    return g

def Literal2String(li):
    return li.n3()

def query(g, sparql):
    return g.query(sparql)


"""
add prefix 
"""
def getPrefix(g, sparql):
    output = {}
    all_row = sparql.split('\n')
    no_prefix = ""
    for row in all_row:
        if row.startswith('PREFIX') or 'PREFIX' in row:
            key_ = row.split(':', 1)[0].replace('PREFIX','').strip()
            value_ = row.split(':',1)[1].strip()
            output[key_] = value_
        else:
            no_prefix += row + '\n'
    for ele in output:
        g.bind(ele, Namespace(output[ele]))
    return g, no_prefix 
