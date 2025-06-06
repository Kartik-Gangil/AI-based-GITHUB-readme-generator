import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function MD_viewer({Source}) {
  

  return (
    <MarkdownPreview source={Source} style={{ padding: 16 }} />
  )
}