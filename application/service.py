"""编排标准化与算法输出，生成页面数据和统计。"""
from collections import Counter
from data_processing.loader import load
from core.community import detect

def analyze(path):
    model = load(path)
    result = detect([n['id'] for n in model['nodes']], [(e['source'],e['target']) for e in model['links']])
    membership = result.pop('membership')
    degree, cross = Counter(), Counter()
    groups = {}
    for node in model['nodes']:
        c = membership[node['id']]
        node['community'] = c
        groups.setdefault(c, {'id':c, 'nodes':[], 'internal_edges':0, 'external_edges':0, 'types':Counter()})
        groups[c]['nodes'].append(node['id'])
        groups[c]['types'][node['type']] += 1
    internal = 0
    for edge in model['links']:
        a,b = edge['source'],edge['target']
        ca,cb = membership[a],membership[b]
        degree[a] += 1; degree[b] += 1
        if ca == cb:
            internal += 1; groups[ca]['internal_edges'] += 1
        else:
            groups[ca]['external_edges'] += 1; groups[cb]['external_edges'] += 1
            cross[tuple(sorted((ca,cb)))] += 1
    for node in model['nodes']:
        node['degree'] = degree[node['id']]
    for group in groups.values():
        group['size'] = len(group['nodes'])
        volume = 2*group['internal_edges']+group['external_edges']
        group['boundary_ratio'] = group['external_edges']/volume if volume else 0
        group['density'] = 2*group['internal_edges']/(group['size']*(group['size']-1)) if group['size']>1 else 0
    return {**model, 'communities':list(groups.values()),
        'community_links':[{'source':a,'target':b,'count':v} for (a,b),v in cross.items()],
        'summary':{**result, 'node_count':len(model['nodes']), 'edge_count':len(model['links']),
        'community_count':len(groups), 'internal_edges':internal, 'external_edges':len(model['links'])-internal,
        'internal_ratio':internal/len(model['links']) if model['links'] else 0}}
