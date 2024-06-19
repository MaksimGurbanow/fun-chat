import BaseComponent from "../BaseComponent";
import Logo from "../logo/Logo";
import classes from './Footer.module.scss';
import rssLogoPath from '@/assets/images/logo-rsschool3.png';
import githubLogoPath from '@/assets/images/github.jpg'
import Div from "../tags/div/Div";

enum Links {
  GIT_HUB = 'https://github.com/MaksimGurbanow',
  RS_SCHOOL = 'https://github.com/MaksimGurbanow',
}

export default class Footer extends BaseComponent<HTMLDivElement> {
  constructor() {
    super({
      tag: 'div',
      classes: [classes.footer],
    });
    const logos = new Div({ classes: [classes.logos] })
    const rssBlock = new Logo({
      src: rssLogoPath,
      width: 40,
      height: 20,
    }, 'RSSchool', () => this.goTo(Links.RS_SCHOOL));
    const githubBlock = new Logo({
      src: githubLogoPath,
      width: 40,
      height: 40,
      style: 'border-radius: 50%'
    }, 'MaksimGurbanow', () => this.goTo(Links.GIT_HUB));
    logos.appendChildren(rssBlock, githubBlock);
    this.appendChildren(logos, new Div({ txt: 'Created in 2024/18/04' }));
  }

  private goTo(link: string) {
    window.location.assign(link);
  }
}