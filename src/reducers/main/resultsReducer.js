import {} from "../../actions/types"

const resultsReducer = (state = {}, action) => {
  switch (action.type) {
    case null: {
      return { ...state }
    }

    default: {
      return state
    }
  }
}

export default resultsReducer
