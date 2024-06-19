import { Props } from '../../../customTypes/types';
import { CallbackType } from "@/customTypes/types";
import BaseComponent from "../../BaseComponent";
import classes from './Button.module.scss'

export default class Button extends BaseComponent<HTMLButtonElement> {
  constructor(props: Props, handleClick?: CallbackType) {
    super({
      tag: 'button',
      events: [
        {
          eventType: 'click',
          callback: handleClick
        }
      ],
      txt: props.txt,
      classes: [classes.button]
    });
    if (props?.classes) {
      this.addClasses(props.classes);
    }
  }
}