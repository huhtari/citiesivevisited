import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CountryDetail } from './CountryDetail';
import type { Trip } from '../../models/types';

const TRIP_1: Trip = {
  id: 'trip-1',
  countryCode: 'FR',
  countryName: 'France',
  cities: ['Paris', 'Lyon'],
  visitDate: '2022-08',
  note: 'Summer holiday in France.',
  createdAt: '2022-08-01T00:00:00Z',
  updatedAt: '2022-08-01T00:00:00Z',
};

const TRIP_2: Trip = {
  id: 'trip-2',
  countryCode: 'FR',
  countryName: 'France',
  cities: ['Nice'],
  visitDate: '2019-05',
  note: 'Short break on the Riviera.',
  createdAt: '2019-05-01T00:00:00Z',
  updatedAt: '2019-05-01T00:00:00Z',
};

describe('CountryDetail', () => {
  it('renders trip list sorted by visitDate descending', () => {
    render(
      <CountryDetail
        countryCode="FR"
        countryName="France"
        trips={[TRIP_2, TRIP_1]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onBack={vi.fn()}
      />,
    );
    const items = screen.getAllByRole('article');
    // Most recent first
    expect(items[0].textContent).toContain('2022');
    expect(items[1].textContent).toContain('2019');
  });

  it('shows full note text without truncation', () => {
    render(
      <CountryDetail
        countryCode="FR"
        countryName="France"
        trips={[TRIP_1]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onBack={vi.fn()}
      />,
    );
    expect(screen.getByText('Summer holiday in France.')).toBeTruthy();
  });

  it('shows empty state when trips list is empty', () => {
    render(
      <CountryDetail
        countryCode="FR"
        countryName="France"
        trips={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onBack={vi.fn()}
      />,
    );
    expect(screen.getByText(/no cities recorded/i)).toBeTruthy();
  });

  it('calls onBack when back button is clicked', async () => {
    const handleBack = vi.fn();
    render(
      <CountryDetail
        countryCode="FR"
        countryName="France"
        trips={[TRIP_1]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onBack={handleBack}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(handleBack).toHaveBeenCalled();
  });

  it('calls onEdit with the trip when edit button is clicked', async () => {
    const handleEdit = vi.fn();
    render(
      <CountryDetail
        countryCode="FR"
        countryName="France"
        trips={[TRIP_1]}
        onEdit={handleEdit}
        onDelete={vi.fn()}
        onBack={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(handleEdit).toHaveBeenCalledWith(TRIP_1);
  });

  it('calls onDelete after confirmation', async () => {
    const handleDelete = vi.fn();
    vi.stubGlobal('confirm', () => true);
    render(
      <CountryDetail
        countryCode="FR"
        countryName="France"
        trips={[TRIP_1]}
        onEdit={vi.fn()}
        onDelete={handleDelete}
        onBack={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).toHaveBeenCalledWith('trip-1');
    vi.unstubAllGlobals();
  });

  it('does NOT call onDelete when confirmation is cancelled', async () => {
    const handleDelete = vi.fn();
    vi.stubGlobal('confirm', () => false);
    render(
      <CountryDetail
        countryCode="FR"
        countryName="France"
        trips={[TRIP_1]}
        onEdit={vi.fn()}
        onDelete={handleDelete}
        onBack={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
