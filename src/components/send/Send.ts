import createSvg from "@/utils/createSvg";
import BaseComponent from "../BaseComponent";
import Input from "../input/Input";
import classes from './Send.module.scss';
import send from '@/assets/images/send.svg';
import Div from "../tags/div/Div";

export default class Send extends BaseComponent<HTMLDivElement> {
  private input: Input;

  private sendicon = createSvg(send);

  constructor(
    setMessage: (v: string) => void,
    send: () => void,
  ) {
    super({
      tag: 'div',
      classes: [classes.send],
    });

    this.input = new Input({
      placeholder: 'Enter the message',
      name: 'message',
      id: 'message',
      txt: '',
      callback: (e) => {
        const { target } = e;
        if (target instanceof HTMLInputElement) {
          setMessage(target.value);
          if (target.value) {
            this.sendicon.classList.add(classes.active);
          } else {
            this.sendicon.classList.remove(classes.active);
          }
        }
      }
    });

    this.sendicon.classList.add(classes.icon);
    this.sendicon.onclick = send;

    this.appendChildren(this.input, this.sendicon);
  }

  public clearInput() {
    this.input.clear();
  }

  public setInputValue(value: string) {
    this.input.set(value);
  }
}