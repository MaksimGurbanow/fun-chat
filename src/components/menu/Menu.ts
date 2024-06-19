import BaseComponent from "../BaseComponent";
import Header from "@/components/header/Header";
import classes from './Menu.module.scss'
import Content from "../content/Content";
import Footer from "../footer/Footer";
import {
  MessageInfo, 
  RequestCallback, 
  UserInfo,
  UserState
 } from "@/interfaces/interfaces";
import { CallbackType } from "@/customTypes/types";

export default class Menu extends BaseComponent<HTMLDivElement> {
  private header: Header | null = null;

  private content: Content | null = null;

  private footer: Footer | null = null;

  private user: UserState;
  
  constructor(
    user: UserState,
    callback: RequestCallback,
    sendMessage: () => void,
    gotoInfo: CallbackType,
  ) {
    super({
      tag: 'div',
      classes: [classes.menu],
    });
    this.user = user;
    this.header = new Header(
      (e) => callback('USER_LOGOUT'),
      gotoInfo
    );
    this.content = new Content(
      user,
      callback,
      sendMessage,
    );
    this.footer = new Footer();

    this.appendChildren(this.header, this.content, this.footer);
  }

  public setheaderContent() {
    this.header?.render(this.user.login);
  }

  public addUsers(...users: UserInfo[]) {
    this.content?.addUsers(users);
  }

  public getMessageHistory(...msg: MessageInfo[]) {
    this.content?.getMessageHistory(msg);
  }

  public addMessage(msg: MessageInfo) {
    this.content?.addMessage(msg);
  }

  public deleteMessage(msg: MessageInfo) {
    this.content?.deleteMessage(msg);
  }

  public editMessage(msg: MessageInfo) {
    this.content?.editMessage(msg)
  }

  public read(msg: MessageInfo){
    this.content?.read(msg);
  }

  public notify(msg: MessageInfo) {
    this.content?.notify(msg);
  }

  public clearInput() {
    this.content?.clearInput();
  }

}