import BaseComponent from "../BaseComponent";
import Div from "../tags/div/Div";
import classes from './MessageInfo.module.scss'

export default class MessageInfoBlock extends BaseComponent<HTMLDivElement> {
  private sender: Div;

  private time: Div;

  constructor() {
    super({
      tag: 'div',
      classes: [classes.info],
    });

    this.sender = new Div({});
    this.time = new Div({});

    this.appendChildren(this.sender, this.time);
  }

  public render(sender: string, datetime: number) {
    this.sender.setTextContent(sender);

    this.time.setTextContent(this.formatDate(datetime));
  }

  private formatDate(datetime?: number) {
    if (!datetime) {
      throw new TypeError('datetime is not defined');
    }
    const txt = new Date(datetime);

    return `${txt.toLocaleDateString()} ${txt.toLocaleTimeString()}`;
  }
}