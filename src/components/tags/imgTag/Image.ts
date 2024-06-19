import BaseComponent from "@/components/BaseComponent";

export default class Image extends BaseComponent<HTMLImageElement> {
  constructor(props: {
    src: string,
    width: number,
    height: number,
    style?: string
  }) {
    const { width, height, src, style } = props;
    super({
      tag: 'img',
    });

    this.setAttributes([
      { 'src': src },
      {'width': width},
      {'height': height},
      {'style': style || ''},
    ])
  }
}