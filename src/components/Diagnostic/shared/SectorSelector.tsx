import { SECTORS } from '../types';

interface SectorSelectorProps {
  selected: string;
  onSelect: (sector: string) => void;
}

export const SectorSelector = ({ selected, onSelect }: SectorSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {SECTORS.map((sector) => (
        <button
          key={sector.id}
          type="button"
          onClick={() => onSelect(sector.id)}
          className={`
            flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
            ${
              selected === sector.id
                ? 'bg-accent/10 border-accent scale-[1.02] shadow-glow'
                : 'bg-ink-medium border-ink-border hover:border-accent/50'
            }
          `}
        >
          <span className="text-2xl mb-2">{sector.icon}</span>
          <span
            className={`text-sm font-medium text-center ${
              selected === sector.id ? 'text-accent' : 'text-white'
            }`}
          >
            {sector.label}
          </span>
        </button>
      ))}
    </div>
  );
};
