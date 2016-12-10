import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AccountPage } from '../pages/account/account';
import { SupportPage } from '../pages/support/support';

import { NewsData } from '../providers/news-data';
import { UserData } from '../providers/user-data';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // tabs页面
  // 登陆后展示的菜单页面
  // 未登录时展示的菜单页面
  appPages: PageInterface[] = [
    { title: '新闻', component: TabsPage, icon: 'calendar' },
    { title: '商圈', component: TabsPage, index: 1, icon: 'contacts' },
    { title: '好友', component: TabsPage, index: 2, icon: 'map' },
    { title: '其他', component: TabsPage, index: 3, icon: 'information-circle' }
  ];
  loggedInPages: PageInterface[] = [
    { title: '账户', component: AccountPage, icon: 'person' },
    { title: '帮助', component: SupportPage, icon: 'help' },
    { title: '注销', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: '登录', component: LoginPage, icon: 'log-in' },
    { title: '帮助', component: SupportPage, icon: 'help' },
    { title: '注册', component: SignupPage, icon: 'person-add' }
  ];
  rootPage: any = TabsPage;

  constructor(
      public events: Events,
      public userData: UserData,
      public menu: MenuController,
      public platform: Platform,
      public newsData: NewsData,
      public storage: Storage
  ) {
    // 调用插件当平台准备完毕
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    // 默认页面
    this.rootPage = TabsPage;
    //读取tabs页面展示数据
    newsData.load();
    //判断是否登录然后展示是否登录的界面菜单


    // 检测是否初次进入APP
    this.userData.checkHasSeenTutorial().then((hasSeenTutorial) => {
      if (hasSeenTutorial === null) {
        //展示欢迎页面
        this.rootPage = WelcomePage;
      } else {
        //跳过欢迎页面
        this.rootPage = TabsPage;
      }
    });

    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });

    this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });

    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        this.userData.logout();
      }, 1000);
    }
  }
  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
}
