import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecordCard } from './RecordCard';
import { RecordItem } from '../types';

describe('RecordCard', () => {
  const sampleRecord: RecordItem = {
    id: 42,
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    release_year: 1959,
    condition: 'Near Mint',
    price: 65.0,
    cover_url: 'https://example.com/kind-of-blue.jpg',
    user_id: 1,
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  };

  it('should render album details, condition grade, and formatted price when record is provided', () => {
    // Arrange
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();

    // Act
    render(
      <RecordCard
        record={sampleRecord}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    // Assert
    expect(screen.getByText('Kind of Blue')).toBeInTheDocument();
    expect(screen.getByText('Miles Davis')).toBeInTheDocument();
    expect(screen.getByText('Near Mint')).toBeInTheDocument();
    expect(screen.getByText('1959')).toBeInTheDocument();
    expect(screen.getByText('$65.00')).toBeInTheDocument();
  });

  it('should invoke onEdit callback with record data when edit button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();
    render(
      <RecordCard
        record={sampleRecord}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    // Act
    const editButton = screen.getByTitle('Edit record');
    await user.click(editButton);

    // Assert
    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).toHaveBeenCalledWith(sampleRecord);
  });

  it('should invoke onDelete callback with record data when delete button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();
    render(
      <RecordCard
        record={sampleRecord}
        onEdit={onEditMock}
        onDelete={onDeleteMock}
      />
    );

    // Act
    const deleteButton = screen.getByTitle('Delete from crate');
    await user.click(deleteButton);

    // Assert
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(sampleRecord);
  });
});
