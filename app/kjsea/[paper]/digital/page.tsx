import {notFound} from "next/navigation";
import KjseaDigitalPaper from "../../../../components/KjseaDigitalPaper";
import {kjseaDigitalPapers} from "../../../../lib/kjseaDigitalPapers";
export function generateStaticParams(){return Object.keys(kjseaDigitalPapers).map(paper=>({paper}))}
export default async function DigitalPaperPage({params}:{params:Promise<{paper:string}>}){const {paper}=await params;const data=kjseaDigitalPapers[paper as keyof typeof kjseaDigitalPapers];if(!data)notFound();return <KjseaDigitalPaper paper={data}/>}
