import BaseComponent from "../BaseComponent";
import Button from "../tags/button/Button";
import Div from "../tags/div/Div";
import classes from './Nav.module.scss'
import { CallbackType } from "@/customTypes/types";

export default class Nav extends BaseComponent<HTMLDivElement> {
  private logoutButton: Button;

  private userNameBlock: Div;

  private appNameBlock: Div;

  private infoButton: Button;

  constructor(
    callback: CallbackType,
    gotoInfo: CallbackType,
  ) {
    super({
      tag: 'div',
      classes: [classes.nav],
    });
    this.logoutButton = new Button({
      classes: [classes.logoutButton],
      txt: 'Logout',
    }, callback);
    this.userNameBlock = new Div({
      classes: [classes.username],
    });
    this.appNameBlock = new Div({
      txt: 'fun chat',
      classes: [classes.appname]
    });
    this.infoButton = new Button({
      txt: 'Info'
    }, gotoInfo)
    this.appendChildren(this.appNameBlock, this.userNameBlock, this.logoutButton, this.infoButton);
  }

  public render(v: string) {
    this.userNameBlock.setTextContent(v);
  }
}