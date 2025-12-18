import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubscriptionStatus,
  createSubscription,
  SubscriptionStatus,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
} from "@/services/subscriptionStatusService";

/**
 * Hook to fetch current subscription status
 */
export function useSubscriptionStatus() {
  return useQuery<SubscriptionStatus>({
    queryKey: ["subscriptionStatus"],
    queryFn: getSubscriptionStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new subscription
 */
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateSubscriptionResponse,
    Error,
    CreateSubscriptionRequest
  >({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
    },
  });
}
