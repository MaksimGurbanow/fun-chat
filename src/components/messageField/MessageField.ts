import { RequestCallback, UserState } from './../../interfaces/interfaces';
import { MessageInfo, UserInfo } from "@/interfaces/interfaces";
import BaseComponent from "../BaseComponent";
import MessageItem from "../messageItem/MessageItem";
import classes from './MessageField.module.scss'
import Div from "../tags/div/Div";
import MessageOptions from "../messageOptions/MessageOptions";

export default class MessageField extends BaseComponent<HTMLDivElement> {

  private divider: Div;

  private newChatMessage: Div;

  private user: UserState;

  private noUserSelectedMessage: Div;

  private messageItems = new Map<string, MessageItem>;

  private chosenMessageId = '';

  private messageOptions: MessageOptions;

  constructor(
    user: UserState,
    callback: RequestCallback,
    turnOnMode: (v: string) => void,
  ) {
    super({
      tag: 'div',
      classes: [classes.messageField],
      events: [
        {
          eventType: 'click',
          callback: (e) => {
            this.messageOptions.addClasses([classes.hidden]);
            this.divider.destroy();
          }
        }
      ]
    });
    this.user = user;
    this.divider = new Div({
      classes: [classes.divider],
      tag: 'div',
      txt: 'New messages',
    });
    this.newChatMessage = new Div({
      tag: 'div',
      classes: [classes.messageToUser],
    });
    this.noUserSelectedMessage = new Div({
      txt: 'Please select user',
      tag: 'div',
      classes: [classes.messageToUser],
    });
    this.messageOptions = new MessageOptions(
      () => {
        callback('MSG_DELETE', {
          id: this.chosenMessageId,
        });
      },
      () => {
        turnOnMode(this.chosenMessageId)
      },
    );

    this.appendChildren(this.noUserSelectedMessage);
  }

  private createItem(message: MessageInfo) {
    const { to, status, datetime, text, from } = message;
    const messageItem = new MessageItem(
      message, this.renderOptions.bind(this)
    );
    let statusMessage = '';
    if (!status?.isReaded) {
    }
    if (this.user.recepient === to) {
      messageItem.displayRight();
      statusMessage = this.defineStatus(status);
    } else {
      if (!status?.isReaded) {
        this.appendChildren(this.divider);
      }
      messageItem.displayLeft();
    }
    messageItem.render(text || '', statusMessage, from || '', status?.isEdited, datetime);
    return messageItem;
  }

  private defineStatus(statuses: MessageInfo['status']) {
    let status = '';
    if (statuses?.isDelivered) {
      status = 'delivered';
    }
    if (statuses?.isReaded) {
      status = 'read';
    }
    return status;
  }

  public renderMessages(messages: MessageInfo[]) {
    this.messageItems.clear();
    this.destroyChildren()
    messages.forEach((message) => {
      if (message.id) {
        this.messageItems.set(
          message.id, this.createItem(message),
        );
      }
    });
    this.appendChildren(...this.messageItems.values());
    this.scroll();
    this.newChatMessage.destroy();
    this.noUserSelectedMessage.destroy();
    if(!this.getChildren().length) {
      this.newChatMessage.setTextContent(`Start chatting with ${this.user.recepient}`);
      this.appendChildren(this.newChatMessage);
    }
  }

  public deleteMessage(id: string) {
    this.messageItems.get(id)?.destroy();
    this.messageItems.delete(id);
  }

  public update(message: MessageInfo) {
    const { id, text, status, from } = message;
    if (id && text && status && from) {
      const messageItem = this.messageItems.get(id);
      messageItem?.render(text, this.defineStatus(status), from, status?.isEdited);
    }
  }

  private scroll() {
    const messageItems = this.getChildren();
    const lastMessageItem = messageItems[messageItems.length - 1];
    if (lastMessageItem instanceof HTMLElement) {
      lastMessageItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  private renderOptions(id: string) {
    this.removeOptions();
    const element = this.messageItems.get(id)?.getElement() as HTMLElement;
    this.chosenMessageId = element.id;
    if (
      element?.getAttribute('from') === this.user.login &&
      this.messageOptions.getElement() instanceof Element
    ) {
      this.messageOptions.removeClass(classes.hidden);
      element?.appendChild(this.messageOptions.getElement());
    }
  }

  private removeOptions() {
    this.messageItems.forEach((v) => v.removeOptions());
  }

}