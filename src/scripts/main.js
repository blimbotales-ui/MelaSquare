import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas=document.querySelector('#scene');
const welcome=document.querySelector('#welcome');
const hud=document.querySelector('#hud');
const joyEl=document.querySelector('#joy');
const stick=document.querySelector('#stick');
const scene=new THREE.Scene();
scene.background=new THREE.Color('#9bd8e8');
scene.fog=new THREE.Fog('#9bd8e8',38,105);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,180);
camera.position.set(13,13,17);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.15;

scene.add(new THREE.HemisphereLight('#e8f7ff','#66845b',2.1));
const sun=new THREE.DirectionalLight('#fff0cf',3.1);
sun.position.set(-15,25,12);sun.castShadow=true;
sun.shadow.mapSize.set(1536,1536);
sun.shadow.camera.left=-35;sun.shadow.camera.right=35;sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;
sun.shadow.bias=-.0003;scene.add(sun);

const mat=(color,roughness=.78,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const M={grass:mat('#77b96d'),grass2:mat('#8bc978'),path:mat('#e8d7b4'),stone:mat('#b6a98e'),cream:mat('#fff0cf'),wood:mat('#98613f'),darkwood:mat('#62402f'),blue:mat('#277bd0'),purple:mat('#9c6bc4'),pink:mat('#e98ab0'),gold:mat('#f4c75e'),leaf:mat('#398b59'),leaf2:mat('#62ae67'),water:mat('#55c9d0',.2,.15)};
function mesh(geo,material,x,y,z,parent=scene){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function cube(x,y,z,sx,sy,sz,material,parent=scene){return mesh(new THREE.BoxGeometry(sx,sy,sz),material,x,y,z,parent)}
function sphere(x,y,z,sx,sy,sz,material,parent=scene){const o=mesh(new THREE.SphereGeometry(1,20,16),material,x,y,z,parent);o.scale.set(sx,sy,sz);return o}
function cylinder(x,y,z,rt,rb,h,material,parent=scene,n=12){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),material,x,y,z,parent)}
function ground(){
 cube(0,-.35,0,100,.6,100,M.grass);
 cube(0,-.02,0,12,.12,66,M.path);cube(0,-.01,0,66,.12,12,M.path);
 cube(0,.01,0,29,.14,29,M.stone);
 for(let x=-13;x<=13;x+=2)for(let z=-13;z<=13;z+=2){
  if(Math.abs(x)<6&&Math.abs(z)<6)continue;
  const tile=cube(x,.09,z,1.92,.035,1.92,mat((Math.abs(x+z)%4<1)?'#e8d9bc':'#dfcfad'));
 }
 // flower beds and plaza edging
 for(const [x,z] of [[-15,-15],[15,-15],[-15,15],[15,15]]){cube(x,.12,z,5,.25,5,mat('#b58c64'));cube(x,.27,z,4.7,.12,4.7,M.grass2);for(let i=0;i<12;i++){const a=i*Math.PI/6;flower(x+Math.cos(a)*1.7,z+Math.sin(a)*1.7)}}
}
function flower(x,z){cylinder(x,.48,z,.07,.07,.5,M.leaf);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;sphere(x+Math.cos(a)*.15,.7,z+Math.sin(a)*.15,.12,.1,.12,M.pink)}sphere(x,.72,z,.09,.09,.09,M.gold)}
function tree(x,z,s=1){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 cylinder(0,1.15,0,.22*s,.3*s,2.3*s,M.wood,g,10);
 sphere(0,2.7*s,0,1.15*s,1.25*s,1.1*s,M.leaf2,g);
 sphere(-.65*s,2.45*s,.1, .75*s,.85*s,.75*s,M.leaf,g);
 sphere(.65*s,2.5*s,-.1,.72*s,.82*s,.72*s,M.leaf,g);
}
function house(x,z,name,wall,roof){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 cube(0,1.45,0,7,3,6,mat(wall),g);
 cube(0,2.98,0,7.3,.22,6.3,M.cream,g);
 const r=mesh(new THREE.ConeGeometry(5.1,2.8,4),mat(roof),0,4.1,0,g);r.rotation.y=Math.PI/4;
 cube(0,1.15,3.04,1.25,2.3,.16,M.darkwood,g);
 for(const wx of [-2.25,2.25]){cube(wx,1.9,3.08,1.15,1.05,.13,mat('#9be0e6'),g);cube(wx,1.9,3.16,1.24,.12,.08,M.cream,g);cube(wx,1.9,3.16,.12,1.15,.08,M.cream,g)}
 const sign=cube(0,3.35,3.18,3.5,.65,.18,M.gold,g);
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const cx=canvas.getContext('2d');cx.fillStyle='#fff2cc';cx.font='bold 58px system-ui';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(name,256,66);
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
 const board=mesh(new THREE.PlaneGeometry(3.3,.52),new THREE.MeshBasicMaterial({map:tex,transparent:true}),0,3.35,3.29,g);
}
function fountain(){
 const g=new THREE.Group();scene.add(g);
 cylinder(0,.3,0,3.2,3.2,.55,mat('#c8b99a'),g,48);
 cylinder(0,.63,0,2.65,2.65,.16,M.water,g,48);
 cylinder(0,1.15,0,.32,.42,1.05,mat('#e7d3a8'),g,20);
 cylinder(0,1.7,0,1.25,.35,.28,mat('#c6a46f'),g,32);
 cylinder(0,1.84,0,1.08,1.08,.08,M.water,g,32);
 cylinder(0,2.35,0,.16,.22,.95,mat('#e7d3a8'),g,16);
 sphere(0,2.9,0,.32,.42,.32,M.water,g);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;const s=sphere(Math.cos(a)*2.25,.88,Math.sin(a)*2.25,.1,.28,.1,M.gold,g);s.rotation.z=.25}
}
function bench(x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;scene.add(g);cube(0,.65,0,2.2,.18,.65,M.wood,g);cube(0,1.02,-.25,2.2,.75,.16,M.wood,g);for(const xx of [-.8,.8])cube(xx,.32,0,.15,.65,.15,M.darkwood,g)}
function lamp(x,z){cylinder(x,1.5,z,.09,.12,3,mat('#394c51'));sphere(x,3.12,z,.32,.36,.32,M.gold);const l=new THREE.PointLight('#ffe5a1',.5,7);l.position.set(x,3,z);scene.add(l)}

