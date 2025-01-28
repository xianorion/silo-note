export type ImgListType = { data: string, name: string, note: string | null};
export type SiloNoteFile = { links: SourceLinksType[], imageRefs: ImgListType[], content: string };
export type SourceLinksType ={name: string, url: string, notes:string};
