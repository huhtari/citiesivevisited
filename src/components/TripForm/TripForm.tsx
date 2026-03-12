import { useState } from 'react';
import { COUNTRIES } from '../../data/countries';
import type { TripInput } from '../../models/types';

interface TripFormProps {
  initialValues?: TripInput;
  onSubmit: (input: TripInput) => void;
  onCancel: () => void;
}

export function TripForm({ initialValues, onSubmit, onCancel }: TripFormProps) {
  const [countryQuery, setCountryQuery] = useState(initialValues?.countryName ?? '');
  const [selectedCode, setSelectedCode] = useState(initialValues?.countryCode ?? '');
  const [cities, setCities] = useState<string[]>(initialValues?.cities ?? ['']);
  const [visitDate, setVisitDate] = useState(initialValues?.visitDate ?? '');
  const [note, setNote] = useState(initialValues?.note ?? '');
  const [errors, setErrors] = useState<{ country?: string }>({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = countryQuery.length >= 1
    ? COUNTRIES.filter((c) =>
        c.name.toLowerCase().startsWith(countryQuery.toLowerCase()),
      ).slice(0, 8)
    : [];

  function handleCountryInput(value: string) {
    setCountryQuery(value);
    setSelectedCode('');
    setShowSuggestions(true);
  }

  function handleSelectCountry(code: string, name: string) {
    setSelectedCode(code);
    setCountryQuery(name);
    setShowSuggestions(false);
  }

  function handleCityChange(idx: number, value: string) {
    setCities((prev) => prev.map((c, i) => (i === idx ? value : c)));
  }

  function handleAddCity() {
    setCities((prev) => [...prev, '']);
  }

  function handleRemoveCity(idx: number) {
    setCities((prev) => prev.filter((_, i) => i !== idx));
  }

  function validate(): boolean {
    const newErrors: { country?: string } = {};
    if (!countryQuery.trim()) newErrors.country = 'Country is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // If user typed a country name without selecting from autocomplete, look it up
    const match = COUNTRIES.find(
      (c) => c.name.toLowerCase() === countryQuery.trim().toLowerCase(),
    );
    const code = selectedCode || match?.code || '';
    const name = countryQuery.trim();

    onSubmit({
      countryCode: code,
      countryName: name,
      cities: cities.map((c) => c.trim()).filter(Boolean),
      visitDate: visitDate.trim(),
      note: note.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {initialValues ? 'Edit visit' : 'Add visit'}
      </h2>

      {/* Country */}
      <div className="mb-4 relative">
        <label htmlFor="country-input" className="block text-sm font-medium text-gray-700 mb-1">
          Country *
        </label>
        <input
          id="country-input"
          type="text"
          value={countryQuery}
          onChange={(e) => handleCountryInput(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="e.g. Japan"
          autoComplete="off"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-autocomplete="list"
          aria-controls="country-suggestions"
          aria-label="Country"
        />
        {errors.country && (
          <p className="text-red-600 text-xs mt-1">{errors.country}</p>
        )}
        {showSuggestions && suggestions.length > 0 && (
          <ul
            id="country-suggestions"
            role="listbox"
            className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {suggestions.map((c) => (
              <li
                key={c.code}
                role="option"
                aria-selected={selectedCode === c.code}
                onMouseDown={() => handleSelectCountry(c.code, c.name)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50"
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Date */}
      <div className="mb-4">
        <label htmlFor="visit-date" className="block text-sm font-medium text-gray-700 mb-1">
          Date visited (optional)
        </label>
        <input
          id="visit-date"
          type="month"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Date visited"
        />
      </div>

      {/* Cities */}
      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Cities (optional)</span>
        {cities.map((city, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              value={city}
              onChange={(e) => handleCityChange(idx, e.target.value)}
              placeholder={`City ${idx + 1}`}
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`City ${idx + 1}`}
            />
            {cities.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveCity(idx)}
                className="px-3 text-gray-400 hover:text-red-500 min-h-[44px]"
                aria-label="Remove city"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddCity}
          className="text-sm text-blue-500 hover:text-blue-700 mt-1 min-h-[44px]"
        >
          + Add city
        </button>
      </div>

      {/* Note */}
      <div className="mb-6">
        <label htmlFor="trip-note" className="block text-sm font-medium text-gray-700 mb-1">
          Note (optional)
        </label>
        <textarea
          id="trip-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Any memories worth noting…"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          aria-label="Note"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 min-h-[44px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 min-h-[44px]"
        >
          Save
        </button>
      </div>
    </form>
  );
}
