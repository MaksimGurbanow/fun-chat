import { CallbackType } from "@/customTypes/types";
import BaseComponent from "../BaseComponent";
import Nav from "../nav/Nav";
import classes from './Header.module.scss'
import { UserInfo } from "@/interfaces/interfaces";

export default class Header extends BaseComponent<HTMLDivElement> {
  private nav: Nav;


  constructor(
    callback: CallbackType,
    gotoInfo: CallbackType,
  ) {
    super({
      tag: 'div',
      classes: [classes.header],
    });
    this.nav = new Nav(
      callback,
      gotoInfo,
    );
    this.appendChildren(this.nav);
  }

  public render(value: string) {
    this.nav.render(value);
  }
}