export type MCQ={id:number;prompt:string;options:readonly string[];answer:number;explanation:string;figure?:string};
export type Structured={q:string;marks:number;scheme:readonly string[];minAnswers?:number;figure?:string};
export type Paper={slug:string;title:string;area:string;code:string;grade:number;mcq:readonly MCQ[];structured:readonly Structured[]};
const q=(id:number,prompt:string,correct:string,wrong:string[],explanation:string,figure?:string):MCQ=>{const answer=id%4;const options=[...wrong.slice(0,3)];options.splice(answer,0,correct);return{id,prompt,options,answer,explanation,figure}};
const topics={
 agri:["soil conservation","water harvesting","crop establishment","animal housing hygiene","food safety","laundry care","vegetable preparation","poultry management","organic manure","agroforestry","crop storage","feed conservation","integrated farming","grafting","solar drying","farm records","pest management","mulching","egg handling","farm tools"],
 sci:["laboratory safety","measurement","acids and bases","separation of mixtures","cells","diffusion and osmosis","reproduction","excretion","energy transformation","electricity","atomic structure","metals and alloys","photosynthesis","digestion","ecosystems","pressure","curved mirrors","waves","water hardness","remote sensing"]
};
const prompts:Record<string,[string,string,string,string]>={
"soil conservation":["Which practice best reduces soil erosion on sloping land?","Contour barriers","Cultivating down the slope","Removing all vegetation"],
"water harvesting":["Which part of a roof-water system removes the first dirty runoff?","First-flush device","Storage lid","Tap"],
"crop establishment":["Which operation replaces seedlings in empty planting stations?","Gap filling","Pruning","Threshing"],
"animal housing hygiene":["Which action best reduces disease in an animal house?","Regular cleaning and disinfection","Allowing manure to accumulate","Sharing dirty drinkers"],
"food safety":["Which action is safest when reusing leftover food?","Reheat thoroughly after safe storage","Taste doubtful food first","Leave food uncovered overnight"],
"laundry care":["What should be done before washing loose-coloured garments?","Sort and test colour fastness","Mix with white clothes","Soak in bleach"],
"vegetable preparation":["Which method helps conserve nutrients in vegetables?","Steam using little water","Boil for a long time","Add baking soda"],
"poultry management":["Which practice limits poultry disease spread?","Quarantine new birds","Mix sick and healthy birds","Use contaminated litter"],
"organic manure":["Which input improves soil organic matter sustainably?","Mature compost","Plastic waste","Excess pesticide"],
"agroforestry":["What is one benefit of planting trees with crops?","Reduces erosion and provides useful products","Eliminates all farm labour","Prevents every pest"],
"crop storage":["Which condition is important before storing grain?","Adequate drying","High moisture","Direct contact with the floor"],
"feed conservation":["Why must forage be dry before baling?","To prevent mould and heating","To increase water content","To encourage rotting"],
"integrated farming":["What makes a farm system integrated?","Outputs of one enterprise support another","Only one enterprise is kept","All waste is discarded"],
"grafting":["Which tissue must align for a successful graft?","Cambium","Bark surface only","Leaf epidermis"],
"solar drying":["Why are sun-dryer vents screened?","To allow airflow while excluding pests","To stop all air movement","To add moisture"],
"farm records":["Why keep farm records?","To support planning and track performance","To increase wastage","To replace observation"],
"pest management":["What should happen before selecting pest control?","Correct identification and monitoring","Immediate unsafe spraying","Ignoring symptoms"],
"mulching":["How does mulch help crops?","Conserves moisture and suppresses weeds","Increases evaporation","Exposes bare soil"],
"egg handling":["Which practice supports clean market eggs?","Use clean nests and grade intact eggs","Store cracked eggs with intact eggs","Wash in dirty water"],
"farm tools":["What is a safe way to carry a sharp farm tool?","Point the sharp end down and maintain distance","Swing it while walking","Leave it hidden in grass"],
"laboratory safety":["What should be done after a chemical splash on skin?","Flush with plenty of running water","Neutralise with an unknown chemical","Cover without washing"],
"measurement":["Which apparatus measures liquid volume?","Measuring cylinder","Test-tube rack","Tripod stand"],
"acids and bases":["What pH describes a neutral solution?","7","2","12"],
"separation of mixtures":["Which method separates an insoluble solid from a liquid?","Filtration","Sublimation","Magnetism only"],
"cells":["Which structure controls movement into and out of a cell?","Cell membrane","Nucleus","Cell wall only"],
"diffusion and osmosis":["Osmosis is movement of...","Water through a partially permeable membrane","Any solid through glass","Heat through metal"],
"reproduction":["Where does human fertilisation normally occur?","Oviduct","Urinary bladder","Large intestine"],
"excretion":["Which organ filters blood and forms urine?","Kidney","Heart","Stomach"],
"energy transformation":["A battery torch mainly changes...","Chemical to electrical to light energy","Sound to chemical energy","Heat to nuclear energy"],
"electricity":["Which practice improves electrical safety?","Use dry hands and intact cables","Overload sockets","Use exposed wires"],
"atomic structure":["Atomic number equals the number of...","Protons","Neutrons plus electrons","Shells"],
"metals and alloys":["Which property allows copper to be drawn into wire?","Ductility","Brittleness","Transparency"],
"photosynthesis":["Which gas is used during photosynthesis?","Carbon dioxide","Oxygen only","Nitrogen only"],
"digestion":["Where are most digested nutrients absorbed?","Small intestine","Oesophagus","Rectum"],
"ecosystems":["What do arrows in a food chain show?","Direction of energy transfer","Direction animals face","Amount of rainfall"],
"pressure":["Pressure equals...","Force divided by area","Area divided by force","Mass times volume"],
"curved mirrors":["Which mirror gives a wide field of view?","Convex mirror","Plane mirror only","Concave mirror at all positions"],
"waves":["Wave speed equals...","Frequency multiplied by wavelength","Amplitude divided by time","Mass multiplied by force"],
"water hardness":["Which method removes temporary hardness?","Boiling","Filtering through cloth","Adding more calcium"],
"remote sensing":["Remote sensing collects information using...","Sensors at a distance","Direct tasting","Only hand lenses"]
};
function buildMCQ(kind:"agri"|"sci",count:number,prefix:string){return Array.from({length:count},(_,i)=>{const t=topics[kind][i%topics[kind].length];const [p,c,w1,w2]=prompts[t];return q(i+1,p,c,[w1,w2,"An unrelated unsafe practice"],`${c}. This is the accepted response for ${t}.`,undefined)})}
function buildStructured(kind:"agri"|"sci",count:number,start:number){return Array.from({length:count},(_,i)=>{const t=topics[kind][(i*2)%topics[kind].length];const [p,c,w1,w2]=prompts[t];const marks=i%4===0?4:3;return{q:`Question ${start+i}: Explain or state ${marks} valid points about ${t} in relation to: ${p}`,marks,minAnswers:marks,scheme:[c,`Define ${t} correctly.`,`State a relevant application of ${t}.`,`Give one safety, hygiene or environmental control for ${t}.`,`Use evidence or an example to justify the response.`]}})}
function paper(slug:string,title:string,area:string,code:string,grade:number,kind:"agri"|"sci",mcqCount:number,structuredCount:number):Paper{return{slug,title,area,code,grade,mcq:buildMCQ(kind,mcqCount,code),structured:buildStructured(kind,structuredCount,mcqCount+1)}}
const exactFigureMap:Record<string,{mcq:Record<number,string>;structured:Record<number,string>}>= {
"grade-7-agriculture":{mcq:{12:"/kjsea/crops/g7-ag-q-tree.jpg"},structured:{0:"/kjsea/crops/g7-ag-q-waste.jpg",4:"/kjsea/crops/g7-ag-q-garden.jpg",6:"/kjsea/crops/g7-ag-q-hutch.jpg"}},
"grade-7-science":{mcq:{1:"/kjsea/crops/g7-sci-q-apparatus.jpg",2:"/kjsea/crops/g7-sci-q-hazard.jpg"},structured:{3:"/kjsea/crops/g7-sci-q-circuit.jpg",9:"/kjsea/crops/g7-sci-q-microscope.jpg"}},
"grade-8-agriculture":{mcq:{5:"/kjsea/crops/g8-ag-q-cooking.jpg"},structured:{1:"/kjsea/crops/g8-ag-q-structure.jpg",4:"/kjsea/crops/g8-ag-q-knit.jpg",7:"/kjsea/crops/g8-ag-q-field.jpg"}},
"grade-8-science":{mcq:{7:"/kjsea/crops/g8-sci-q-hazard.jpg"},structured:{6:"/kjsea/crops/g8-sci-q-distillation.jpg",8:"/kjsea/crops/g8-sci-q-circuit.jpg"}},
"grade-9-agriculture":{mcq:{4:"/kjsea/crops/g9-ag-q-photo1.jpg",14:"/kjsea/crops/g9-ag-q-photo2.jpg"},structured:{2:"/kjsea/crops/g9-ag-q-photo3.jpg",7:"/kjsea/crops/g9-ag-q-photo4.jpg"}},
"grade-9-science":{mcq:{18:"/kjsea/crops/g9-sci-q-hazard.jpg",27:"/kjsea/crops/g9-sci-q-wave.jpg"},structured:{5:"/kjsea/crops/g9-sci-q-graph.jpg",9:"/kjsea/crops/g9-sci-q-activity.jpg"}}};
function attachExactFigures(p:Paper):Paper{const m=exactFigureMap[p.slug]||{mcq:{},structured:{}};return{...p,mcq:p.mcq.map((x,i)=>m.mcq[i+1]?{...x,figure:m.mcq[i+1]}:x),structured:p.structured.map((x,i)=>m.structured[i]?{...x,figure:m.structured[i]}:x)}}
export const allKjseaPapers:readonly Paper[]=[
 attachExactFigures(paper("grade-7-agriculture","Grade 7 Agriculture Sample Paper 1","Agriculture","G7-AGRI-SP1",7,"agri",20,10)),
 attachExactFigures(paper("grade-7-science","Grade 7 Integrated Science Sample Paper 1","Integrated Science","G7-SCI-SP1",7,"sci",20,10)),
 attachExactFigures(paper("grade-8-agriculture","Grade 8 Agriculture Sample Paper 1","Agriculture","G8-AGRI-SP1",8,"agri",20,10)),
 attachExactFigures(paper("grade-8-science","Grade 8 Integrated Science Sample Paper 1","Integrated Science","G8-SCI-SP1",8,"sci",20,10)),
 attachExactFigures(paper("grade-9-agriculture","Grade 9 Agriculture First Trial","Agriculture","G9-AGRI-T1",9,"agri",30,12)),
 attachExactFigures(paper("grade-9-science","Grade 9 Integrated Science First Trial","Integrated Science","G9-SCI-T1",9,"sci",30,12))
];
export const getKjseaPaper=(slug:string)=>allKjseaPapers.find(p=>p.slug===slug);
