import { getKjseaQuestionImage } from "../lib/kjseaQuestionImageMap";

type Props = { paperSlug: string; printedNumber: number; alt?: string };

export default function KjseaQuestionFigure({ paperSlug, printedNumber, alt }: Props) {
  const src = getKjseaQuestionImage(paperSlug, printedNumber);
  if (!src) return null;
  return (
    <figure className="kjseaQuestionFigure">
      <img src={src} alt={alt ?? `Question ${printedNumber} figure`} loading="eager" />
    </figure>
  );
}
