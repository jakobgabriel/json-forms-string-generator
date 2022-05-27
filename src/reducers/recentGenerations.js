import { UPDATERECENTGENERATIONS } from "../actions/types"

const recentGenerations = (state = { indies: {} }, action) => {
  if (action.type === UPDATERECENTGENERATIONS) {
    return state
  }
  return state
}
export default recentGenerations
