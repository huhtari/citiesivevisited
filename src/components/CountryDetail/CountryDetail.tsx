import type { Trip } from '../../models/types';
import { EmptyState } from '../common/EmptyState';

interface CountryDetailProps {
  countryCode: string;
  countryName: string;
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
  onBack: () => void;
}

export function CountryDetail({
  countryName,
  trips,
  onEdit,
  onDelete,
  onBack,
}: CountryDetailProps) {
  const sorted = [...trips].sort((a, b) => b.visitDate.localeCompare(a.visitDate));

  function handleDelete(trip: Trip) {
    if (window.confirm(`Delete this trip to ${countryName}? This cannot be undone.`)) {
      onDelete(trip.id);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Visits to ${countryName}`}
    >
      <div className="bg-white w-full sm:max-w-lg sm:rounded-xl shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Back"
          >
            ←
          </button>
          <h2 className="font-semibold text-gray-900 text-lg flex-1">{countryName}</h2>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {sorted.length === 0 ? (
            <EmptyState message={`No cities recorded for ${countryName} yet.`} />
          ) : (
            <ul className="space-y-4">
              {sorted.map((trip) => (
                <li key={trip.id} role="article" className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 mb-1">{trip.visitDate}</p>
                      {trip.cities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {trip.cities.map((city) => (
                            <span
                              key={city}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                            >
                              {city}
                            </span>
                          ))}
                        </div>
                      )}
                      {trip.note && (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{trip.note}</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => onEdit(trip)}
                        className="p-2 text-gray-400 hover:text-blue-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(trip)}
                        className="p-2 text-gray-400 hover:text-red-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
