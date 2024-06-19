import { CallbackType } from "@/customTypes/types";
import BaseComponent from "../BaseComponent";
import Button from "../tags/button/Button";
import Input from "../input/Input";
import classes from './Form.module.scss'
import { UserInfo } from "@/interfaces/interfaces";
import { isValid } from "@/utils/checkValidity";
import Div from "../tags/div/Div";

export default class Form extends BaseComponent<HTMLFormElement> {
  private password: Input;

  private login: Input;

  private loginErrorMessage: Div;

  private passwordErrorMessage: Div;

  private submitButton: Button;

  private gotToAboutButton: Button;

  private userInfo: UserInfo

  constructor(
    userInfo: UserInfo,
    handleClick: CallbackType,
    handleChange: CallbackType,
    gotoAbout: CallbackType,
  ) {
    super({
      tag: 'form',
      classes: [classes.form],
    });
    this.userInfo = userInfo;
    this.submitButton = new Button(
      {
        classes: [classes.submitButton],
        txt: 'Submit'
      },
      (e) => {
        e.preventDefault();
        if (isValid(userInfo.login, userInfo.password || '')) {
          handleClick(e);
        }
      }
    );
    this.gotToAboutButton = new Button({
      txt: 'Info',
      id: 'info',
    }, gotoAbout)
    this.login = new Input({ 
      placeholder: 'Enter the username.',
      id: 'login',
      name: 'login',
      txt: userInfo.login,
      callback: (e) => {
        handleChange(e);
        if (isValid(userInfo.login)) 
        {
          this.activateButton();
          this.loginErrorMessage.setTextContent('');
        } 
        else 
        {
          this.loginErrorMessage.setTextContent('Username field must contain uppercase letters and to be at least 4 characters long!')
        }
      },
    });
    this.password = new Input({ 
      placeholder: 'Enter the password.',
      id: 'password',
      name: 'password',
      txt: userInfo.password || '',
      callback: (e) => {
        handleChange(e);
        if (isValid(userInfo.password || '')) 
          {
            this.activateButton();
            this.passwordErrorMessage.setTextContent('');
          } 
          else 
          {
            this.passwordErrorMessage.setTextContent('Password field must contain uppercase letters and to be at least 4 characters long!')
          }
      },
    });
    this.loginErrorMessage = new Div({});
    this.passwordErrorMessage = new Div({});
    this.appendChildren(
      new Div({classes: [classes.field],}, this.login, this.loginErrorMessage),
      new Div({classes: [classes.field],}, this.password, this.passwordErrorMessage),
      new Div({
        classes: [classes.buttons]
      }, 
        this.submitButton, this.gotToAboutButton)
    );
    this.activateButton();
  }

  private activateButton() {
    if (isValid(this.userInfo.password || '', this.userInfo.login)) {
      this.submitButton.addClasses([classes.active]);
    } else {
      this.submitButton.removeClass(classes.active);
    }
  }
}