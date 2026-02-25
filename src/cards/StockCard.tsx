import Medicine from "../assets/logo/Medicine.tsx";

interface StockCardProps {
  title: string;
  leftNum: number;
  imageUrl?: string;
}
export default function StockCard({
  title,
  leftNum,
  imageUrl,
}: StockCardProps) {
  return (
    <div className="w-92 shrink-0 px-20 py-20 bg-white/20 rounded-[50px] flex justify-center items-center">
      <div className="flex flex-col items-center gap-12">
        <div className="w-48 h-48 p-5 bg-zinc-100 rounded-full flex justify-center items-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-contain"
            />
          ) : (
            <Medicine /> // fallback
          )}
        </div>

        <div className="flex flex-col items-center gap-7 w-full">
          <div className="text-white text-7xl font-medium text-center truncate w-full">
            {title}
          </div>

          <div className="text-white text-4xl font-normal whitespace-nowrap">
            남은 개수: {leftNum}
          </div>
        </div>
      </div>
    </div>
  );
}
