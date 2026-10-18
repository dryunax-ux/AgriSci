export type KjseaPaper={
 id:string;title:string;learningArea:string;year:number;paperCode:string;
 pages:number;marks:number;sectionA:number;sectionB:number;pdf:string;
 description:string;topics:string[];status:string;
};

export const kjseaPapers:KjseaPaper[]=[
 {id:"2025-agriculture-nutrition",title:"KJSEA 2025 Agriculture and Nutrition",learningArea:"Agriculture and Nutrition",year:2025,paperCode:"906/1",pages:9,marks:70,sectionA:30,sectionB:40,pdf:"/kjsea/kjsea-2025-agriculture-nutrition.pdf",description:"A 2025 KJSEA sample paper containing 30 multiple-choice questions and structured-response questions covering crop production, livestock, conservation, nutrition, hygiene and production techniques.",topics:["Crop production","Soil and water conservation","Hay and integrated farming","Food preparation and preservation","Kitchen hygiene","Grafting and sun drying","Household production skills"],status:"Source paper uploaded"},
 {id:"2025-integrated-science-paper-1",title:"KJSEA 2025 Integrated Science Paper 1",learningArea:"Integrated Science",year:2025,paperCode:"905/1",pages:13,marks:70,sectionA:30,sectionB:40,pdf:"/kjsea/kjsea-2025-integrated-science-paper-1.pdf",description:"A 2025 KJSEA sample paper containing 30 multiple-choice questions and structured-response questions covering scientific skills, matter, living things, electricity, energy, pressure, mirrors and waves.",topics:["Scientific skills and measurement","Atoms, metals and mixtures","Cells and osmosis","Plant and animal nutrition","Ecology and food webs","Electricity and magnetism","Pressure, mirrors and waves"],status:"Source paper uploaded"}
];
