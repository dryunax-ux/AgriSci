"use client";

import { useState } from "react";
import VisualLearning from "./VisualLearning";

type Props={terms:readonly string[];facts:readonly string[];title:string};

export default function InteractiveActivity({terms,facts,title}:Props){
 const [selected,setSelected]=useState<number|null>(null);
 const [matched,setMatched]=useState<Record<number,number>>({});
 const [team,setTeam]=useState({A:0,B:0});
 const correct=Object.entries(matched).filter(([key,value])=>Number(key)===value).length;
 return <>
  <VisualLearning title={title} terms={terms} facts={facts}/>
  <section className="panel challenge">
   <span className="kicker">TOUCH MATCHING</span>
   <h2>Match and explain: {title}</h2>
   <p>Tap a key term, then tap the matching explanation. Award a team point only after the learner explains the choice.</p>
   <div className="matchgrid"><div>{terms.map((term,index)=><button key={term} onClick={()=>setSelected(index)} className={selected===index?"match selected":"match"}>{term}</button>)}</div><div>{facts.map((fact,index)=><button key={fact} className={matched[index]===index?"match correct":"match"} onClick={()=>{if(selected!==null){setMatched({...matched,[selected]:index});setSelected(null)}}}>{fact}</button>)}</div></div>
   <p className="scoreline">Correct matches: {correct}/{Math.min(terms.length,facts.length)}</p>
   <div className="teams"><button onClick={()=>setTeam({...team,A:team.A+1})}>Team A +1 ({team.A})</button><button onClick={()=>setTeam({...team,B:team.B+1})}>Team B +1 ({team.B})</button><button onClick={()=>{setMatched({});setSelected(null);setTeam({A:0,B:0})}}>Reset round</button></div>
  </section>
 </>
}
