import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/index';
import {
  extractJSONString,
  generatorChat,
  getAllBusinesses,
  getDataString,
  Handler,
  Review,
  transformToString,
} from '../utils/backend/utils';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs';
import { REVIEWS_DATA_FILE, REVIEWS_DATA_TXT } from '../utils/backend/globals';

export const CONTEXT: ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content:
      'You are a helpful assistant that helps generating random reviews of business stored in a database.',
  },
  {
    role: 'user',
    content:
      'Generate me a list of 20 reviews of the existing businesses in JSON format as such: id, businessId, username, rating (between 1 to 5) and comment.',
  },
];

const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getAllBusinesses',
      description: 'Get all the existing businesses stored in the database.',
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
    name: 'getAllBusinesses',
    func: getAllBusinesses,
  },
];

export const generate = async () => {
  const content = await generatorChat(CONTEXT, HANDLERS, TOOLS);

  const reviews = JSON.parse(extractJSONString(content)) as Review[];

  const previousReviews = JSON.parse(
    (await promisify(readFile)(REVIEWS_DATA_FILE, 'utf8')).toString()
  ) as Review[];

  const maxId = previousReviews.reduce(
    (max, review) => (review.id > max ? review.id : max),
    -1
  );

  reviews.forEach(review => {
    review.id += review.id + maxId;
  });

  await promisify(writeFile)(
    REVIEWS_DATA_FILE,
    JSON.stringify([...previousReviews, ...reviews]),
    'utf8'
  );

  console.log(`Reviews' file updated at the location ${REVIEWS_DATA_FILE}`);
};

export const generateTextFile = async () => {
  const title = 'List of all existing reviews to search on:\n';
  const reviews = (
    await getDataString(REVIEWS_DATA_FILE, (review: object) =>
      transformToString(review)
    )
  ).join('\n');

  await promisify(writeFile)(REVIEWS_DATA_TXT, title + reviews, 'utf8');
  return title + reviews;
};
