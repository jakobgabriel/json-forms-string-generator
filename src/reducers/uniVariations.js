import { UPDATEUNIVARIATIONS } from "../actions/types"

const uniVariations = (
  state = {
    variations: {
      v0: { title: "core v", id: "v0" },
      v1: { title: "1st v", id: "v1" },
      v2: { title: "3rd v", id: "v2" },
    },
    activeUniViewVariation: { id: "v0" },
  },
  action
) => {
  if (action.type === UPDATEUNIVARIATIONS) {
    if (window.location.hash === "#fram/dashboard")
      ipcRenderer.send("state", { uniVariations: state })

    return state
  }
  return state
}

export default uniVariations
