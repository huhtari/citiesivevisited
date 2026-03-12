import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import geoData from 'world-atlas/countries-110m.json';

interface WorldMapProps {
  visitedCodes: Set<string>;
  onCountryClick: (countryCode: string) => void;
  isLoading: boolean;
}

export function WorldMap({ visitedCodes, onCountryClick, isLoading }: WorldMapProps) {
  return (
    <div data-testid="world-map" className="relative w-full bg-blue-50 rounded-xl overflow-hidden">
      {isLoading && (
        <div
          role="status"
          aria-label="Loading map"
          className="absolute inset-0 flex items-center justify-center bg-white/70 z-10"
        >
          <span className="text-gray-500 text-sm">Loading…</span>
        </div>
      )}
      <ComposableMap
        projectionConfig={{ scale: 147 }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const code: string = geo.properties.ISO_A2 as string;
              const isVisited = visitedCodes.has(code);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  role="button"
                  aria-label={`${geo.properties.NAME as string}${isVisited ? ' (visited)' : ''}`}
                  onClick={() => onCountryClick(code)}
                  style={{
                    default: {
                      fill: isVisited ? '#3b82f6' : '#d1d5db',
                      stroke: '#ffffff',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: 'pointer',
                    },
                    hover: {
                      fill: isVisited ? '#2563eb' : '#9ca3af',
                      stroke: '#ffffff',
                      strokeWidth: 0.5,
                      outline: 'none',
                    },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
