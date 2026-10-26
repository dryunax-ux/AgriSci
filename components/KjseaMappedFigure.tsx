import { manualFigure } from "../lib/kjseaManualFigureMap";

type Props = {
  paperSlug: string;
  section: "A" | "B";
  index: number;
  sectionACount: number;
  title?: string;
};

export default function KjseaMappedFigure({ paperSlug, section, index, sectionACount, title }: Props) {
  const printedNumber = section === "A" ? index + 1 : sectionACount + index + 1;
  const src = manualFigure(paperSlug, printedNumber);
  if (!src) return null;

  return (
    <figure className="kjseaQuestionFigure">
      <img
        src={src}
        alt={`${title ?? "KJSEA paper"}, question ${printedNumber}`}
        loading="eager"
      />
    </figure>
  );
}
