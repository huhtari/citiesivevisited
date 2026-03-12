import { useState } from 'react';
import { useTrips } from './hooks/useTrips';
import { WorldMap } from './components/WorldMap/WorldMap';
import { CountryList } from './components/CountryList/CountryList';
import { CountryDetail } from './components/CountryDetail/CountryDetail';
import { TripForm } from './components/TripForm/TripForm';
import type { CountrySummary, Trip, TripInput } from './models/types';
import { exportJSON, importJSON } from './services/trips';

function deriveCountrySummaries(trips: Trip[]): CountrySummary[] {
  const map = new Map<string, { summary: CountrySummary; allCities: Set<string> }>();
  for (const trip of trips) {
    const existing = map.get(trip.countryCode);
    if (!existing) {
      map.set(trip.countryCode, {
        summary: {
          countryCode: trip.countryCode,
          countryName: trip.countryName,
          cityCount: trip.cities.length,
          tripCount: 1,
          mostRecentVisit: trip.visitDate,
        },
        allCities: new Set(trip.cities),
      });
    } else {
      trip.cities.forEach((c) => existing.allCities.add(c));
      existing.summary = {
        ...existing.summary,
        cityCount: existing.allCities.size,
        tripCount: existing.summary.tripCount + 1,
        mostRecentVisit:
          trip.visitDate > existing.summary.mostRecentVisit
            ? trip.visitDate
            : existing.summary.mostRecentVisit,
      };
    }
  }
  return Array.from(map.values())
    .map((v) => v.summary)
    .sort((a, b) => b.mostRecentVisit.localeCompare(a.mostRecentVisit));
}

export default function App() {
  const { trips, addTrip, updateTrip, deleteTrip, reload } = useTrips();
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTripId, setEditTripId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const countrySummaries = deriveCountrySummaries(trips);
  const visitedCodes = new Set(trips.map((t) => t.countryCode));

  const selectedCountryTrips = selectedCountryCode
    ? trips.filter((t) => t.countryCode === selectedCountryCode)
    : [];
  const selectedCountryName =
    selectedCountryTrips[0]?.countryName ?? selectedCountryCode ?? '';

  const editTrip = editTripId ? trips.find((t) => t.id === editTripId) : undefined;

  function handleFormSubmit(input: TripInput) {
    if (editTripId) {
      updateTrip(editTripId, input);
    } else {
      addTrip(input);
    }
    setShowAddForm(false);
    setEditTripId(null);
  }

  function handleExport() {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trips.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        importJSON(ev.target?.result as string);
        reload();
        setImportError(null);
      } catch (err) {
        setImportError((err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Countries Visited</h1>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={handleExport}
            className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px]"
            aria-label="Export trips as JSON"
          >
            Export
          </button>
          <label className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px] cursor-pointer flex items-center">
            Import
            <input type="file" accept=".json" className="sr-only" onChange={handleImportFile} />
          </label>
          <button
            onClick={() => { setEditTripId(null); setShowAddForm(true); }}
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors min-h-[44px] font-medium"
            aria-label="Add a new visit"
          >
            + Add visit
          </button>
        </div>
      </header>

      {importError && (
        <div role="alert" className="mx-4 mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {importError}
        </div>
      )}

      {/* Main layout */}
      <main className="p-4 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Map */}
          <div className="lg:flex-1">
            <WorldMap
              visitedCodes={visitedCodes}
              onCountryClick={setSelectedCountryCode}
              isLoading={false}
            />
            <p className="mt-2 text-sm text-gray-500 text-center">
              {countrySummaries.length}{' '}
              {countrySummaries.length === 1 ? 'country' : 'countries'} visited
            </p>
          </div>

          {/* Country list */}
          <div className="lg:w-72 bg-white rounded-xl shadow-sm overflow-hidden">
            <h2 className="px-4 py-3 font-semibold text-gray-700 border-b text-sm uppercase tracking-wide">
              Countries
            </h2>
            <CountryList
              countries={countrySummaries}
              onCountryClick={setSelectedCountryCode}
            />
          </div>
        </div>
      </main>

      {/* Country detail overlay */}
      {selectedCountryCode && (
        <CountryDetail
          countryCode={selectedCountryCode}
          countryName={selectedCountryName}
          trips={selectedCountryTrips}
          onEdit={(trip) => {
            setEditTripId(trip.id);
            setShowAddForm(true);
            setSelectedCountryCode(null);
          }}
          onDelete={(id) => {
            deleteTrip(id);
            if (selectedCountryTrips.length <= 1) {
              setSelectedCountryCode(null);
            }
          }}
          onBack={() => setSelectedCountryCode(null)}
        />
      )}

      {/* Add / edit form modal */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={editTripId ? 'Edit visit' : 'Add visit'}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <TripForm
              initialValues={
                editTrip
                  ? {
                      countryCode: editTrip.countryCode,
                      countryName: editTrip.countryName,
                      cities: editTrip.cities,
                      visitDate: editTrip.visitDate,
                      note: editTrip.note,
                    }
                  : undefined
              }
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowAddForm(false);
                setEditTripId(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