function marketStall(x,z,accent){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 cube(0,.72,0,2.7,.16,1.8,M.wood,g);
 for(const sx of [-1.15,1.15])for(const sz of [-.68,.68])cube(sx,1.35,sz,.12,1.35,.12,M.darkwood,g);
 cube(0,2.05,0,3,.16,2.1,mat(accent),g);
 for(let i=0;i<6;i++){const stripe=cube(-1.25+i*.5,1.94,0,.24,.12,2.05,i%2?M.cream:mat(accent),g)}
 for(let i=0;i<5;i++){const fruit=sphere(-.9+i*.45,.98,.1,.2,.2,.2,[mat('#e85d48'),mat('#f4c34f'),mat('#71b75d')][i%3],g);fruit.rotation.z=i*.3}
}
function bunting(){
 const colors=['#ef806c','#f4c75e','#75c6b3','#a77ed0'];
 for(const z of [-7,7]){for(let i=0;i<9;i++){const x=-9+i*2.25;const flag=mesh(new THREE.ConeGeometry(.42,.65,3),mat(colors[i%4]),x,5.5,z);flag.rotation.z=Math.PI;flag.rotation.y=Math.PI/2}}
}
function arch(){
 const g=new THREE.Group();g.position.set(0,0,-25);scene.add(g);
 cube(-5,2,0,.45,4,.45,M.wood,g);cube(5,2,0,.45,4,.45,M.wood,g);cube(0,4,0,10.5,.5,.65,mat('#d7a65e'),g);
 for(let i=0;i<7;i++){const flag=mesh(new THREE.ConeGeometry(.36,.72,3),mat(['#e87868','#f2c45e','#79bca6'][i%3]),-4.5+i*1.5,3.4,.05,g);flag.rotation.z=Math.PI}
 const board=cube(0,4.9,.05,5,.85,.35,mat('#426c5d'),g);
 const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#fff0c9';ctx.font='bold 60px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('MELASQUARE',256,65);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;mesh(new THREE.PlaneGeometry(4.8,.72),new THREE.MeshBasicMaterial({map:tex}),0,4.9,.24,g);
}
function lowPolyRocks(x,z){
 for(let i=0;i<4;i++){const rock=mesh(new THREE.DodecahedronGeometry(.45+((i*7)%3)*.12,0),mat(i%2?'#b9a88b':'#9e987c'),x+(i-1.5)*.55,.35,z+Math.sin(i)*.3);rock.rotation.set(i*.4,i*.8,i*.2)}
}


