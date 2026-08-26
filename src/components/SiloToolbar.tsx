// import './styles.scss'
import './../styles/editor.css';
import { Editor } from '@tiptap/react'
import React, {FC} from 'react'
import {
  Toolbar,
} from '@mui/material'
import { FormatListBulletedRounded, RedoOutlined, UndoOutlined, FormatListNumberedRounded, FormatBoldRounded, FormatItalicRounded, DatasetLinkedRounded, PhotoLibraryRounded, TextSnippetRounded } from '@mui/icons-material';
import LinkListGui from './LinkListGui';
import { Drawer } from '@mui/material';
import {  SourceLinksType } from 'types/GlobalTypes';
import { RetroBtn, iconStyles, RetroTooltip,linkDrawerStyle } from './../styles/SiloTextBoxStyle';
import { ToggleActions } from './../types/GlobalTypes';

interface SiloToolBarProps {
    editor: Editor | null, 
    toggle: (obj: string) => void,
    linkSection: boolean, 
    srcLinks: SourceLinksType[], 
    setToast: React.Dispatch<React.SetStateAction<string | null>>,
    updateLinks: (links: SourceLinksType[]) => void
};

const SiloToolBar : FC<SiloToolBarProps> = ({editor, toggle, linkSection, srcLinks, setToast, updateLinks}) => {
  
  
    return <div className='MenuToolbar'>
      <div><h1><img id='logo' src={`${process.env.PUBLIC_URL}/img/silonote_logo.png`} alt='SiloNotelogo' /></h1></div>
      <Toolbar
        sx={{ display: 'flex', }}
      >
  
        <div>
          <RetroTooltip title="Bold" placement="top">
          <RetroBtn  onClick={() => editor?.chain().focus().toggleBold().run()}
            className={editor?.isActive('bold') ? 'is-active' : ''}>
            <FormatBoldRounded className='icon' />
          </RetroBtn>
          </RetroTooltip>
          <RetroTooltip title="Italic" placement="top">
          <RetroBtn onClick={() => editor?.chain().focus().toggleItalic().run()}
  
            className={editor?.isActive('italic') ? 'is-active' : ''}>
            <FormatItalicRounded className='icon' />
          </RetroBtn>
          </RetroTooltip>
          {/* undo button */}
          <RetroTooltip title="Undo" placement="top">
          <RetroBtn onClick={() => { editor?.chain().focus().undo().run(); } }>
            <UndoOutlined className='icon' />
          </RetroBtn>
          </RetroTooltip>
          {/* redo button */}
          <RetroTooltip title="Redo" placement="top">
          <RetroBtn onClick={() => editor?.chain().focus().redo().run()}>
            <RedoOutlined className='icon' />
          </RetroBtn>
          </RetroTooltip>
          <RetroTooltip title="Bullet List" placement="top">
          <RetroBtn onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <FormatListBulletedRounded className='icon' />
          </RetroBtn>
          </RetroTooltip>
          <RetroTooltip title="Numbered List" placement="top">
          <RetroBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <FormatListNumberedRounded className='icon' />
          </RetroBtn>
          </RetroTooltip>
          <RetroTooltip title="Links" placement="top">
          <RetroBtn onClick={() => toggle(ToggleActions.LINK)}>
            <DatasetLinkedRounded sx={iconStyles} />
          </RetroBtn>
          </RetroTooltip>
          <Drawer
            PaperProps={{
              sx: linkDrawerStyle,
            }}
            anchor='right'
            open={linkSection}
            onClose={() => toggle(ToggleActions.LINK)}>
            <LinkListGui links={srcLinks} setToast={(newToast: string) => setToast(newToast)} setLinks={updateLinks} />
          </Drawer>
          <RetroTooltip title="Mood Board" placement="top">
          <RetroBtn onClick={() => toggle(ToggleActions.MB)}>
            <PhotoLibraryRounded sx={iconStyles} />
          </RetroBtn>
          </RetroTooltip>
          <RetroTooltip title="Toggle Notes" placement="top">
          <RetroBtn onClick={() => toggle(ToggleActions.NOTES)}>
            <TextSnippetRounded sx={iconStyles} />
          </RetroBtn>
          </RetroTooltip>
        </div>
  
        <div>
  
        </div>
  
      </Toolbar>
    </div>;
  }
  
  export default SiloToolBar;