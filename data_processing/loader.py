"""只负责读取、验证和标准化，不计算社区或相似度。"""
import json
from pathlib import Path

def normalize(raw):
    if not isinstance(raw, dict) or not isinstance(raw.get('nodes'), list) or not isinstance(raw.get('links'), list):
        raise ValueError('数据必须包含 nodes 与 links 数组')
    nodes, seen = [], set()
    for item in raw['nodes']:
        if not isinstance(item, dict) or 'name' not in item:
            raise ValueError('节点缺少 name')
        ident = str(item['name'])
        if ident in seen:
            raise ValueError(f'节点编号重复：{ident}')
        seen.add(ident)
        nodes.append({'id': ident, 'type': item.get('type', 'Unknown'), 'attributes': dict(item)})
    pairs, loops = {}, 0
    for index, edge in enumerate(raw['links']):
        a, b = str(edge['source']), str(edge['target'])
        if a not in seen or b not in seen:
            raise ValueError(f'第 {index + 1} 条关系的端点不存在')
        if a == b:
            loops += 1
            continue
        key = tuple(sorted((a, b)))
        pairs.setdefault(key, []).append({'source': a, 'target': b, 'relation': str(edge.get('relation', 'unknown')), 'record': index})
    links = [{'source': a, 'target': b, 'relations': records} for (a,b),records in pairs.items()]
    return {'nodes': nodes, 'links': links, 'processing': {
        'raw_nodes':len(raw['nodes']), 'raw_links':len(raw['links']), 'edges':len(links),
        'self_loops_excluded': loops, 'merged_records':len(raw['links'])-loops-len(links),
        'policy':'无向、无权简单图；同一对端点合并为一条计算边，原始方向和关系保留。自环不参与计算。'}}

def load(path):
    return normalize(json.loads(Path(path).read_text(encoding='utf-8')))
