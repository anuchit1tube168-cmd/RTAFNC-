import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { useLabStore, type ObjectId } from './store';

const objects:{id:ObjectId;label:string;position:[number,number,number];color:string;size:[number,number,number]}[]=[
  {id:'handrub',label:'Alcohol Hand Rub',position:[-2.6,1.15,-1.8],color:'#63d4ff',size:[.35,.7,.3]},
  {id:'patient-id',label:'Patient ID',position:[0,1.45,-.3],color:'#f6d365',size:[.7,.18,.05]},
  {id:'thermometer',label:'Thermometer',position:[2.45,.9,-1.2],color:'#ef476f',size:[.15,.55,.15]},
  {id:'bp-cuff',label:'BP Cuff',position:[2.15,.75,-.25],color:'#5c7cfa',size:[.7,.3,.45]},
  {id:'oximeter',label:'Pulse Oximeter',position:[1.7,.85,.55],color:'#22c55e',size:[.35,.22,.28]},
  {id:'stethoscope',label:'Stethoscope',position:[2.55,.7,.4],color:'#222831',size:[.5,.12,.5]},
  {id:'chart',label:'Worksheet',position:[-2.2,.75,.8],color:'#f8fafc',size:[.8,.08,.55]},
];

function InteractiveObject({id,label,position,color,size}:{id:ObjectId;label:string;position:[number,number,number];color:string;size:[number,number,number]}){
  const selected=useLabStore(s=>s.selected===id); const completed=useLabStore(s=>s.completed.includes(id)); const select=useLabStore(s=>s.select); const perform=useLabStore(s=>s.perform);
  const [hover,setHover]=useState(false);
  return <group position={position}>
    <mesh castShadow receiveShadow scale={hover?1.08:1} onPointerOver={e=>{e.stopPropagation();setHover(true)}} onPointerOut={()=>setHover(false)} onClick={e=>{e.stopPropagation();select(id)}} onDoubleClick={e=>{e.stopPropagation();perform(id)}}>
      <boxGeometry args={size}/><meshStandardMaterial color={completed?'#2dd4bf':selected?'#fbbf24':color} roughness={.45}/>
    </mesh>
    {(hover||selected)&&<Html position={[0,size[1]/2+.22,0]} center distanceFactor={8}><button className="scene-label" onClick={()=>perform(id)}>{completed?'✓ ':''}{label}<small>คลิกเพื่อเลือก · กดใช้</small></button></Html>}
  </group>
}

function Patient(){
  const state=useLabStore(s=>s.patient.state);
  const body=state==='anxious'?'#d8a07b':'#c98f69';
  return <group position={[0,.15,-.5]}>
    <mesh castShadow position={[0,.55,0]}><boxGeometry args={[1.1,.28,2.2]}/><meshStandardMaterial color="#e8eef6"/></mesh>
    <mesh castShadow position={[0,1.0,-.6]} rotation={[Math.PI/2,0,0]}><capsuleGeometry args={[.32,.9,8,16]}/><meshStandardMaterial color="#8bc4d6"/></mesh>
    <mesh castShadow position={[0,1.25,-1.12]}><sphereGeometry args={[.28,24,24]}/><meshStandardMaterial color={body}/></mesh>
    <mesh position={[-.08,1.31,-1.35]}><sphereGeometry args={[.025,12,12]}/><meshStandardMaterial color="#111"/></mesh>
    <mesh position={[.08,1.31,-1.35]}><sphereGeometry args={[.025,12,12]}/><meshStandardMaterial color="#111"/></mesh>
  </group>
}

function Room(){return <>
  <ambientLight intensity={.7}/><directionalLight position={[5,7,3]} intensity={1.2} castShadow shadow-mapSize={[1024,1024]}/>
  <mesh receiveShadow rotation={[-Math.PI/2,0,0]} position={[0,0,0]}><planeGeometry args={[8,7]}/><meshStandardMaterial color="#cfd8dc"/></mesh>
  <mesh receiveShadow position={[0,1.7,-3.2]}><boxGeometry args={[8,3.4,.12]}/><meshStandardMaterial color="#e8f3f5"/></mesh>
  <mesh receiveShadow position={[-3.9,1.7,0]}><boxGeometry args={[.12,3.4,6.4]}/><meshStandardMaterial color="#e6eff2"/></mesh>
  <mesh position={[0,.35,-.5]}><boxGeometry args={[1.5,.7,2.7]}/><meshStandardMaterial color="#9ca3af"/></mesh>
  <mesh position={[2.2,.38,0]}><boxGeometry args={[1.6,.76,1.35]}/><meshStandardMaterial color="#8b5e3c"/></mesh>
  <mesh position={[-2.2,.38,.7]}><boxGeometry args={[1.6,.76,1.2]}/><meshStandardMaterial color="#64748b"/></mesh>
  <Patient/>{objects.map(o=><InteractiveObject key={o.id}{...o}/>)}</>}

export default function SimulationScene(){
  return <div className="canvas-wrap" aria-label="ฉากจำลอง 3 มิติห้องตรวจสัญญาณชีพ">
    <Canvas shadows dpr={[1,1.5]} camera={{position:[5.6,4.1,6.5],fov:46}} gl={{antialias:true,powerPreference:'high-performance'}}>
      <color attach="background" args={['#b9d8df']}/>
      <fog attach="fog" args={['#b9d8df',8,16]}/>
      <Suspense fallback={null}><Room/></Suspense>
      <OrbitControls makeDefault enablePan enableZoom maxPolarAngle={Math.PI/2.05} minDistance={3.5} maxDistance={11} target={[0,.9,-.4]}/>
    </Canvas>
    <div className="scene-help">ลากเพื่อหมุน 360° · Scroll/Pinch เพื่อ Zoom · คลิกอุปกรณ์ · Double click เพื่อใช้</div>
  </div>
}
