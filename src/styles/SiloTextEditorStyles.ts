export const editorContainerStyle: React.CSSProperties = {
  margin:'0',
  height: '100%',
  width:'100%',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
  };


  export const textEditorOuterLayerStyle: React.CSSProperties =  {
    background: 'var(--silo-paper)',
    border: '1px solid var(--silo-ink)',
    boxShadow: '2px 2px 0 var(--silo-shadow)',
    borderRadius: '8px 6px 9px 7px',
    height: '100%',
    width: '100%',
    minHeight: 0,
    minWidth: 0,
    overflow: 'auto', /* Enable both horizontal and vertical overflow */
    wordWrap: 'break-word',
    whiteSpace: 'normal', /* Ensures that whitespace behaves normally */
  }

  export const notesOuterLayerStyle: React.CSSProperties =  {
    height: '100%',
    width: '100%',
    minHeight: 0,
  }