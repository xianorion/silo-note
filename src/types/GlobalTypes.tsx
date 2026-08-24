export type ImgListType = { id: string,data: string | null, name: string, note: string | null};
export type SiloNoteFile = { links: SourceLinksType[], imageRefs: ImgListType[], content: string, notes: NoteType[] };
export type SourceLinksType ={name: string, url: string, notes:string};
export enum ToggleActions {MB= 'MB', LINK='LINK', NOTES='NOTES'}
export type NoteType = {name: string, content:string};
