import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { RecommendationModal } from './RecommendationModal';
import * as recommendationsService from '../services/recommendations';
import { RecommendationResponse } from '../types';

vi.mock('../services/recommendations');

describe('RecommendationModal', () => {
  const mockRecommendationData: RecommendationResponse = {
    curator_summary: 'Your collection has a discerning jazz taste.',
    total_crate_size_analyzed: 5,
    recommendations: [
      {
        title: 'Sunday at the Village Vanguard',
        artist: 'Bill Evans Trio',
        release_year: 1961,
        genre: 'Modal Jazz',
        estimated_price: 48.0,
        reason_for_recommendation: 'Acoustic masterwork with breathtaking spatial depth.',
        suggested_condition: 'Near Mint',
        cover_url: 'https://example.com/bill-evans.jpg',
      },
      {
        title: 'Wish You Were Here',
        artist: 'Pink Floyd',
        release_year: 1975,
        genre: 'Progressive Rock',
        estimated_price: 42.5,
        reason_for_recommendation: 'Unmatched dynamic range and analog warmth.',
        suggested_condition: 'Near Mint',
        cover_url: 'https://example.com/pink-floyd.jpg',
      },
      {
        title: 'Innervisions',
        artist: 'Stevie Wonder',
        release_year: 1973,
        genre: 'Soul / Funk',
        estimated_price: 36.0,
        reason_for_recommendation: 'Groundbreaking synth sequencing.',
        suggested_condition: 'VG+',
        cover_url: 'https://example.com/stevie-wonder.jpg',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render anything when isOpen is false', () => {
    // Arrange
    const onCloseMock = vi.fn();
    const onAddMock = vi.fn().mockResolvedValue(undefined);

    // Act
    render(
      <RecommendationModal
        isOpen={false}
        onClose={onCloseMock}
        onAddToCrate={onAddMock}
      />
    );

    // Assert
    expect(screen.queryByText('What to Spin Next')).not.toBeInTheDocument();
  });

  it('should render curator taste summary and 3 recommendation cards when data is fetched', async () => {
    // Arrange
    vi.mocked(recommendationsService.getAiRecommendations).mockResolvedValueOnce(
      mockRecommendationData
    );
    const onCloseMock = vi.fn();
    const onAddMock = vi.fn().mockResolvedValue(undefined);

    // Act
    render(
      <RecommendationModal
        isOpen={true}
        onClose={onCloseMock}
        onAddToCrate={onAddMock}
      />
    );

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText('"Your collection has a discerning jazz taste."')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Sunday at the Village Vanguard')).toBeInTheDocument();
    expect(screen.getByText('Wish You Were Here')).toBeInTheDocument();
    expect(screen.getByText('Innervisions')).toBeInTheDocument();
    expect(screen.getByText('$48.00')).toBeInTheDocument();
  });

  it('should invoke onAddToCrate and update button state to added when Add to Crate is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    vi.mocked(recommendationsService.getAiRecommendations).mockResolvedValueOnce(
      mockRecommendationData
    );
    const onCloseMock = vi.fn();
    const onAddMock = vi.fn().mockResolvedValue(undefined);

    render(
      <RecommendationModal
        isOpen={true}
        onClose={onCloseMock}
        onAddToCrate={onAddMock}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Sunday at the Village Vanguard')).toBeInTheDocument();
    });

    // Act
    const addButtons = screen.getAllByRole('button', { name: /add to crate/i });
    await user.click(addButtons[0]);

    // Assert
    expect(onAddMock).toHaveBeenCalledTimes(1);
    expect(onAddMock).toHaveBeenCalledWith({
      title: 'Sunday at the Village Vanguard',
      artist: 'Bill Evans Trio',
      release_year: 1961,
      condition: 'Near Mint',
      price: 48.0,
      cover_url: 'https://example.com/bill-evans.jpg',
    });

    expect(screen.getByText('Added to Crate')).toBeInTheDocument();
  });
});
