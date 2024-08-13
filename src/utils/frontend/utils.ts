import axios from 'axios';

export interface BusinessAddress {
  street: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  coordinates: [number, number];
}

export interface Business {
  id: number;
  name: string;
  type: string;
  address: BusinessAddress;
  openingHour: string;
  closingHour: string;
}

export interface Review {
  id: number;
  businessId: number;
  username: string;
  rating: number;
  comment: string;
}

type ApiCallReturn = { valid: boolean; message?: string; data?: any };

type SuccessHandler = (data: any) => ApiCallReturn;

export const makeApiCall = async (
  url: string,
  method: string,
  sendData: object,
  successHandler: SuccessHandler,
  successCode = 200
): Promise<ApiCallReturn> => {
  try {
    const response = await axios.request({ url, method, ...sendData });
    const { status: statusCode, data } = response;
    if (statusCode === successCode) return successHandler(data);

    throw new Error('Error');
  } catch (err: any) {
    return {
      valid: false,
      message: 'Error while trying to call the endpoint.',
    };
  }
};
