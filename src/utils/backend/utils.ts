import axios, { AxiosError } from 'axios';
import {
  BUSINESSES_DATA_FILE,
  GEOAPI_REVERSE_URL,
  BUSINESS_TYPES,
  OPENAI,
  OPENAI_MODEL,
  REVIEWS_DATA_FILE,
  AZURE,
  AZURE_BASE_MODEL,
} from './globals';
import {
  ChatCompletionTool,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from 'openai/resources/index';
import { promisify } from 'util';
import { createReadStream, readFile } from 'fs';
import { AzureOpenAI } from 'openai';
//import { Document } from 'langchain/document';

const {
  env: { GEOAPIFY_API_KEY },
} = process;

let BUSINESSES: Business[] | null = null;

let REVIEWS: Review[] | null = null;

export interface Address {
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  state?: string;
  country?: string;
  lon?: number;
  lat?: number;
}

export interface Handler {
  name: string;
  func: Function;
}

export interface BusinessAddress {
  street: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  coordinates: [number, number];
}

export interface Business {
  _id?: string;
  id?: string;
  name: string;
  type: string;
  address: BusinessAddress;
  openingHour: string;
  closingHour: string;
}

export interface Review {
  _id?: string;
  id?: string;
  businessId: number;
  username: string;
  rating: number;
  comment: string;
}

const generateRandomCoordinates = (): { lat: number; lng: number } => {
  const lat = Math.random() * (47.808 - 45.818) + 45.818;
  const lng = Math.random() * (10.492 - 5.956) + 5.956;
  return { lat, lng };
};

export const extractJSONString = (text: string) => {
  const match = /```json([\s\S]*?)```/g.exec(text);
  return match ? match[1].trim() : '';
};

const getAddress = async (
  lat: number,
  lng: number
): Promise<Address | null> => {
  const { data } = await axios.get(
    `${GEOAPI_REVERSE_URL}?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`
  );

  if (!(data && data.features && data.features.length > 0)) return null;

  const {
    features: [{ properties }],
  } = data;

  return properties;
};

export const getRandomCategory = () =>
  BUSINESSES_DATA_FILE[Math.floor(Math.random() * 10)];

export const generateAddress = async (): Promise<string> => {
  let address = null;

  while (
    address === null ||
    address.country !== 'Switzerland' ||
    address.street === undefined ||
    address.housenumber === undefined
  ) {
    const { lat, lng } = generateRandomCoordinates();
    address = await getAddress(lat, lng);
  }

  return JSON.stringify(address);
};

export const transformToString = (item: any): string => {
  if (typeof item === 'string') return item;
  if (typeof item === 'number' || typeof item === 'boolean') return `${item}`;
  if (Array.isArray(item))
    return item.map(el => transformToString(el)).join(', ');

  if (typeof item === 'object')
    return Object.entries(item).reduce((acc: string, current) => {
      const [key, value] = current;
      const str = `${key}: ${transformToString(value)}`;
      if (acc === '') return str;
      return `${acc}, ${str}`;
    }, '');

  return '';
};

export const getAllBusinesses = async () => {
  if (BUSINESSES === null) {
    BUSINESSES = JSON.parse(
      (await promisify(readFile)(BUSINESSES_DATA_FILE, 'utf8')).toString()
    ) as Business[];

    BUSINESSES = BUSINESSES.map(business => {
      const newBusiness = { ...business };
      newBusiness.id = newBusiness._id;

      delete business._id;

      return newBusiness;
    });
  }

  return BUSINESSES.map(business => transformToString(business)).join('\n');
};

export function shuffle(array: any[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
}

export const getAllReviews = async () => {
  if (REVIEWS === null)
    REVIEWS = JSON.parse(
      (await promisify(readFile)(REVIEWS_DATA_FILE, 'utf8')).toString()
    ) as Review[];

  const reviewString = shuffle(REVIEWS)
    .splice(50)
    .map(review => transformToString(review))
    .join('\n');

  return reviewString;
};

export const handleInvokeFunction = async (
  context: ChatCompletionMessageParam[],
  message: ChatCompletionMessage,
  handlers: Handler[]
) => {
  const newContext = [...context];

  newContext.push(message);

  if (!message.tool_calls) return newContext;

  for (const tool_call of message.tool_calls) {
    let toolResponse = null;

    for (let i = 0; i < handlers.length; i++) {
      const { name, func } = handlers[i];
      toolResponse = handleInvocations(tool_call, name, func);
      if (toolResponse !== null) break;
    }

    if (toolResponse === null) continue;

    const [id, response] = toolResponse;

    newContext.push({
      role: 'tool',
      content: response instanceof Array ? response.join(', ') : await response,
      tool_call_id: id,
    });
  }

  return newContext;
};

const handleInvocations = (
  toolCalls: ChatCompletionMessageToolCall,
  name: string,
  handler: Function
) => {
  const {
    function: { name: toolName },
    function: toolFunction,
    id,
  } = toolCalls;

  if (toolName !== name) return null;

  const args = JSON.parse(toolFunction.arguments);

  return [id, handler(args)];
};

export const generatorChat: (
  context: ChatCompletionMessageParam[],
  handlers?: Handler[],
  tools?: ChatCompletionTool[]
) => Promise<
  [string, (ChatCompletionMessageParam | ChatCompletionMessage)[]]
> = async (context, handlers = [], tools = []) => {
  if (tools.length === 0) {
    const {
      choices: [
        {
          message,
          message: { content },
        },
      ],
    } = await AZURE.chat.completions.create({
      model: AZURE_BASE_MODEL,
      messages: context,
    });
    const res = content !== null ? content : '';

    return [content as string, [...context, message]];
  }
  const {
    choices: [{ message, finish_reason }],
  } = await AZURE.chat.completions.create({
    model: AZURE_BASE_MODEL,
    messages: context,
    tools,
    tool_choice: 'auto',
  });

  const willInvokeFunction = finish_reason === 'tool_calls';

  if (!willInvokeFunction) {
    return [message.content as string, [...context, message]];
  }

  const newContext = await handleInvokeFunction(context, message, handlers);

  if (newContext) return generatorChat(newContext, handlers, tools);

  throw new Error('Error while using the generator');
};

export const getTrainingFile = async (path: string, client: AzureOpenAI) => {
  const { id } = await client.files.create({
    file: createReadStream(path),
    purpose: 'fine-tune',
  });

  return id;
};

export const getCategoryType = (cat: string) => {
  for (const [type, categories] of Object.entries(BUSINESS_TYPES)) {
    if (categories.indexOf(cat) !== -1) return type.toLowerCase().split('and');
  }
  return [];
};

export type ObjectHandler = () => Promise<Document[]>;

type TransformationHandler = (obj: object) => string;

export const getDataString = async (
  path: string,
  handler: TransformationHandler
) => {
  const data = (await JSON.parse(
    (await promisify(readFile)(path, 'utf8')).toString()
  )) as object[];
  return data.map(item => handler(item));
};
