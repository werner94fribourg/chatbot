import { fetchChatbotAnswer, fetchClearContext } from '@/api_calls/calls';
import { createSlice, Dispatch } from '@reduxjs/toolkit';

interface ChatState {
  questions: string[];
  answers: string[];
  isLoading: boolean;
}

const initialState: ChatState = {
  questions: [],
  answers: ["Hi, I'm your friend Bizbot, How can I help you?"],
  isLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    askQuestion(state, action) {
      const {
        payload: { question },
      } = action;

      state.questions.push(question);
      state.isLoading = true;
    },
    addAnswer(state, action) {
      const {
        payload: { answer },
      } = action;

      state.answers.push(answer);
      state.isLoading = false;
    },
    addErrorAnswer(state, action) {
      const {
        payload: { message },
      } = action;

      state.answers.push(message);
      state.isLoading = false;
    },
    setLoadingState(state, action) {
      const {
        payload: { isLoading },
      } = action;

      state.isLoading = isLoading;
    },
    clearContext(state) {
      state.answers = ["Hi, I'm your friend Bizbot, How can I help you?"];
      state.questions = [];
      state.isLoading = false;
    },
  },
});

const chatActions = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

export const askChatbot = async (question: string, dispatch: Dispatch) => {
  dispatch(chatActions.askQuestion({ question }));
  const { valid, data: answer, message } = await fetchChatbotAnswer(question);
  if (!valid) {
    dispatch(chatActions.addErrorAnswer({ message }));
    return;
  }

  dispatch(chatActions.addAnswer({ answer }));
};

export const clearContext = async (dispatch: Dispatch) => {
  dispatch(chatActions.setLoadingState({ isLoading: true }));

  const { valid } = await fetchClearContext();

  if (!valid) {
    dispatch(chatActions.setLoadingState({ isLoading: false }));
    return;
  }

  dispatch(chatActions.clearContext());
};
