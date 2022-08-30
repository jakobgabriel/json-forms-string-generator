import React, { useEffect } from 'react'

import JSONInput from 'react-json-editor-ajrm'
import locale from 'react-json-editor-ajrm/locale/en'

import './jsonInput.scss'

const JsonInput = ({ id, name, setValue, error, value }) => {
  useEffect(() => {
    if (error)
      document.getElementById(`${id}-outer-box`).style.border =
        '1px solid rgb(255 147 147)'
    else
      document.getElementById(`${id}-outer-box`).style.border =
        '1px solid #CDD2D7'
  }, [error])

  return (
    <JSONInput
      onChange={(e) => setValue(name, e.jsObject)}
      id={id}
      placeholder={value}
      confirmGood={false}
      // placeholder={sampleObject}
      // colors={darktheme}
      theme="light_mitsuketa_tribute"
      locale={locale}
      height="100%"
      width="100%"
      colors={{
        background: '#F3F6F9',
        default: '#111',
        keys: '#2f2fff',
        string: 'green',
        number: 'orange',
      }}
      style={{
        outerBox: {
          overflow: 'hidden',
          borderRadius: '8px',
          border: `1px solid '#CDD2D7'}`,
          transition: 'border 0.3s',
        },
        labelColumn: {
          width: '30px',
        },

        body: {
          fontSize: '12px',
        },
      }}
    />
  )
}

export default JsonInput
