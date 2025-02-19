export type ImgListType = { id: string,data: string, name: string, note: string | null};
export type SiloNoteFile = { links: SourceLinksType[], imageRefs: ImgListType[], content: string };
export type SourceLinksType ={name: string, url: string, notes:string};
export enum ToggleActions {MB= 'MB', LINK='LINK'}