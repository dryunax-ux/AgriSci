"use client";
import { useState } from "react";
export default function TouchLesson({title}:{title:string}){const [show,setShow]=useState(false);return <section className="panel"><h2>Touch-screen challenge</h2><p>Ask a learner to tap and reveal the classroom task for {title}.</p><button onClick={()=>setShow(!show)}>{show?"Hide task":"Reveal task"}</button>{show&&<div className="reveal">In teams: predict, sort key ideas, explain evidence, then apply the concept to a Kenyan context.</div>}</section>}
