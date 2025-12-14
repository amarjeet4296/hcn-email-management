import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import type { ProcessRequest } from '@/types';

export const useStatus = () => {
  return useQuery({
    queryKey: ['status'],
    queryFn: apiService.getStatus,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useAllBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: apiService.getAllBookings,
  });
};

export const usePendingBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'pending'],
    queryFn: apiService.getPendingBookings,
  });
};

export const useCriticalBookings = () => {
  return useQuery({
    queryKey: ['bookings', 'critical'],
    queryFn: apiService.getCriticalBookings,
  });
};

export const useConfig = () => {
  return useQuery({
    queryKey: ['config'],
    queryFn: apiService.getConfig,
    staleTime: Infinity, // Config rarely changes
  });
};

export const useProcessEmails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ProcessRequest) => apiService.processEmails(request),
    onSuccess: () => {
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['status'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
