import { 
  MessageInfo, 
  RequestCallback, 
  UserInfo,
  UserState,
 } from "@/interfaces/interfaces";
import BaseComponent from "../BaseComponent";
import Chat from "../chat/Chat";
import List from "../list/List";
import classes from './Content.module.scss'

export default class Content extends BaseComponent<HTMLDivElement> {
  private userList: List;

  private chat: Chat;

  private user: UserState;

  private usersInfo = new Map<string, UserInfo>();

  private messagesHistory = new Map<string, MessageInfo[]>();

  constructor(
    user: UserState, 
    callback: RequestCallback,
    sendMessage: () => void,
  ) {
    super({
      tag: 'div',
      classes: [classes.content],
    });
    this.user = user;
    this.userList = new List(user,
      (v) => {
      this.user.recepient = v.login;
      this.user.isRecepientLogined = v.isLogined || false;
      
      this.openChat.bind(this)();
      const currentHistory = this.messagesHistory.get(v.login) || [];
      currentHistory
        .filter((msg) => !msg.status?.isReaded)
        .forEach((msg) => {
          callback('MSG_READ', { id: msg.id });
        });
    });
    this.chat = new Chat(
      user, 
      callback,
      sendMessage
    );
    this.appendChildren(this.userList, this.chat);
  }

  public addUsers(users: UserInfo[]) {
    users.forEach((user) => {
      const { login } = user;
      if (this.usersInfo.has(login)) {
        this.usersInfo.set(login, user);
      } else {
        this.usersInfo.set(login, user);
      }
    })
    this.userList.renderUsers(this.usersInfo);
  }

  private defineRecepient(message: MessageInfo): string {
    const recepient = 
      (message.from === this.user.login ? message.to : message.from) || '';

    if (!recepient) {
      this.messagesHistory.forEach((v, k) => {
        v.forEach((msg) => {
          if (msg.id === message.id) {
            return msg.from === this.user.login ? msg.to : msg.from
          }
        });
      });
    }
    return recepient;
  }

  public getMessageHistory(messages: MessageInfo[]) {
    const recepient = this.defineRecepient(messages[0]);
    this.messagesHistory.set(recepient!, messages);
    this.displayUnread();
  }

  private displayUnread() {
    this.messagesHistory.forEach((v, k) => {
      const quantity = v.filter((msg) => 
        msg.status?.isReaded === false && msg.to === this.user.login).length;
      this.userList.getItem(k)?.displayUnreadMessages(quantity);
    });
  }

  public addMessage(message: MessageInfo) {
    const recepient = this.defineRecepient(message);
    this.handleHistory(recepient, message);
    if (recepient === this.user.recepient) {
      this.chat.addMessageItem(message);
    }
  
    this.displayUnread();
  }

  private handleHistory(name: string, message: MessageInfo) {
    if (this.messagesHistory.has(name)) {
      this.messagesHistory.get(name)?.push(message);
    } else {
      this.messagesHistory.set(name, [message]);
    }
  }

  public deleteMessage(msg: MessageInfo) {
    this.messagesHistory.forEach((messages) => {
      const index = messages.findIndex((message) => message.id === msg.id);
      if (index !== -1) {
        messages.splice(index, 1);
      }
    });
    if (msg.id) {
      this.chat.deleteMessageItem(msg.id);
    }
  }

  public editMessage(msg: MessageInfo) {
    this.messagesHistory.forEach((messages) => {
      const index = messages.findIndex((message) => message.id === msg.id);
      if (index !== -1) {
        let { status, to, from } = messages[index];
        if (status && status.isEdited !== undefined) {
          status.isEdited = true;
          messages[index].text = msg.text || '';
        }
        this.chat.editMessageItem(messages[index]);
      }
    });
  }

  private openChat() {
    const mesHistory = this.messagesHistory.get(this.user.recepient) || [];
    console.log(mesHistory)
    this.chat.open(mesHistory);
  }

  public read(msg: MessageInfo) {
    this.chat.read(msg);
    this.displayUnread();
  }

  public clearInput() {
    this.chat.clearInput();
  }

  public notify(msg: MessageInfo) {
    this.messagesHistory.forEach((messages) => {
      const chosenMessage = messages.find((v) => v.id === msg.id);
      if (chosenMessage && chosenMessage.status) {
        chosenMessage.status = {
          ...chosenMessage.status,
          ...msg.status,
        }
        this.chat.notify(chosenMessage);
      }
    });
  }

}