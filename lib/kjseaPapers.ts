import {grade7AgriculturePaper} from "./kjseaGrade7Agriculture";
import {grade7SciencePaper} from "./kjseaGrade7Science";
import {grade8AgriculturePaper} from "./kjseaGrade8Agriculture";
import {grade8SciencePaper} from "./kjseaGrade8Science";
import {grade9AgriculturePaper} from "./kjseaGrade9Agriculture";
import {grade9SciencePaper} from "./kjseaGrade9Science";
export const kjseaPapers=[grade7AgriculturePaper,grade7SciencePaper,grade8AgriculturePaper,grade8SciencePaper,grade9AgriculturePaper,grade9SciencePaper] as const;
export const getKjseaPaper=(slug:string)=>kjseaPapers.find(p=>p.slug===slug);
