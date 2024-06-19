import { MessageInfo } from "@/interfaces/interfaces";
import BaseComponent from "../BaseComponent";
import Div from "../tags/div/Div";
import classes from './MessageDeliveryInfo.module.scss';

export default class MessageDeliveryInfo extends BaseComponent<HTMLDivElement> {
  private status: Div;

  private isEdited: Div;

  constructor() {
    super({
      tag: 'div',
      classes: [classes.deliveryInfo],
    });
    this.status = new Div({});
    this.isEdited = new Div({});

    this.appendChildren(this.status, this.isEdited);
  }

  public render(status: string, isEdited: boolean) {
    this.status.setTextContent(status);
    if (isEdited) {
      this.isEdited.setTextContent('edited');
    }
  }
}