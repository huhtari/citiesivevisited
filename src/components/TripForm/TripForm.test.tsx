import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { TripForm } from './TripForm';
import type { TripInput } from '../../models/types';

const SAMPLE_INPUT: TripInput = {
  countryCode: 'JP',
  countryName: 'Japan',
  cities: ['Tokyo'],
  visitDate: '2023-04',
  note: 'Great trip',
};

describe('TripForm — create mode', () => {
  it('renders all form fields', () => {
    render(<TripForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText(/country/i)).toBeTruthy();
    expect(screen.getByLabelText(/date/i)).toBeTruthy();
    expect(screen.getByLabelText(/note/i)).toBeTruthy();
  });

  it('shows validation message and does not submit when country is empty', async () => {
    const handleSubmit = vi.fn();
    render(<TripForm onSubmit={handleSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/date/i), '2023-04');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/country is required/i)).toBeTruthy();
  });

  it('shows validation message when date is empty', async () => {
    const handleSubmit = vi.fn();
    render(<TripForm onSubmit={handleSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/country/i), 'Japan');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/date is required/i)).toBeTruthy();
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    const handleSubmit = vi.fn();
    render(<TripForm onSubmit={handleSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/country/i), 'Japan');
    // Select first autocomplete suggestion if it appears
    const suggestions = screen.queryAllByRole('option');
    if (suggestions.length > 0) await userEvent.click(suggestions[0]);
    await userEvent.clear(screen.getByLabelText(/date/i));
    await userEvent.type(screen.getByLabelText(/date/i), '2023-04');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const handleCancel = vi.fn();
    render(<TripForm onSubmit={vi.fn()} onCancel={handleCancel} />);
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(handleCancel).toHaveBeenCalled();
  });
});

describe('TripForm — edit mode', () => {
  it('pre-populates fields from initialValues', () => {
    render(<TripForm initialValues={SAMPLE_INPUT} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect((screen.getByLabelText(/country/i) as HTMLInputElement).value).toBe('Japan');
    expect((screen.getByLabelText(/date/i) as HTMLInputElement).value).toBe('2023-04');
    expect((screen.getByLabelText(/note/i) as HTMLInputElement).value).toBe('Great trip');
  });

  it('submits updated values', async () => {
    const handleSubmit = vi.fn();
    render(<TripForm initialValues={SAMPLE_INPUT} onSubmit={handleSubmit} onCancel={vi.fn()} />);
    const noteField = screen.getByLabelText(/note/i);
    await userEvent.clear(noteField);
    await userEvent.type(noteField, 'Updated note');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ note: 'Updated note' }),
      );
    });
  });
});
