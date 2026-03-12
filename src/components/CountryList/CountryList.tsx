import type { CountrySummary } from '../../models/types';
import { EmptyState } from '../common/EmptyState';

interface CountryListProps {
  countries: CountrySummary[];
  onCountryClick: (countryCode: string) => void;
}

export function CountryList({ countries, onCountryClick }: CountryListProps) {
  if (countries.length === 0) {
    return (
      <EmptyState message="No trips recorded yet — add your first!" />
    );
  }

  return (
    <ul className="divide-y divide-gray-200" aria-label="Countries visited">
      {countries.map((c) => (
        <li key={c.countryCode}>
          <button
            onClick={() => onCountryClick(c.countryCode)}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[44px] hover:bg-gray-50 transition-colors text-left"
            aria-label={`${c.countryName}, ${c.cityCount} ${c.cityCount === 1 ? 'city' : 'cities'}`}
          >
            <span className="font-medium text-gray-900">{c.countryName}</span>
            <span className="text-sm text-gray-500 ml-2">
              {c.cityCount} {c.cityCount === 1 ? 'city' : 'cities'}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
