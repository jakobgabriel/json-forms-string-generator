import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv()
addFormats(ajv)

export const isValidAjvScheme = (schema, ctx) => {
  try {
    return ajv.compile(schema)
  } catch (e) {
    console.log(e)

    return ctx.createError({ message: e.message })
  }
}

export const isJson = (jsonString) => {
  try {
    var o = jsonString
    if (o && typeof o === 'object') {
      return o
    }
  } catch (e) {}
  return false
}

export const isJsonEmpty = (json) => {
  return json ? Object.keys(json).length : false
}

export const isJsonWithElements = (schema) => {
  try {
    return returnElements(schema)
  } catch (e) {}
  return false
}

export const returnElements = (schema) => {
  if (schema.elements) {
    let data = schema.elements.map((element) => {
      if (element.scope) return element.scope.split('/').pop()
      else if (element.elements) return returnElements(element)
    })
    return data.flat().filter((e) => e)
  }
  return [schema.scope.split('/').pop()]
}
