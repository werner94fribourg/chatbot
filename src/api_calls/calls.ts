import { Business } from '@/utils/frontend/utils';
import {
  BUSINESS_URL,
  CLEAR_CONTEXT_URL,
  GENERATE_BUSINESSES_URL,
  GENERATE_REVIEWS_URL,
  RECOMMENDATIONS_URL,
  REVIEW_URL,
} from '@/utils/frontend/globals';
import { makeApiCall } from '@/utils/frontend/utils';
import { Review } from '@/utils/frontend/utils';

interface Response<T> {
  status: string;
  data: T;
}

export const fetchAllBusinesses = () => {
  return makeApiCall(
    BUSINESS_URL,
    'get',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    (data: Response<{ businesses: Business[] }>) => {
      const {
        data: { businesses },
      } = data;

      return { valid: true, data: businesses };
    }
  );
};

export const fetchAllReviews = () => {
  return makeApiCall(
    REVIEW_URL,
    'get',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    (data: Response<{ reviews: Review[] }>) => {
      const {
        data: { reviews },
      } = data;

      return { valid: true, data: reviews };
    }
  );
};

export const fetchChatbotAnswer = (prompt: string) => {
  return makeApiCall(
    RECOMMENDATIONS_URL,
    'post',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      data: { prompt },
    },
    (data: Response<{ answer: string }>) => {
      const {
        data: { answer },
      } = data;

      return { valid: true, data: answer };
    }
  );
};

export const fetchClearContext = () => {
  return makeApiCall(
    CLEAR_CONTEXT_URL,
    'patch',
    {},
    (data: { message: string }) => {
      const { message } = data;

      return { valid: true, message };
    }
  );
};

export const fetchNewBusinesses = () => {
  return makeApiCall(
    GENERATE_BUSINESSES_URL,
    'patch',
    {},
    (data: Response<{ businesses: Business[] }>) => {
      const {
        data: { businesses },
      } = data;

      return { valid: true, data: businesses };
    }
  );
};

export const fetchNewReviews = () => {
  return makeApiCall(
    GENERATE_REVIEWS_URL,
    'patch',
    {},
    (data: Response<{ reviews: Review[] }>) => {
      const {
        data: { reviews },
      } = data;

      return { valid: true, data: reviews };
    }
  );
};
