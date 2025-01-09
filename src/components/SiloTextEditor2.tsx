// import './styles.scss'
import './../styles/editor.css';
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {FC} from 'react'
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { FormatListBulletedRounded, RedoOutlined, UndoOutlined, FormatListNumberedRounded, FormatBoldRounded, FormatItalicRounded } from '@mui/icons-material';

interface MenuBarProps {

editor:Editor | null;
}


interface MenuToolbarProps {

  className: string;
  editor: Editor | null;
}



const MenuBar : FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </button>
        <button onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </button>
      </div>
    </div>
  )
}

const MenuToolbar : FC<MenuToolbarProps>= ({className, editor}) =>{
  if (!editor) {
    return null
  }
  return (
    <div className={className}>
      <div><h1>SiloNote</h1></div>
       <Toolbar 
      sx={{ display: 'flex', }}
      >
       
      <div>
        <Button  onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}>
        <FormatBoldRounded className='icon'/>
        </Button>
        <Button  onClick={() => editor.chain().focus().toggleItalic().run()}
          
          className={editor.isActive('italic') ? 'is-active' : ''}>
       <FormatItalicRounded className='icon'/>
        </Button>
         {/* undo button */}
        <Button onClick={() => editor.chain().focus().undo().run()}>
        <UndoOutlined className='icon' />
        </Button>
         {/* redo button */}
        <Button  onClick={() => editor.chain().focus().redo().run()}>
        <RedoOutlined className='icon'/>
        </Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <FormatListBulletedRounded className='icon'/>
        </Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <FormatListNumberedRounded className='icon'/>
        </Button>
        <br/>
        
      </div>

      <div>
      
      </div>
      
      </Toolbar>
    </div>
  );
}

export default () => {
  const editor: Editor |null = useEditor({
    extensions: [
      StarterKit,
    ],
    editorProps: {
      attributes: {
        spellcheck: 'false',
      },
    },
  })

  const saveFile = async (event : React.MouseEvent<HTMLButtonElement>) =>{
    console.log("SaveFile --- data is: ", event);
    const fileName = "newFileName.txt";

    let path = await window.electron.openFileDialog();
    path = path +"/"+fileName
    console.log("Path to write in: ", path);
    let content = (editor!=null ? editor.getText():"test");
    if(path !=null){
      const data = await window.electron.writeFile(path, content);
      console.log(data);
    }
    
  }

  return (
    <div style={{margin:'auto'}}>
      {/* <MenuBar editor={editor} />
      <br/> */}
      <MenuToolbar  className='MenuToolbar' editor={editor} />
      <br/>
      <EditorContent 
      id='editor'
      editor={editor} 
      className='editor'
        
      />
      <Button onClick={saveFile}>Save</Button>
    </div>
  )
}