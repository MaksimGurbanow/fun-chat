import createSvg from "@/utils/createSvg";
import BaseComponent from "../BaseComponent";
import classes from './ChatInfo.module.scss';
import leftArrow from '@/assets/images/left-arrow.svg'
import Div from "../tags/div/Div";
import { CallbackType } from "@/customTypes/types";

export default class ChatInfo extends BaseComponent<HTMLDivElement> {
  private closeChatButton = createSvg(leftArrow);

  private recepientNameBlock: Div;

  private statusBlock: Div;

  constructor(
    callback: CallbackType,
  ) {
    super({
      tag: 'div',
      classes: [classes.chatInfo],
    });
    this.closeChatButton.onclick = callback;
    this.recepientNameBlock = new Div({
    });
    this.statusBlock = new Div({});

    this.appendChildren(this.closeChatButton, this.recepientNameBlock, this.statusBlock);
  }

  public render(login: string, isLogined: boolean) {
    this.recepientNameBlock.setTextContent(login);
    if (isLogined) {
      this.statusBlock.setTextContent('online');
    } else {
      this.statusBlock.setTextContent('offline');
    }
  }

  public clear() {
    this.recepientNameBlock.setTextContent('');
    this.statusBlock.setTextContent('');
  }
}