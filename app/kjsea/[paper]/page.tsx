import { notFound } from "next/navigation";
import KjseaDigitalPaper from "../../../components/KjseaDigitalPaper";
import { getKjseaPaper } from "../../../lib/kjseaPapers";

export default async function KjseaPaperPage({
  params,
}: {
  params: Promise<{ paper: string }>;
}) {
  const { paper: slug } = await params;
  const selectedPaper = getKjseaPaper(slug);

  if (!selectedPaper) {
    notFound();
  }

  return <KjseaDigitalPaper paper={selectedPaper} />;
}
