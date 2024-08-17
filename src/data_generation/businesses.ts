import {
  Business,
  extractJSONString,
  generateAddress,
  getRandomCategory,
  generatorChat,
  Handler,
  getDataString,
  transformToString,
  getCategoryType,
} from '../utils/backend/utils';
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/index';
import {
  BUSINESSES_DATA_FILE,
  BUSINESSES_DATA_TXT,
} from '../utils/backend/globals';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs';

const CONTEXT: ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content:
      'You are a helpful assistant that helps generating random business informations.',
  },
  {
    role: 'user',
    content:
      'Generate me a JSON list of 10 random businesses having the following parameters:\n_id (a mongodb Id), name, type, address, openingHour, closingHour. The opening and closing hours must randomly be between 8AM and 6PM. Represent the address as an object having the street, the postalCode, the city, the state, the country and the coordinates as a tuple [lat, lng].',
  },
];

const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'generateAddress',
      description: 'Generate a random address for a commerce.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'getRandomCategory',
      description:
        'Generate a random category for a commerce among the available ones.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
];

const HANDLERS: Handler[] = [
  {
    name: 'getRandomCategory',
    func: getRandomCategory,
  },
  {
    name: 'generateAddress',
    func: generateAddress,
  },
];

export const generate = async () => {
  const [content] = await generatorChat(CONTEXT, HANDLERS, TOOLS);
  const businesses = JSON.parse(extractJSONString(content)) as Business[];

  const previousBusinesses = JSON.parse(
    (await promisify(readFile)(BUSINESSES_DATA_FILE, 'utf8')).toString()
  ) as Business[];

  await promisify(writeFile)(
    BUSINESSES_DATA_FILE,
    JSON.stringify([...previousBusinesses, ...businesses]),
    'utf8'
  );

  console.log(
    `Businesses' file updated at the location ${BUSINESSES_DATA_FILE}`
  );

  return businesses;
};

export const generateTextFile = async () => {
  const title =
    'List of all existing businesses to search on (Each line correspond to a business):\n';

  const businesses = (
    await getDataString(BUSINESSES_DATA_FILE, (business: object) => {
      const {
        type,
        address: {
          coordinates: [lat, lng],
        },
      } = business as Business;

      return transformToString({
        ...business,
        latitude: lat,
        longitude: lng,
        /*categories: getCategoryType(type),*/
      });
    })
  ).join('\n');

  await promisify(writeFile)(BUSINESSES_DATA_TXT, title + businesses, 'utf8');
  return title + businesses;
};
