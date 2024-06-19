import BaseComponent from "../BaseComponent";
import classes from './ErrorMessage.module.scss'

export default class ErrorMessage extends BaseComponent<HTMLDivElement> {
  constructor(msg: string) {
    super({
      tag: 'div',
      classes: [classes.errorMessage],
      txt: msg,
    })
  }
}