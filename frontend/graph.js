/* 只负责布局与绘制；不读取文件、不检测社区。 */
export class NetworkView {
  constructor(canvas, color, select) {
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.color=color;this.select=select;
    this.nodes=[];this.links=[];this.transform=d3.zoomIdentity;this.paused=false;this.focus=null;
    this.zoom=d3.zoom().scaleExtent([.1,8]).on('zoom',e=>{if(e.sourceEvent)this.userMoved=true;this.transform=e.transform;this.draw()});
    d3.select(canvas).call(this.zoom).on('dblclick.zoom',null);
    canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect(), [x,y]=this.transform.invert([e.clientX-r.left,e.clientY-r.top]);let best=null,dist=Infinity;for(const n of this.nodes){const d=Math.hypot(n.x-x,n.y-y);if(d<Math.max(this.radius(n),8/this.transform.k)&&d<dist){best=n;dist=d}}if(best)this.select(best)});
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas.parentElement);
  }
  radius(n){return this.mode==='overview'?10+Math.sqrt(n.size)*1.6:2.7+Math.sqrt(n.degree)*.65}
  resize(){this.w=this.canvas.clientWidth;this.h=this.canvas.clientHeight;const d=devicePixelRatio||1;this.canvas.width=this.w*d;this.canvas.height=this.h*d;if(this.nodes.length)this.fit();else this.draw()}
  setData(nodes,links,mode){
    this.simulation?.stop();this.userMoved=false;this.mode=mode;this.nodes=nodes.map(n=>({...n}));const ids=new Set(this.nodes.map(n=>n.id));this.links=links.filter(e=>ids.has(e.source)&&ids.has(e.target)).map(e=>({...e}));
    this.simulation=d3.forceSimulation(this.nodes).randomSource(d3.randomLcg(.42)).force('link',d3.forceLink(this.links).id(n=>n.id).distance(mode==='overview'?130:28).strength(mode==='overview'?.2:.25)).force('charge',d3.forceManyBody().strength(mode==='overview'?-450:-19)).force('center',d3.forceCenter(0,0)).force('collision',d3.forceCollide(n=>this.radius(n)+2)).on('tick',()=>this.draw()).on('end',()=>{if(!this.userMoved)this.fit()});
    this.simulation.stop();for(let i=0;i<90;i++)this.simulation.tick();this.fit();
    if(!this.paused&&!matchMedia('(prefers-reduced-motion: reduce)').matches)this.simulation.restart();
  }
  setFocus(id){this.focus=id;this.draw()}
  fit(){if(!this.nodes.length)return;const minX=d3.min(this.nodes,n=>n.x-this.radius(n)),maxX=d3.max(this.nodes,n=>n.x+this.radius(n)),minY=d3.min(this.nodes,n=>n.y-this.radius(n)),maxY=d3.max(this.nodes,n=>n.y+this.radius(n));const k=Math.min(2,(this.w-65)/(maxX-minX||1),(this.h-120)/(maxY-minY||1));d3.select(this.canvas).call(this.zoom.transform,d3.zoomIdentity.translate(this.w/2,this.h/2+15).scale(k).translate(-(minX+maxX)/2,-(minY+maxY)/2))}
  togglePause(){this.paused=!this.paused;if(this.paused)this.simulation?.stop();else this.simulation?.alpha(.15).restart();return this.paused}
  scale(k){this.userMoved=true;d3.select(this.canvas).call(this.zoom.scaleBy,k)}
  draw(){if(!this.w)return;const c=this.ctx,d=devicePixelRatio||1,t=this.transform;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,this.w,this.h);c.translate(t.x,t.y);c.scale(t.k,t.k);
    for(const e of this.links){const active=this.focus==null||e.source.id===this.focus||e.target.id===this.focus;c.globalAlpha=active?(this.mode==='overview'?.45:.22):.04;c.strokeStyle='#7890a9';c.lineWidth=(this.mode==='overview'?Math.min(7,.5+Math.sqrt(e.count)*.45):.7)/Math.sqrt(t.k);c.beginPath();c.moveTo(e.source.x,e.source.y);c.lineTo(e.target.x,e.target.y);c.stroke()}
    for(const n of this.nodes){c.globalAlpha=this.focus==null||this.focus===n.id?1:.3;c.fillStyle=this.color(this.mode==='overview'?n.id:n.community);c.beginPath();c.arc(n.x,n.y,this.radius(n),0,Math.PI*2);c.fill();if(n.id===this.focus){c.strokeStyle='#172b45';c.lineWidth=2/t.k;c.stroke()}}
    c.globalAlpha=1;const labels=[];for(const n of [...this.nodes].sort((a,b)=>(b.id===this.focus)-(a.id===this.focus))){if(this.mode!=='overview'&&n.id!==this.focus)continue;const x=n.x,y=n.y+this.radius(n)+14/t.k;const sx=x*t.k,sy=y*t.k;if(n.id!==this.focus&&labels.some(p=>Math.abs(p[0]-sx)<48&&Math.abs(p[1]-sy)<15))continue;labels.push([sx,sy]);c.font=`600 ${12/t.k}px sans-serif`;c.textAlign='center';c.strokeStyle='#fff';c.lineWidth=3/t.k;c.strokeText(this.mode==='overview'?`社区 ${n.id}`:`节点 ${n.id}`,x,y);c.fillStyle='#172b45';c.fillText(this.mode==='overview'?`社区 ${n.id}`:`节点 ${n.id}`,x,y)}c.globalAlpha=1;
  }
}
