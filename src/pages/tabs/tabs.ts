import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { NewsPage } from '../news/news';
import { CirclesPage } from '../circles/circles';
import { AboutPage } from '../about/about';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = NewsPage;
  tab2Root: any = CirclesPage;
 // tab3Root: any = MapPage;
  tab4Root: any = AboutPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
