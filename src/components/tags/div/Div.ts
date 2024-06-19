import BaseComponent from "@/components/BaseComponent";
import { Props } from "@/customTypes/types";
import classes from './Div.module.scss'

export default class Div extends BaseComponent<HTMLDivElement> {
  constructor(props: Props, ...children: BaseComponent[]) {
    super({
      tag: 'div',
      txt: props.txt,
      classes: [classes.divBlock],
      events: props.events,
    });

    if (props.classes) {
      this.addClasses(props.classes);
    }

    this.appendChildren(...children);
  }
}