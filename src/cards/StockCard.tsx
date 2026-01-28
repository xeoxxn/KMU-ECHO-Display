import Medicine from "../assets/logo/Medicine.tsx";

interface StockCardProps {
  title: string;
  leftNum: number;
}
export default function StockCard({ title, leftNum }: StockCardProps) {
  return (
    <div className="w-109 px-20 py-20 bg-white/20 rounded-[50px] flex justify-center items-center gap-2.5">
      <div className="inline-flex flex-col justify-start items-center gap-12">
        <div className="w-48 h-48 p-5 bg-zinc-100 rounded-[495px] inline-flex justify-center items-center gap-12 overflow-hidden">
          <Medicine />
        </div>
        <div className="flex flex-col justify-start items-center gap-7">
          <div className="justify-start text-white text-7xl font-medium whitespace-nowrap">
            {title}
          </div>
          <div className="justify-start text-white text-4xl font-normal whitespace-nowrap">
            남은 개수: {leftNum}
          </div>
        </div>
      </div>
    </div>
  );
}
