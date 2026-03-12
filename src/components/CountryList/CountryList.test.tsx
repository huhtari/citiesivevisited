import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CountryList } from './CountryList';
import type { CountrySummary } from '../../models/types';

const SAMPLE_COUNTRIES: CountrySummary[] = [
  {
    countryCode: 'JP',
    countryName: 'Japan',
    cityCount: 3,
    tripCount: 1,
    mostRecentVisit: '2023-04',
  },
  {
    countryCode: 'FR',
    countryName: 'France',
    cityCount: 2,
    tripCount: 2,
    mostRecentVisit: '2022-08',
  },
];

describe('CountryList', () => {
  it('renders country names', () => {
    render(<CountryList countries={SAMPLE_COUNTRIES} onCountryClick={vi.fn()} />);
    expect(screen.getByText('Japan')).toBeTruthy();
    expect(screen.getByText('France')).toBeTruthy();
  });

  it('displays city count for each country', () => {
    render(<CountryList countries={SAMPLE_COUNTRIES} onCountryClick={vi.fn()} />);
    expect(screen.getByText(/3 cit/i)).toBeTruthy();
    expect(screen.getByText(/2 cit/i)).toBeTruthy();
  });

  it('shows empty state message when countries list is empty', () => {
    render(<CountryList countries={[]} onCountryClick={vi.fn()} />);
    expect(screen.getByText(/no trips/i)).toBeTruthy();
  });

  it('calls onCountryClick with the country code when a row is clicked', async () => {
    const handleClick = vi.fn();
    render(<CountryList countries={SAMPLE_COUNTRIES} onCountryClick={handleClick} />);
    await userEvent.click(screen.getByText('Japan'));
    expect(handleClick).toHaveBeenCalledWith('JP');
  });
});
