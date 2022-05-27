import { UPDATEISOPEN } from '../../actions/types'

const isOpenReducer = (
  state = {
    isMasterExpanded: false,
    isLoadingOpen: false,
  },
  action
) => {
  if (action.type === UPDATEISOPEN) {
    return { ...state, ...action.payload }
  }
  return state
}

export default isOpenReducer