function makeKeepsake(x,z,index){
 const g=new THREE.Group();g.position.set(x,1.05,z);scene.add(g);
 const crystal=mesh(new THREE.OctahedronGeometry(.48,0),mat('#ffe27a',.22,.18),0,0,0,g);
 crystal.rotation.y=Math.PI/4;
 sphere(0,0,0,.16,.16,.16,mat('#fff9d7',.15,.1),g);
 const halo=mesh(new THREE.TorusGeometry(.72,.035,8,32),mat('#f7ce65',.3,.2),0,-.32,0,g);halo.rotation.x=Math.PI/2;
 g.userData={baseY:1.05,index,crystal};return g;
}

function buildWorld(){
 ground();fountain();arch();bunting();
 house(-13,-14,'MARKET','#f2b878','#d96c52');house(13,-14,'ART HOUSE','#a6c9c2','#547e85');
 house(-13,14,'CAFE','#e9a58b','#bd7059');house(13,14,'GARDEN','#a5cb86','#5b955d');
 for(const [x,z,s] of [[-23,-20,1.1],[23,-20,1.1],[-23,20,1],[23,20,1],[-28,0,.9],[28,0,.9],[0,-29,1.2],[0,29,1.2],[-9,-25,.8],[9,25,.8]])tree(x,z,s);
 for(const [x,z] of [[-5,-8],[5,-8],[-5,8],[5,8],[-18,0],[18,0],[0,-23],[0,23]])lamp(x,z);
 bench(-5,4,.3);bench(5,-4,Math.PI+.3);
 marketStall(-8,-9,'#e9a34d');marketStall(8,9,'#d87c9e');
 lowPolyRocks(-26,11);lowPolyRocks(26,-11);
 // decorative market awnings
 for(const [x,z,col] of [[-20,-8,'#f3bd61'],[20,8,'#e88fb0']]){cube(x,1.7,z,4,.16,2.4,mat(col));for(let i=0;i<4;i++)cube(x-1.5+i,1.35,z, .08,.65,2.4,M.cream)}
 for(let i=0;i<28;i++){const a=i/28*Math.PI*2;const x=Math.cos(a)*5.6,z=Math.sin(a)*5.6;sphere(x, .22,z,.12,.12,.12,M.gold)}
}
function makeCharacter(kind,x,z,scale=1){
 const root=new THREE.Group();root.position.set(x,0,z);root.scale.setScalar(scale);scene.add(root);
 const blue=mat('#2788e8',.35),blueDark=mat('#1553a8'),skin=mat(kind==='curly'?'#a77acb':kind==='orange'?'#ff8054':kind==='lilac'?'#c28bd9':'#3998ee',.36),dark=mat('#211b36',.3),white=mat('#fff8ed',.3),pink=mat('#f58fc4',.4);
 const limbs=[];
 const body=sphere(0,1.02,0,.58,.57,.43,skin,root);
 const head=sphere(0,2.05,0,.83,.78,.67,skin,root);
 // glossy cheeks
 sphere(-.57,1.9,.48,.18,.12,.08,pink,root);sphere(.57,1.9,.48,.18,.12,.08,pink,root);
 for(const ex of [-.27,.27]){sphere(ex,2.12,.59,.2,.24,.1,white,root);sphere(ex+.035,2.1,.685,.105,.14,.055,dark,root);sphere(ex+.005,2.17,.73,.045,.05,.025,white,root)}
 // brows, smile
 for(const ex of [-.27,.27]){const brow=cube(ex,2.47,.59,.36,.09,.09,dark,root);brow.rotation.z=ex<0?-.18:.18}
 const smile=mesh(new THREE.TorusGeometry(.19,.045,8,24,Math.PI),dark,0,1.82,.61,root);smile.rotation.z=Math.PI;
 // arms and feet
 for(const side of [-1,1]){const arm=mesh(new THREE.CapsuleGeometry(.12,.48,4,8),skin,side*.69,1.12,0,root);arm.rotation.z=side*.65;limbs.push({mesh:arm,side,part:'arm'});const foot=sphere(side*.27,.28,.08,.2,.28,.28,kind==='orange'?M.gold:blueDark,root);foot.rotation.z=side*.12;limbs.push({mesh:foot,side,part:'foot'})}
 if(kind==='crown'){
  sphere(0,2.79,0,.42,.18,.38,M.gold,root);
  const crown=mesh(new THREE.ConeGeometry(.48,.58,5),mat('#16b5a6',.3,.1),0,3.1,0,root);crown.rotation.y=.3;
  sphere(0,3.42,.02,.12,.12,.12,M.gold,root);
 }else if(kind==='curly'){
  for(let i=0;i<19;i++){const a=i/19*Math.PI*2;const xx=Math.cos(a)*.72,yy=2.22+Math.sin(a)*.62;sphere(xx,yy,Math.sin(a)*.35,.19,.2,.19,mat('#21162e',.25),root)}
  sphere(0,2.8,-.08,.42,.16,.38,mat('#2a1b36'),root);
 }else if(kind==='orange'){
  sphere(-.75,2.35,0,.27,.35,.22,skin,root);sphere(.75,2.35,0,.27,.35,.22,skin,root);
  const trunk=mesh(new THREE.CapsuleGeometry(.17,.5,4,8),skin,0,1.85,.68,root);trunk.rotation.x=-.55;
 }else{
  cube(0,2.76,0,1.05,.22,.82,mat('#9e75cb'),root);
  for(let i=0;i<3;i++)sphere(-.2+i*.2,2.9,.05,.08,.08,.08,M.cream,root);
 }
 root.userData.phase=Math.random()*6;root.userData.kind=kind;root.userData.limbs=limbs;root.userData.body=body;return root;
}
buildWorld();
const player=makeCharacter('crown',0,10,.82);
const npcs=[makeCharacter('curly',-5,-5,.95),makeCharacter('orange',5,-5,1),makeCharacter('lilac',-5,5,.9)];
npcs.forEach((n,i)=>{n.userData.home=n.position.clone();n.userData.wander=i%2===0?1:0});
const keepsakes=[[-8,0],[8,0],[0,-10],[-10,10],[-20,0],[20,0],[0,23]].map((p,i)=>makeKeepsake(p[0],p[1],i));
let foundKeepsakes=0;
const gemCount=document.querySelector('#gemCount');
const questText=document.querySelector('#questText');
const townText=document.querySelector('#townText');
const discoveredShops=new Set();
const shopSpots=[{name:'The Market',x:-13,z:-9,desc:'Fresh fruit, festival treats and little treasures are waiting inside.'},{name:'Art House',x:13,z:-9,desc:'Meet local makers and discover colorful art from around MelaSquare.'},{name:'Café',x:-13,z:19,desc:'Take a break with a warm drink and something sweet.'},{name:'Garden Shop',x:13,z:19,desc:'Pick out flowers, seeds and cheerful plants for your home.'}];
const interact=document.querySelector('#interact');const interactTitle=document.querySelector('#interactTitle');const interactText=document.querySelector('#interactText');let nearby=null;
const keys={};let joy={x:0,y:0},active=false,last=0,yaw=.65,drag=null;
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5))}
addEventListener('resize',resize);
function moveJoy(e){const r=joyEl.getBoundingClientRect();let dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,l=Math.hypot(dx,dy),m=35;if(l>m){dx=dx/l*m;dy=dy/l*m}joy.x=dx/m;joy.y=dy/m;stick.style.transform='translate('+dx+'px,'+dy+'px)'}
joyEl.addEventListener('pointerdown',e=>{joyEl.setPointerCapture(e.pointerId);moveJoy(e)});joyEl.addEventListener('pointermove',e=>{if(e.buttons)moveJoy(e)});
function resetJoy(){joy.x=joy.y=0;stick.style.transform=''}joyEl.addEventListener('pointerup',resetJoy);joyEl.addEventListener('pointercancel',resetJoy);
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key.startsWith('Arrow'))e.preventDefault();if(e.key.toLowerCase()==='e')doInteract()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
function doInteract(){if(!nearby)return;interactTitle.textContent=nearby.name;interactText.textContent=nearby.desc;interact.classList.remove('hidden')}
document.querySelector('#interactClose').addEventListener('click',()=>interact.classList.add('hidden'));document.querySelector('#interactAction').addEventListener('click',()=>{if(!nearby)return;if(nearby.type==='shop'){const details={'The Market':'Market preview: fruit baskets, festival snacks and handmade keepsakes.','Art House':'Art House preview: colorful paintings, pottery and local crafts.','Café':'Café preview: cozy tables, pastries and refreshing drinks.','Garden Shop':'Garden preview: seed packets, potted flowers and garden decorations.'};interactText.textContent=details[nearby.name]||nearby.desc;document.querySelector('#interactAction').textContent='Looking around…';}else{const chats=['Mira: I heard there are seven glowing keepsakes hidden around the plaza!','Rolo: Follow the little paths between the shops to explore.','Lumi: Look near the gardens and fountain for something sparkling!'];interactText.textContent=chats[nearby.npc]||nearby.desc;document.querySelector('#interactAction').textContent='Nice!';}});
canvas.addEventListener('pointerdown',e=>{if(active){drag={x:e.clientX,y:e.clientY,yaw};canvas.setPointerCapture(e.pointerId)}});
canvas.addEventListener('pointermove',e=>{if(drag)yaw=drag.yaw-(e.clientX-drag.x)*.006});
canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);
document.querySelector('#enter').addEventListener('click',()=>{active=true;welcome.classList.add('hidden');hud.classList.remove('hidden')});
const clock=new THREE.Clock();
function animate(t){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);if(active){
 let ix=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x;
 let iz=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+joy.y;
 const len=Math.hypot(ix,iz);const walking=len>.08;if(walking){ix/=len;iz/=len;const dx=ix*Math.cos(yaw)-iz*Math.sin(yaw),dz=ix*Math.sin(yaw)+iz*Math.cos(yaw);player.position.x=THREE.MathUtils.clamp(player.position.x+dx*dt*6,-31,31);player.position.z=THREE.MathUtils.clamp(player.position.z+dz*dt*6,-31,31);player.rotation.y=Math.atan2(dx,dz);player.position.y=Math.abs(Math.sin(t*.012))*.08}
 const phase=t*.012;

 keepsakes.forEach((g,i)=>{
  if(!g.visible)return;
  g.rotation.y=t*.0015+i*.7;
  g.position.y=g.userData.baseY+Math.sin(t*.002+i)*.18;
  g.userData.crystal.rotation.x=Math.sin(t*.001+i)*.2;
  if(player.position.distanceTo(g.position)<1.35){
   g.visible=false;foundKeepsakes++;gemCount.textContent=foundKeepsakes;
   const remaining=7-foundKeepsakes;
   questText.textContent=remaining===0?'All 7 keepsakes found! Festival hunt complete!':remaining+' more keepsake'+(remaining===1?'':'s')+' to discover around town.';
  }
 });

 npcs.forEach((n,i)=>{const home=n.userData.home;const tx=home.x+Math.sin(t*.00035+i*2)*1.1,tz=home.z+Math.cos(t*.0003+i*2)*.8;n.position.x+=(tx-n.position.x)*dt*.22;n.position.z+=(tz-n.position.z)*dt*.22;n.rotation.y=Math.atan2(Math.cos(t*.00035+i*2),-Math.sin(t*.0003+i*2))});
 [...npcs,player].forEach((ch,i)=>{const moving=ch===player&&walking;ch.position.y+=(moving?Math.abs(Math.sin(phase))*.07:Math.sin(t*.002+ch.userData.phase)*.025)-ch.position.y*.12;ch.userData.limbs?.forEach(l=>{const swing=moving?Math.sin(phase+(l.part==='arm'?Math.PI:0))*.55:Math.sin(t*.002+ch.userData.phase)*.035;l.mesh.rotation.x=l.part==='arm'?swing:0;l.mesh.rotation.z=l.part==='arm'?l.side*(.55+swing*.35):l.side*.08});if(ch.userData.body)ch.userData.body.scale.y=.57+(moving?Math.sin(phase*2)*.025:Math.sin(t*.002+ch.userData.phase)*.012)});
 let candidate=null,best=999;for(const s of shopSpots){const d=Math.hypot(player.position.x-s.x,player.position.z-s.z);if(d<5&&d<best){best=d;candidate={name:s.name,desc:s.desc,type:'shop',shop:s}}}npcs.forEach((n,i)=>{const d=player.position.distanceTo(n.position);if(d<2.7&&d<best){best=d;candidate={name:['Mira','Rolo','Lumi'][i],desc:['Hi! Welcome to MelaSquare. Want to explore the town together?','Hey there! The plaza is full of little surprises.','Hello, traveler! The garden is my favorite place.'][i],type:'npc',npc:i}}});nearby=candidate;if(candidate&&candidate.type==='shop'&&!discoveredShops.has(candidate.shop.name)){discoveredShops.add(candidate.shop.name);townText.textContent='Shops discovered: '+discoveredShops.size+'/4';}interact.classList.toggle('hidden',!nearby);if(nearby){interactTitle.textContent=nearby.name;interactText.textContent=nearby.desc;document.querySelector('#interactAction').textContent=nearby.type==='shop'?'Explore shop':'Chat'}
}
const target=new THREE.Vector3(player.position.x,1.1,player.position.z);
const offset=new THREE.Vector3(Math.sin(yaw)*16,12,Math.cos(yaw)*16);
camera.position.lerp(target.clone().add(offset),.07);camera.lookAt(target);

renderer.render(scene,camera)}
requestAnimationFrame(animate);
window.addEventListener('error',e=>{console.error('MelaSquare 3D:',e.message)});
