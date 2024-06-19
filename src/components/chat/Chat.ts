import createSvg from "@/utils/createSvg";
import BaseComponent from "../BaseComponent"
import Div from "../tags/div/Div"
import classes from './Chat.module.scss';
import closeChat from '@/assets/images/left-arrow.svg';
import MessageField from "../messageField/MessageField";
import Send from "../send/Send";
import { MessageInfo, RequestCallback, UserInfo, UserState } from "@/interfaces/interfaces";
import ChatInfo from "../chatInfo/ChatInfo";

export default class Chat extends BaseComponent<HTMLDivElement> {
  private messageField: MessageField;

  private sendController: Send;

  private messages = new Map<string, MessageInfo>();

  private chatInfo: ChatInfo;

  private user: UserState;

  constructor(
    user: UserState,
    callback: RequestCallback,
    sendMessage: () => void,
  ) {
    super({
      tag: 'div',
      classes: [classes.chat],
    });
    this.user = user;
    this.chatInfo = new ChatInfo(
      this.close.bind(this),
    )
    this.messageField = new MessageField(
      user,
      callback,
      this.turnOnEditingMode.bind(this),
    );
  
    this.sendController = new Send(
      this.setMessage.bind(this),
      () => sendMessage(),
    );

    this.appendChildren(this.chatInfo, this.messageField, this.sendController);
  }
  public clearInput() {
    this.sendController.clearInput();
  }

  private setMessage(message: string) {
    this.user.txt = message;
  }

  public open(messages: MessageInfo[]) {
    this.close();
    this.chatInfo.render(this.user.recepient, this.user.isRecepientLogined);
    this.messageField.renderMessages(messages);
    messages.forEach((v) => {
      if (v.id) {
        this.messages.set(v.id, v);
      }
    });
  }

  public close() {
    this.chatInfo.clear();
    this.messages.clear();
  }

  public addMessageItem(message: MessageInfo) {
    this.messageField.renderMessages([message]);
    if (!message.id) {
      throw new Error('ID is not defined');
    }
    this.messages.set(message.id, message);
  }

  public deleteMessageItem(id: string) {
    this.messageField.deleteMessage(id);
  }
  
  public editMessageItem(message: MessageInfo) {
    const { id, text } = message;
    if (!id || !text) throw new Error('ID or text are not defined');
    if (this.messages.has(id)) this.messageField.update(message);
  }

  public read(message: MessageInfo) {
    const { id } = message;
    if (!id) throw new Error('ID is not defined');
    const messageToUpdateBlock = this.messages.get(id);
    if (
      messageToUpdateBlock && 
      messageToUpdateBlock.status &&
      message.status
    ) {
      messageToUpdateBlock.status.isReaded = message.status?.isReaded
    }
  }

  private turnOnEditingMode(msgId: string) {
    const choosenMessage = this.messages.get(msgId);
    this.sendController.setInputValue(choosenMessage?.text || '');
    this.user.isEditing = true;
    this.user.msgId = msgId;
  }

  public notify(message: MessageInfo) {
    if(this.messages.has(message.id || '')) {
      this.messageField.update(message);
    }
  }

}