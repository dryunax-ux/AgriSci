export type DigitalNote={title:string;overview:string;explanations:string[];procedure:string[];safety:string[];summary:string[];misconceptions:{claim:string;correction:string}[];oralQuestions:string[];diagramPrompt:string};

const steps=["Observe the example or phenomenon carefully","Identify the important parts, materials, variables or stages","Arrange the parts or stages in a logical order","Explain the relationship using correct vocabulary","Apply the idea to a school, home or community situation","Evaluate the result using evidence and safety considerations"];
const safetyBase=["Follow the teacher-approved procedure and inspect materials before use","Keep tools, heat, chemicals, specimens and electrical equipment under active supervision","Record observations honestly and stop the activity if an unsafe condition appears"];

export function buildDigitalNote(title:string,terms:readonly string[],facts:readonly string[],providedNote?:string):DigitalNote{
 const lower=title.toLowerCase();
 const isProcess=/(making|construct|prepar|clean|graft|preserv|stor|plant|test|investigat|management|control|dry|cook|sew)/.test(lower);
 const isScience=/(atom|cell|wave|mirror|pressure|energy|diffusion|osmosis|element|compound|photosynthesis|nutrition|fire)/.test(lower);
 const overview=providedNote||`${title} is understood by connecting accurate vocabulary, observable evidence and safe application. Learners should be able to describe the concept, recognise its important parts and apply it to a familiar situation.`;
 const explanations=[...facts,`${terms[0]||"The main concept"} should be defined before examples are discussed.`,`${terms[1]||"Evidence"} helps learners justify a conclusion rather than guess.`,`${terms[2]||"Application"} connects the lesson to practical decisions.`].slice(0,6);
 const procedure=isProcess?steps:["State a prediction or prior idea",...steps.slice(0,4),"Write an evidence-based conclusion"];
 const safety=isScience?[...safetyBase,"Use a model or simulation when direct investigation could create unnecessary risk"]:[...safetyBase,"Use resources prudently and maintain hygiene where food, animals, soil or water are involved"];
 const summary=[`Use the terms ${terms.slice(0,3).join(", ")||"from the lesson"} accurately.`,...facts.slice(0,3),"Support every conclusion with an observation, example or reason."].slice(0,5);
 const misconceptions=[{claim:`${title} can be explained correctly without evidence.`,correction:"A strong explanation includes accurate vocabulary and supporting evidence."},{claim:"Every situation requires exactly the same procedure.",correction:"The method should suit the materials, conditions, purpose and safety requirements."},{claim:"Finishing an activity is more important than safe practice.",correction:"Safety, hygiene, responsible resource use and accurate recording are part of the learning outcome."}];
 const oralQuestions=[`What does ${terms[0]||title} mean?`,`Which fact from the notes is most important, and why?`,`What sequence or relationship is shown in the diagram?`,`Which local example demonstrates ${title.toLowerCase()}?`,`What safety or sustainability control should be applied?`];
 return{title,overview,explanations,procedure,safety,summary,misconceptions,oralQuestions,diagramPrompt:`Use the interactive figure to label, sequence or explain ${title.toLowerCase()}.`};
}

export function buildNoteQuestions(title:string,terms:readonly string[],facts:readonly string[]){
 const safeFacts=facts.length?facts:[`${title} requires accurate observation`,`Safe practice supports reliable results`,`Evidence should support the conclusion`];
 return Array.from({length:15},(_,i)=>({prompt:i%3===0?`Which statement from the digital notes is correct about ${title.toLowerCase()}?`:i%3===1?`Which option best applies the lesson notes on ${terms[i%Math.max(1,terms.length)]||title}?`:`Which conclusion is supported by the notes and interactive figure?`,correct:safeFacts[i%safeFacts.length],wrong:["The first guess should be accepted without evidence","Safety and records can be ignored","An unrelated procedure should always be used"]}));
}
