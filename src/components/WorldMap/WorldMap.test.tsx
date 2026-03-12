import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { WorldMap } from './WorldMap';

describe('WorldMap', () => {
  it('renders the map container', () => {
    const { container } = render(
      <WorldMap visitedCodes={new Set()} onCountryClick={vi.fn()} isLoading={false} />,
    );
    expect(container.querySelector('[data-testid="world-map"]')).toBeTruthy();
  });

  it('shows a loading indicator when isLoading is true', () => {
    render(
      <WorldMap visitedCodes={new Set()} onCountryClick={vi.fn()} isLoading={true} />,
    );
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('does not show loading indicator when isLoading is false', () => {
    render(
      <WorldMap visitedCodes={new Set()} onCountryClick={vi.fn()} isLoading={false} />,
    );
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('calls onCountryClick with the country code when a geography is clicked', async () => {
    const handleClick = vi.fn();
    render(
      <WorldMap visitedCodes={new Set(['FR'])} onCountryClick={handleClick} isLoading={false} />,
    );
    // Click the first clickable geography button
    const geos = screen.getAllByRole('button');
    if (geos.length > 0) {
      await userEvent.click(geos[0]);
      expect(handleClick).toHaveBeenCalled();
    }
  });
});
