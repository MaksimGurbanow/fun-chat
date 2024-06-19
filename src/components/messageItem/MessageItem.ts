import { MessageInfo } from "@/interfaces/interfaces";
import BaseComponent from "../BaseComponent";
import Div from "../tags/div/Div";
import classes from './MessageItem.module.scss';
import MessageInfoBlock from "../messageInfo/MessageInfo";
import MessageOptions from "../messageOptions/MessageOptions";
import MessageDeliveryInfo from "../messageDeliveryInfo/MessageDeliveryInfo";

export default class MessageItem extends BaseComponent<HTMLDivElement> {
  private messageDescription: MessageInfoBlock;

  private messageDeliveryInfo: MessageDeliveryInfo;

  private messageText: Div;

  private messageInfo: MessageInfo;

  private messageOptions: MessageOptions | null = null;

  constructor(
    props: MessageInfo,
    renderOptions: (id: string) => void,
  ) {
    const { to, from, text, id } = props;
    super({
      tag: 'div',
      classes: [classes.message],
      events: [
        {
          eventType: 'click',
          callback: (e) => {
            e.stopPropagation()
            renderOptions(id || '')
          },
        }, 
        {
          eventType: 'contextmenu',
          callback: (e) => {
            e.preventDefault();
            e.stopPropagation()
            renderOptions(id || '');
          },
        }
      ]
    });
    this.messageInfo = props;
    this.messageDescription = new MessageInfoBlock();
    this.messageDeliveryInfo = new MessageDeliveryInfo();
    this.messageText = new Div({
      txt: text,
      tag: 'div',
      classes: [classes.text]
    });
    this.setAttributes([{
      'to': to || '',
      'from': from || '',
      'id': id || '',
    }]);
    this.appendChildren(this.messageDescription, this.messageText, this.messageDeliveryInfo);
  }

  public displayLeft() {
    this.addClasses([classes.left]);
  }

  public displayRight() {
    this.addClasses([classes.right]);
  }

  public render(text: string, status: string, sender: string, isEdited: boolean = false, datetime?: number) {
    this.messageDescription.render(
      sender, 
      datetime || this.messageInfo.datetime!
    );
    this.messageText.setTextContent(text);
    this.messageDeliveryInfo.render(status, isEdited);
  }

  public removeOptions() {
    this.messageOptions?.destroy();
  }
}