import { useState } from 'react'
import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'

import './jsonForm.scss'

// const initialData = {
//   name: 'Send email to Adrian',
//   description: 'Confirm if you have passed the subject\nHereby ...',
//   done: true,
//   recurrence: 'Daily',
//   rating: 3,
// }

const JsonForm = ({ activeScheme }) => {
  const [data, setData] = useState({})
  const [copied, setIsCopied] = useState(false)

  // const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data])

  const clearData = () => {
    setData({})
  }

  const flatten = (ob) => {
    let result = {}
    for (const i in ob) {
      if (typeof ob[i] === 'object' && !Array.isArray(ob[i])) {
        const temp = flatten(ob[i])
        for (const j in temp) {
          result[j] = temp[j]
        }
      } else {
        result[i] = ob[i]
      }
    }
    return result
  }

  const copyData = () => {
    let seperator = window.localStorage.getItem('seperator')
      ? window.localStorage.getItem('seperator')
      : ','
    navigator.clipboard
      .writeText(Object.values(flatten(data)).join(seperator))
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
    <div className='jsonForm'>
      {activeScheme ? (
        <>
          <JsonForms
            schema={JSON.parse(activeScheme.schema)}
            uischema={JSON.parse(activeScheme.uischema)}
            data={data}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ errors, data }) => setData(data)}
          />

          <div className='jsonForm__group'>
            <button onClick={clearData} className='jsonForm__btn'>
              <svg>
                <use xlinkHref='./svg/trash-alt.svg#trash-alt'></use>
              </svg>
            </button>

            <button onClick={copyData} className={`jsonForm__btn`}>
              {copied ? (
                <svg>
                  <use xlinkHref='./svg/check.svg#check'></use>
                </svg>
              ) : (
                <svg>
                  <use xlinkHref='./svg/copy-alt.svg#copy-alt'></use>
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
