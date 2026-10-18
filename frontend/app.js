import {NetworkView} from './graph.js';
const $=id=>document.getElementById(id),fmt=n=>n.toLocaleString('zh-CN'),pct=n=>(n*100).toFixed(1)+'%';
// 社区色是分类标记；编号与文字同时承载信息，避免仅靠辨色。
const palette=['#287c79','#bd6144','#5875b2','#9874ac','#a48224','#5b8c48','#b65078','#438fbb','#827048','#bc864c','#557a67','#8c5d59','#6871a0','#9b6c88','#647f32','#358b99','#a35151','#6f60a5','#8f7a51','#437a9e','#b66c8e','#698c6f','#ac713c','#547b83','#927db4','#8c6542','#657492'];
const color=id=>palette[(id-1)%palette.length];
let data,view,mode='overview',selectedCommunity=null;
function button(text,fn,cls=''){const b=document.createElement('button');b.textContent=text;b.className=cls;b.onclick=fn;return b}
function paragraph(text){const p=document.createElement('p');p.textContent=text;return p}
function title(text){const h=document.createElement('h2');h.textContent=text;return h}
function updateGraph(){
  $('overview').setAttribute('aria-pressed',String(mode==='overview'));$('network').setAttribute('aria-pressed',String(mode==='network'));
  if(mode==='overview'){
    view.setData(data.communities,data.community_links,mode);view.setFocus(selectedCommunity);
    $('graph-title').textContent='社区之间如何连接';$('graph-note').textContent='圆大小表示社区规模，线粗表示跨社区连接数';$('view-status').textContent=`${data.communities.length} 个社区 · ${data.community_links.length} 组社区连接`;
  }else{
    const nodes=selectedCommunity?data.nodes.filter(n=>n.community===selectedCommunity):data.nodes;
    view.setData(nodes,data.links,mode);view.setFocus(null);
    $('graph-title').textContent=selectedCommunity?`社区 ${selectedCommunity} 的内部网络`:'全部节点的社区划分';$('graph-note').textContent='颜色代表社区 · 节点大小表示连接数 · 点击节点查看详情';$('view-status').textContent=`${fmt(nodes.length)} 个节点 · ${fmt(view.links.length)} 条连接${selectedCommunity?'（仅内部）':''}`;
  }
  document.querySelectorAll('.community-row').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.id===selectedCommunity)));
}
function showCommunity(id){selectedCommunity=id;if(mode==='overview')view.setFocus(id);else updateGraph();document.querySelectorAll('.community-row').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.id===id)));const g=data.communities.find(x=>x.id===id),box=$('detail');box.replaceChildren();const top=document.createElement('div');top.className='detail-top';top.append(title(`社区 ${id} · ${fmt(g.size)} 个节点`),button('查看社区内部网络',()=>{mode='network';updateGraph()}));box.append(top);
  const stats=document.createElement('div');stats.className='detail-stats';stats.textContent=`内部连接 ${fmt(g.internal_edges)}　跨社区连接 ${fmt(g.external_edges)}　边界占比 ${pct(g.boundary_ratio)}`;box.append(stats,paragraph('边界占比 = 跨社区连接数 ÷（2 × 内部连接数 + 跨社区连接数）。越低表示该群体与外部的联系相对越少。'),paragraph(Object.entries(g.types).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`${t} ${n}`).join(' / ')));
  const h=document.createElement('h3');h.textContent='连接较多的节点';box.append(h);const list=document.createElement('div');list.className='neighbors';data.nodes.filter(n=>n.community===id).sort((a,b)=>b.degree-a.degree).slice(0,15).forEach(n=>list.append(button(`${n.id} · ${n.type} · ${n.degree} 条连接`,()=>showNode(n.id))));box.append(list);
}
function showNode(id){const n=data.nodes.find(x=>x.id===id);if(mode!=='network'||(selectedCommunity&&selectedCommunity!==n.community)){mode='network';selectedCommunity=n.community;updateGraph()}view.setFocus(id);const box=$('detail');box.replaceChildren(title(`节点 ${id} · ${n.type}`),paragraph(`属于社区 ${n.community}，共有 ${n.degree} 个相邻节点。`));box.append(button(`返回社区 ${n.community}`,()=>showCommunity(n.community)));
  const links=data.links.filter(e=>e.source===id||e.target===id),h=document.createElement('h3');h.textContent='相邻节点与关系';box.append(h);const list=document.createElement('div');list.className='neighbors';for(const e of links){const other=data.nodes.find(x=>x.id===(e.source===id?e.target:e.source));const b=button(`${other.id} · 社区 ${other.community}${other.community!==n.community?' · 跨社区':''}`,()=>showNode(other.id));b.title=e.relations.map(r=>`${r.source} → ${r.target} / ${r.relation}`).join('\n');list.append(b)}box.append(list);const details=document.createElement('details');const summary=document.createElement('summary');summary.textContent='原始节点属性与关系记录';details.append(summary);const pre=document.createElement('pre');pre.className='attributes';pre.textContent=JSON.stringify({attributes:n.attributes,relations:links.flatMap(e=>e.relations)},null,2);details.append(pre);box.append(details);
}
async function start(){try{const response=await fetch('analysis.json');if(!response.ok)throw Error(`接口返回 ${response.status}`);data=await response.json();data.communities.sort((a,b)=>a.id-b.id);const s=data.summary;
  $('status').hidden=true;$('workspace').hidden=false;
  for(const [n,label] of [[fmt(s.node_count),'节点'],[fmt(s.edge_count),'连接'],[s.community_count,'社区'],[s.modularity.toFixed(3),'模块度'],[pct(s.internal_ratio),'内部连接占比']]){const span=document.createElement('span'),strong=document.createElement('strong');strong.textContent=n;span.append(strong,label);$('summary').append(span)}
  view=new NetworkView($('graph'),color,n=>mode==='overview'?showCommunity(n.id):showNode(n.id));view.resize();updateGraph();
  for(const g of data.communities){const b=button('',()=>showCommunity(g.id),'community-row');b.dataset.id=g.id;b.setAttribute('aria-pressed','false');const dot=document.createElement('span');dot.className='swatch';dot.style.background=color(g.id);const label=document.createElement('span');label.textContent=`社区 ${g.id}`;const size=document.createElement('small');size.textContent=`${g.size} 节点`;b.append(dot,label,size);$('communities').append(b)}
  $('overview').onclick=()=>{mode='overview';updateGraph()};$('network').onclick=()=>{mode='network';updateGraph()};$('all').onclick=()=>{selectedCommunity=null;updateGraph();$('detail').replaceChildren(title('查看全部社区'),paragraph('点击社区列表或图中的节点，查看详细信息。'))};$('pause').onclick=()=>{$('pause').textContent=view.togglePause()?'继续布局':'暂停布局'};$('reset').onclick=()=>view.fit();$('zoom-in').onclick=()=>view.scale(1.4);$('zoom-out').onclick=()=>view.scale(1/1.4);
  $('search').addEventListener('input',()=>{const q=$('search').value.trim().toLowerCase(),results=$('search-results');results.replaceChildren();if(!q)return;const matches=data.nodes.filter(n=>n.id.toLowerCase().includes(q)||n.type.toLowerCase().includes(q));results.append(paragraph(`找到 ${matches.length} 个，显示前 30 个`));for(const n of matches.slice(0,30))results.append(button(`${n.id} · ${n.type} · 社区 ${n.community}`,()=>showNode(n.id)))});
  const best=[...data.communities].sort((a,b)=>a.boundary_ratio-b.boundary_ratio)[0],weak=[...data.communities].sort((a,b)=>b.boundary_ratio-a.boundary_ratio)[0];
  for(const [heading,body] of [['整体上，连接更集中在社区内部',`共 ${fmt(s.edge_count)} 条计算边，其中 ${fmt(s.internal_edges)} 条在社区内部，占 ${pct(s.internal_ratio)}；模块度为 ${s.modularity.toFixed(4)}。相比保留节点度的随机基准，这种划分呈现明显的群体结构。`],['划分较清晰的地方',`社区 ${best.id} 有 ${best.size} 个节点，${best.internal_edges} 条内部连接、${best.external_edges} 条外部连接，边界占比仅 ${pct(best.boundary_ratio)}。它与其他社区连接相对少，结构边界较清楚。`],['需要谨慎解释的地方',`社区 ${weak.id} 的边界占比为 ${pct(weak.boundary_ratio)}（${weak.internal_edges} 条内部、${weak.external_edges} 条外部连接），边界相对模糊。共享域名、IP 或联系人等关系可能把不同群体连在一起，但仅凭结构无法确认现实归属。`],['这不是唯一的正确答案','数据没有真实社区标签，不能计算划分准确率。Louvain 是启发式算法；随机种子、分辨率及关系建模会影响结果。无权处理把不同类型关系看作同等连接，模块度也可能合并小群体。']]){const h=document.createElement('h3');h.textContent=heading;$('findings').append(h,paragraph(body))}
  data.summary.levels.forEach((level,i)=>{const row=document.createElement('div');row.className='level';row.textContent=`第 ${i+1} 层：${level.communities} 个社区　Q = ${level.modularity.toFixed(4)}`;$('levels').append(row)});
  $('policy').textContent=`${data.processing.raw_links} 条原始记录合并为 ${s.edge_count} 条计算边（合并 ${data.processing.merged_records} 条重复端点记录，排除 ${data.processing.self_loops_excluded} 条自环）。${data.processing.policy} 网络包含 ${s.components} 个连通分量。igraph ${s.version}。`;
}catch(error){$('workspace').hidden=true;$('status').hidden=false;$('status').className='error';$('status').replaceChildren(paragraph(`加载失败：${error.message}。请确认 Python 服务正在运行。`),button('重新加载',()=>location.reload()))}}
start();
