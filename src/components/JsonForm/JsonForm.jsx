import { useState, useEffect } from 'react'
import './jsonForm.scss'

import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'

import { flatten } from '../../functions'

const JsonForm = ({ activeScheme }) => {
  const [data, setData] = useState({})
  const [copied, setIsCopied] = useState(false)

  const clearData = () => {
    setData({})
  }

  useEffect(() => {
    setData({})
  }, [])

  const copyData = () => {
    let flattenedData = flatten(data)

    let seperator = activeScheme.seperator ? activeScheme.seperator : ','

    let string = ''
    activeScheme.dataOrder.map((dataPoint) => {
      if (flattenedData[dataPoint])
        if (string) string = string + seperator + flattenedData[dataPoint]
        else string = flattenedData[dataPoint]
    })

    navigator.clipboard
      .writeText(
        string
        // Object.values(flatten(data)).join(seperator)
      )
      .then(
        function () {
          setIsCopied(true)

          setTimeout(() => {
            setIsCopied(false)
          }, 500)
        },
        function (err) {
          alert('Unable to copy !')
        }
      )
  }

  return (
    <div id="jsonForm" className="jsonForm">
      {activeScheme ? (
        <>
          <JsonForms
            schema={activeScheme.schema}
            uischema={activeScheme.uischema}
            data={data}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ errors, data }) => {
              if (Object.keys(data).length > 0) setData(data)
            }}
          />

          <div className="jsonForm__group">
            <button onClick={clearData} className="jsonForm__btn">
              <svg>
                <use xlinkHref="./svg/trash-alt.svg#trash-alt"></use>
              </svg>
            </button>

            <button onClick={copyData} className={`jsonForm__btn`}>
              {copied ? (
                <svg>
                  <use xlinkHref="./svg/check.svg#check"></use>
                </svg>
              ) : (
                <svg>
                  <use xlinkHref="./svg/copy-alt.svg#copy-alt"></use>
                </svg>
              )}
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default JsonForm
