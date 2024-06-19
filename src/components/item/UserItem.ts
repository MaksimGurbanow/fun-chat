import BaseComponent from "../BaseComponent";
import Div from "../tags/div/Div";
import classes from './UserItem.module.scss'
import { UserInfo } from "@/interfaces/interfaces";

export default class UserItem extends BaseComponent<HTMLDivElement> {
  private userName: Div;

  private statusBlock: Div;

  private unreadMessages: Div;

  constructor(
    userInfo: UserInfo,
    callback: (user: UserInfo) => void,
  ) {
    const { login, isLogined } = userInfo;
    super({
      tag: 'div',
      classes: [classes.item],
      events: [
        {
          eventType: 'click',
          callback: (e) => {
            callback(userInfo);
          }
        }
      ]
    });

    this.userName = new Div({
      tag: 'div',
      txt: login,
      classes: [classes.user],
    });
    const status = isLogined ? 'online' : 'offline';
    this.statusBlock = new Div({
      tag: 'div',
      txt: status,
      classes: [classes.status],
    });
    this.unreadMessages = new Div({
      tag: 'div',
      classes: [classes.unread],
    })
    this.appendChildren(new Div({
      classes: [classes.userInfoBlock],
    },
      this.userName,
      this.statusBlock,
    ), this.unreadMessages);
  }

  public updateItem(userInfo: UserInfo) {
    const status = userInfo.isLogined ? 'online' : 'offline';
    this.statusBlock.setTextContent(status);
    this.userName.setTextContent(userInfo.login);
  }

  public displayUnreadMessages(quantity?: number) {
    const number = quantity || '';
    this.unreadMessages.setTextContent(number as string);
  }

  public hide() {
    this.addClasses([classes.hidden])
  }

  public show() {
    this.removeClass(classes.hidden)
  }
}