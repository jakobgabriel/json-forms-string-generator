export const isObjectEmpty = (object) => {
  return (
    object && // 👈 null and undefined check
    Object.keys(object).length === 0 &&
    Object.getPrototypeOf(object) === Object.prototype
  )
}

/////////////////////////////////////////////////
export const generateCombo = (data, comboValues) => {
  let combo = ''
  Object.entries(data).map(([key, data]) => {
    let randomValue = data[Math.floor(Math.random() * data.length)]

    if (!comboValues[key].isDisabled) {
      if (comboValues[key].isLocked)
        comboValues[key].value === ''
          ? null
          : (randomValue = comboValues[key].value)

      combo = combo + (combo ? ', ' : '') + randomValue
      comboValues[key] = { ...comboValues[key], value: randomValue }
    } else {
      comboValues[key] = { ...comboValues[key], value: '' }
    }
  })
  return { combo, comboValues }
}

///////////////////////////////////////

export const generateComboFromSaved = (data, savedTake) => {
  if (!savedTake.isLocked) {
    let randomCombo = data[Math.floor(Math.random() * data.length)]

    if (!randomCombo) randomCombo = savedTake.combo
    return { ...savedTake, combo: randomCombo }
  } else return savedTake
}

export const generateComboFromSavedAll = (data, savedTakes) => {
  let newSavedTake = {}
  Object.values(savedTakes).map((savedTake) => {
    if (!savedTake.isLocked) {
      let randomCombo = data[Math.floor(Math.random() * data.length)]
      if (!randomCombo) randomCombo = savedTake.combo

      newSavedTake[savedTake.id] = { ...savedTake, combo: randomCombo }
    } else newSavedTake[savedTake.id] = savedTake
  })
  return newSavedTake
}

export const generateComboFromSavedAllForIndies = (savedCombos, savedTakes) => {
  let newSavedTake = {}
  Object.values(savedTakes).map((savedTake) => {
    if (!savedTake.isLocked) {
      let data = savedCombos[savedTake.indy]
      let randomCombo = data[Math.floor(Math.random() * data.length)]

      if (!randomCombo) randomCombo = savedTake.combo

      newSavedTake[savedTake.id] = { ...savedTake, combo: randomCombo }
    } else newSavedTake[savedTake.id] = savedTake
  })
  return newSavedTake
}

export const generateComboFromAddedTakesAllForIndies = (indies, savedTakes) => {
  let newSavedTake = {}
  Object.values(savedTakes).map((savedTake) => {
    if (!savedTake.isLocked) {
      let data = Object.values(indies[savedTake.indyId].savedTakes).map(
        (take) => take.combo
      )

      let randomCombo = data[Math.floor(Math.random() * data.length)]
      if (!randomCombo) randomCombo = savedTake.combo

      newSavedTake[savedTake.id] = { ...savedTake, combo: randomCombo }
    } else newSavedTake[savedTake.id] = savedTake
  })
  return newSavedTake
}

///////////////////////////////////////

export const getActives = (state) => {
  let activeUniVariation = { masterSessions: {}, isSaved: true }
  let activeMasterSession = {}
  let activeIndy = {}
  let activeIndyVariation = {}

  if (!isObjectEmpty(state.unis)) {
    activeUniVariation =
      state.unis.variations[state.unis.activeUniViewVariation.id]
    activeMasterSession =
      activeUniVariation.masterSessions[
        activeUniVariation.activeMasterSession.id
      ]
    if (activeMasterSession) {
      if (activeMasterSession.activeIndy.type === 'INDY') {
        activeIndy =
          activeMasterSession.indies[activeMasterSession.activeIndy.id]

        activeIndyVariation =
          activeMasterSession.masterView[
            activeMasterSession.activeMasterViewVariation.id
          ].indies[activeMasterSession.activeIndy.id]
      } else activeIndy = activeMasterSession.activeIndy
    }
  }

  let isUniOpened = !isObjectEmpty(state.unis)

  if (!activeMasterSession) activeMasterSession = {}
  if (!activeIndy) activeIndy = {}
  if (!activeIndyVariation) activeIndyVariation = {}

  return {
    activeUniVariation,
    activeMasterSession,
    activeIndy,
    activeIndyVariation,
    isUniOpened,
  }
}
