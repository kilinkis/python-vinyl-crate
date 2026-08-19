import { apiRequest } from './api';
import { RecommendationResponse } from '../types';

export const getAiRecommendations = async (): Promise<RecommendationResponse> => {
  return apiRequest<RecommendationResponse>('/recommendations/');
};
