import {
  generatorChat,
  getAllBusinesses,
  getAllReviews,
  Handler,
} from '@/utils/backend/utils';
/*import {
  AZURE_BASE_MODEL,
  AZURE,
  EMBEDDING_MODEL,
  SEARCH_ENDPOINT,
  SEARCH_KEYWORD_INDEX_NAME,
} from '../utils/backend/globals';
*/ import Resources, {
  //ChatCompletion,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/index';

const CONTEXT: ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content:
      'You are a joyful assistant called Bizbot that helps clients in researching businesses and reviews.',
  },
];

/*
interface DataSource {
  type: string;
  parameters: {
    endpoint: string;
    index_name: string;
    semantic_configuration?: string;
    query_type?: string;
    fields_mapping?: {
      content_fields_separator: string;
      content_fields: string[];
      filepath_field: string;
      title_field: string;
      url_field: string;
      vector_fields: string[];
    };
    in_scope?: boolean;
    role_information?: string;
    strictness?: number;
    top_n_documents?: number;
    authentication: {
      type: string;
      key: string;
    };
    embedding_dependency?: {
      type: string;
      deployment_name: string;
    };
  };
}

interface ChatCompletionCreateParamsNonStreaming
  extends Resources.ChatCompletionCreateParamsNonStreaming {
  data_sources: DataSource[];
}

interface Completions {
  create: (
    content: ChatCompletionCreateParamsNonStreaming
  ) => Promise<ChatCompletion>;
}

const DATA_SOURCE: DataSource[] = [
  {
    type: 'azure_search',
    parameters: {
      endpoint: SEARCH_ENDPOINT,
      index_name: 'recommendation-index-2',
      semantic_configuration: 'default',
      query_type: 'vector_simple_hybrid',
      fields_mapping: {
        content_fields_separator: '\n',
        content_fields: ['content'],
        filepath_field: 'filepath',
        title_field: 'title',
        url_field: 'url',
        vector_fields: ['contentVector'],
      },
      in_scope: true,
      role_information:
        'You are a joyful assistant called Bizbot that helps clients in researching businesses and reviews.',
      strictness: 3,
      top_n_documents: 5,
      authentication: {
        type: 'api_key',
        key: process.env.SEARCH_API_KEY!,
      },
      embedding_dependency: {
        type: 'deployment_name',
        deployment_name: EMBEDDING_MODEL,
      },
    },
  },
];

const DATA_SOURCE_2: DataSource[] = [
  {
    type: 'azure_search',
    parameters: {
      endpoint: SEARCH_ENDPOINT,
      index_name: SEARCH_KEYWORD_INDEX_NAME,
      semantic_configuration: 'default',
      query_type: 'simple',
      in_scope: true,
      role_information:
        'You are a joyful assistant called Bizbot that helps clients in researching businesses and reviews.',
      strictness: 3,
      top_n_documents: 5,
      authentication: {
        type: 'api_key',
        key: process.env.SEARCH_API_KEY!,
      },
    },
  },
];
*/
const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'getAllBusinesses',
      description:
        'Get all the existing businesses stored in the mongodb database.',
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
      name: 'getAllReviews',
      description:
        'Get all the existing reviews stored in the mongodb database.',
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
  { name: 'getAllReviews', func: getAllReviews },
];

/*
export const getRecommendations = async (prompt: string) => {
  const {
    choices: [
      {
        message: { content },
      },
    ],
  } = (await (AZURE.chat.completions as unknown as Completions).create({
    model: AZURE_BASE_MODEL,
    messages: [
      ...CONTEXT,
      {
        role: 'user',
        content: prompt,
      },
    ],
    data_sources: DATA_SOURCE_2,
  })) as ChatCompletion;

  return content;
};
*/

export const getRecommendations = async (prompt: string) => {
  CONTEXT.push({
    role: 'user',
    content: prompt,
  });
  const [response, newContext] = await generatorChat(CONTEXT, HANDLERS, TOOLS);

  CONTEXT.splice(1, CONTEXT.length - 1);

  const filteredContext = newContext.filter(
    ctx => ctx.content !== null && ctx.role !== 'tool' && ctx.role !== 'system'
  );
  CONTEXT.push(...filteredContext);

  //CONTEXT.push({ role: 'assistant', content: response });

  return response;
};

export const clearContext = () => {
  if (CONTEXT.length === 1) return;
  CONTEXT.splice(1, CONTEXT.length - 1);
};
