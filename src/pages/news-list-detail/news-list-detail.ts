import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';


@Component({
  selector: 'page-list-detail',
  templateUrl: 'news-list-detail.html'
})
export class NewsListDetailPage {
  list: any;

  constructor(public navParams: NavParams) {
    this.list = navParams.data;
  }
}
