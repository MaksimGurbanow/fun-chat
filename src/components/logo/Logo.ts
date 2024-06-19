import BaseComponent from "../BaseComponent";
import Div from "../tags/div/Div";
import Image from "../tags/imgTag/Image";
import classes from './Logo.module.scss'

export default class Logo extends BaseComponent<HTMLDivElement> {
  constructor(imgParams: {
    src: string,
    width: number,
    height: number,
    style?: string
  }, description: string, callback?: () => void) {
    super({
      tag: 'div',
      classes: [classes.logo]
    });

    const logoImg = new Image(imgParams)
    
    const descriptionBlock = new Div({
      txt: description,
      classes: [classes.description],
    });
    this.appendChildren(
      descriptionBlock,
      logoImg,
    );
    if (callback) {
      logoImg.setCallback([{eventType: 'click', callback}]);
      logoImg.addClasses([classes.active]);
      descriptionBlock.setCallback([{eventType: 'click', callback}]);
      descriptionBlock.addClasses([classes.active]);
    }
  }
}