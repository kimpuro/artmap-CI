import { QueryClientConfig } from '@tanstack/react-query'

const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      /** 개발자 판단하에 설정해주세요 기본값은 0 입니다. */
      staleTime: 5 * 60 * 1000,
      /** 개발자 판단하에 설정해주세요 기본값은 3 입니다. */
      retry: 1,
    },
  },
}

export default queryClientOptions
