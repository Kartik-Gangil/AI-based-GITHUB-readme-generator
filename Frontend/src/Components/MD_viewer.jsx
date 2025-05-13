import React, { useState } from 'react'
import { MarkdownEditor, MarkdownViewer } from 'react-github-markdown'
const MD_viewer = ({body}) => {
  const [markdown, setMarkdown] = useState(body)
  return (
    <div className='mx-95 mb-10 overflow-scroll'>
     
      <MarkdownViewer markdown={markdown}  />
    </div>
  )
}

export default MD_viewer
