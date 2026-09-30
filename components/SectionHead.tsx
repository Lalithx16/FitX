export default function SectionHead({ title }: { title: string }) {
  return (
    <div className="sec-head">
      <div className="sec-title">{title}</div>
      <div className="sec-line" />
    </div>
  );
}
