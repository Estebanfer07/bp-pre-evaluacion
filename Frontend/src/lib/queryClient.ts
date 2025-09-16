import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: import.meta.env.NODE_ENV === "test" ? 0 : 5 * 60 * 1000,
      gcTime: import.meta.env.NODE_ENV === "test" ? 0 : 10 * 60 * 1000,
      retry:
        import.meta.env.NODE_ENV === "test"
          ? false
          : (failureCount, error) => {
              if (error instanceof Error && "status" in error) {
                const status = (error as any).status;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              return failureCount < 1;
            },
      retryDelay:
        import.meta.env.NODE_ENV === "test"
          ? 0
          : (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});
