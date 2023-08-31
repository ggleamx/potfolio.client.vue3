
import { ref,Ref } from 'vue';

type State = {

  isLoading: Ref<boolean>;
  isSuccess: Ref<boolean>;
  errorMessage: Ref<string>;
};

const state: State = {

  isLoading: ref(false),
  isSuccess: ref(false),
  errorMessage: ref(''),
}



export const useStore = () => {
  return {
    ...state,
  };
};
