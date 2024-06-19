import { CallbackType } from "@/customTypes/types";
import BaseComponent from "../BaseComponent";
import Form from "../form/Form";
import classes from './Login.module.scss'
import { UserInfo } from "@/interfaces/interfaces";
import ErrorMessage from "../errorMessage/ErrorMessage";

export default class Login extends BaseComponent<HTMLDivElement> {
  private form: Form;

  private errorMessage: ErrorMessage | null = null;

  constructor(
    userInfo: UserInfo,
    handleClick: CallbackType,
    handleChange: CallbackType,
    gotoAbout: CallbackType,
  ) {
    super({
      tag: 'div',
      classes: [classes.login],
    });
    this.form = new Form(
      userInfo,
      handleClick,
      handleChange,
      gotoAbout
    );
    this.errorMessage = new ErrorMessage('');
    this.appendChildren(this.form);
  }

  public renderError(msg: string) {
    this.errorMessage?.setTextContent(msg);
    this.appendChildren(this.errorMessage);
  }
}