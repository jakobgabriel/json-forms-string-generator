import React, { useState, useEffect } from 'react'
import './documentation.scss'
import './github-marcdown.css'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import readme from './docs.md'

const Documentation = () => {
  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    fetch(readme)
      .then((response) => response.text())
      .then((text) => {
        setMarkdown(text)
      })
  }, [])

  return (
    <div className="documentation markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  )
}

export default Documentation
