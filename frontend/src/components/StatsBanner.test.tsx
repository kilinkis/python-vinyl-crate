import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsBanner } from './StatsBanner';
import { RecordItem } from '../types';

describe('StatsBanner', () => {
  it('should render zero statistics when record list is empty', () => {
    // Arrange
    const records: RecordItem[] = [];

    // Act
    render(<StatsBanner records={records} />);

    // Assert
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getAllByText('$0.00')).toHaveLength(2);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('should calculate total collection valuation and disc count when records are provided', () => {
    // Arrange
    const records: RecordItem[] = [
      {
        id: 1,
        title: 'Kind of Blue',
        artist: 'Miles Davis',
        release_year: 1959,
        condition: 'Mint',
        price: 65.0,
        user_id: 1,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      },
      {
        id: 2,
        title: 'Random Access Memories',
        artist: 'Daft Punk',
        release_year: 2013,
        condition: 'Near Mint',
        price: 45.0,
        user_id: 1,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      },
    ];

    // Act
    render(<StatsBanner records={records} />);

    // Assert
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$110.00')).toBeInTheDocument();
    expect(screen.getByText('$55.00')).toBeInTheDocument();
    expect(screen.getByText('1959 – 2013')).toBeInTheDocument();
  });
});
