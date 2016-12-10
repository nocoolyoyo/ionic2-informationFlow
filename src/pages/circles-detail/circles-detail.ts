import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { NewsListDetailPage } from '../news-list-detail/news-list-detail';


@Component({
  selector: 'page-speaker-detail',
  templateUrl: 'circles-detail.html'
})
export class CirclesDetailPage {
  speaker: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.speaker = this.navParams.data;
  }

  goToNewsListDetail(session) {
    this.navCtrl.push(NewsListDetailPage, session);
  }
}
