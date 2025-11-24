const formatNumber = (num: number) => {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(
    num
  );
};

export const StatsSection = ({ cansCount }: { cansCount: number }) => {
  const liters = cansCount * 0.5;
  const heightMeters = cansCount * 0.16;

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 w-full">
      <StatCard
        label="ARSENAL TOTAL"
        value={cansCount}
        unit="UNITÉS"
        icon="📦"
        color="text-[#39ff14]"
        hoverColor="group-hover:text-[#39ff14]"
        borderColor="border-[#39ff14]"
      />

      <StatCard
        label="VOLUME TOXIQUE"
        value={liters}
        unit="LITRES"
        icon="💧"
        color="text-blue-500"
        hoverColor="group-hover:text-blue-500"
        borderColor="border-blue-500"
      />

      <StatCard
        label="HAUTEUR STACK"
        value={heightMeters}
        unit="MÈTRES"
        icon="🏗️"
        color="text-orange-500"
        hoverColor="group-hover:text-orange-500"
        borderColor="border-orange-500"
      />
    </div>
  );
};

const StatCard = ({
  label,
  value,
  unit,
  icon,
  color,
  hoverColor,
  borderColor,
}: any) => (
  <div
    className={`relative group w-full md:w-auto min-w-[200px] cursor-default`}
  >
    <div
      className={`absolute -inset-0.5 opacity-20 group-hover:opacity-60 blur transition duration-500 bg-current ${color}`}
    ></div>

    <div className="relative bg-[#050505] p-6 border border-gray-800 hover:border-gray-600 transition-colors duration-300">
      <div
        className={`absolute bottom-0 left-0 w-full h-[2px] ${borderColor} opacity-80 shadow-[0_0_10px_currentColor] ${color}`}
      />

      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-[10px] font-bold tracking-widest uppercase text-gray-400 transition-colors duration-300 ${hoverColor}`}
        >
          {label}
        </span>

        <span className="text-lg grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
          {icon}
        </span>
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className={`text-4xl font-black italic tracking-tighter ${color} drop-shadow-lg`}
        >
          {formatNumber(value)}
        </span>
        <span className="text-[10px] font-bold text-gray-500 uppercase">
          {unit}
        </span>
      </div>
    </div>
  </div>
);
