declare module "*.module.css";
declare module "*.module.scss";
declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
  }