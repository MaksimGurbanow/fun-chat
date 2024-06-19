import { Props } from './../../customTypes/types';
import BaseComponent from "../BaseComponent";
import Button from "../tags/button/Button";
import { CallbackType } from "@/customTypes/types";
import Div from "../tags/div/Div";
import classes from './Page.module.scss';

export default class Page extends BaseComponent<HTMLDivElement> {
  constructor(text: string, buttonText: string, handleClick: CallbackType) {
    super({
      tag: 'div',
      classes: [classes.page]
    });

    const content = new Div({
      tag: 'div',
      txt: text,
    })
    const goBackButton = new Button({
      txt: buttonText
    }, handleClick);

    this.appendChildren(content, goBackButton);
  }
}