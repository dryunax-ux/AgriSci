import {redirect} from "next/navigation";
import {kjseaPapers} from "../../../lib/kjseaPapers";

export function generateStaticParams(){return kjseaPapers.map(p=>({paper:p.id}))}

export default async function PaperPage({params}:{params:Promise<{paper:string}>}){
 const {paper}=await params;
 redirect(`/kjsea/${paper}/digital`);
}
