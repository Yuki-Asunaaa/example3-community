"""纯计算接口：仅接收编号和边，不读文件、不依赖页面。"""
import random
import igraph as ig

def detect(node_ids, edges, seed=42, resolution=1.0):
    if resolution <= 0:
        raise ValueError('resolution 必须大于0')
    lookup = {name:i for i,name in enumerate(node_ids)}
    graph = ig.Graph(n=len(node_ids), edges=[(lookup[a],lookup[b]) for a,b in edges], directed=False)
    if graph.ecount() == 0:
        memberships = list(range(1, graph.vcount()+1))
        return {'membership':dict(zip(node_ids,memberships)), 'modularity':0.0, 'levels':[], 'components':graph.vcount(), 'version':ig.__version__, 'seed':seed, 'resolution':resolution}
    ig.set_random_number_generator(random.Random(seed))
    try:
        levels = graph.community_multilevel(weights=None, return_levels=True, resolution=resolution)
    finally:
        ig.set_random_number_generator(None)
    best = levels[-1]
    # 按规模递减重编号；编号只用于展示，不表示好坏。
    groups = sorted(best, key=lambda members:(-len(members), min(members)))
    membership = {node_ids[index]:number+1 for number,members in enumerate(groups) for index in members}
    return {'membership':membership, 'modularity':best.modularity,
        'levels':[{'communities':len(level), 'modularity':level.modularity} for level in levels],
        'components':len(graph.connected_components()), 'version':ig.__version__, 'seed':seed, 'resolution':resolution}
