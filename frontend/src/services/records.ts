import { apiRequest } from './api';
import {
  RecordItem,
  RecordCreateInput,
  RecordUpdateInput,
  RecordListResponse,
} from '../types';

export async function getRecords(params?: {
  skip?: number;
  limit?: number;
  search?: string;
}): Promise<RecordListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.skip !== undefined) queryParams.set('skip', params.skip.toString());
  if (params?.limit !== undefined) queryParams.set('limit', params.limit.toString());
  if (params?.search) queryParams.set('search', params.search);

  const qs = queryParams.toString();
  return apiRequest<RecordListResponse>(`/records/${qs ? `?${qs}` : ''}`);
}

export async function getRecord(id: number): Promise<RecordItem> {
  return apiRequest<RecordItem>(`/records/${id}`);
}

export async function createRecord(input: RecordCreateInput): Promise<RecordItem> {
  return apiRequest<RecordItem>('/records/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateRecord(
  id: number,
  input: RecordUpdateInput
): Promise<RecordItem> {
  return apiRequest<RecordItem>(`/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export async function deleteRecord(id: number): Promise<void> {
  return apiRequest<void>(`/records/${id}`, {
    method: 'DELETE',
  });
}
