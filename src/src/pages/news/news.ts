import { Component, ViewChild } from '@angular/core';

import { AlertController, App, ItemSliding, List, ModalController, NavController, LoadingController } from 'ionic-angular';

import moment from 'moment';

import { NewsData } from '../../providers/news-data';
import { NewsFilterPage } from '../news-filter/news-filter';
import { NewsListDetailPage } from '../news-list-detail/news-list-detail';
import { UserData } from '../../providers/user-data';


@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {
  // the list is a child of the schedule page
  // list是页面的一部分
  // @ViewChild('scheduleList') gets a reference to the list
  // @ViewChild定义了一个页面视图的一部分
  // with the variable #scheduleList, `read: List` tells it to return
  // 赋予页面视图 #newsList,详单与视图的一个ID，方便调用
  // the List and not a reference to the element
  //  该结构与标签无关，指向的是一个对象，相当于是DOM
  @ViewChild('newsList', { read: List }) newsList: List;

  sectionIndex = 0;
  queryText = '';
  segment = 'all';
  excludeLabels = [];
  shownLists: any = [];
  lists = [];
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public newsData: NewsData,
    public user: UserData,
  ) {}

  ionViewDidLoad() {
    this.app.setTitle('Schedule');
    this.updateNews();
  }

  updateNews() {
    // 更新list
    this.newsList && this.newsList.closeSlidingItems();
    this.newsData.getSections(this.sectionIndex, this.queryText, this.excludeLabels, this.segment).subscribe(data => {
      //let timestamp = data.date;

      /*使用第三方moment插件更新时间数据*/
      //this.confDate = moment(timestamp).format('MM/DD/YYYY');
      this.shownLists = data.shownLists;
      this.lists = data.lists;
    });
  }

  presentFilter() {
    let modal = this.modalCtrl.create(NewsFilterPage, this.excludeLabels);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        this.excludeLabels = data;
        this.updateNews();
      }
    });
  }

  goToNewsListDetail(listData) {
    //进入详情页
    //传入详情页数据
    this.navCtrl.push(NewsListDetailPage, listData);
  }

  addFavorite(slidingItem: ItemSliding, listData) {

    if (this.user.hasFavorite(listData.title)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, listData, 'Favorite already added');
    } else {
      // remember this session as a user favorite
      this.user.addFavorite(listData.title);

      // create an alert instance
      let alert = this.alertCtrl.create({
        title: '已收藏',
        buttons: [{
          text: '确定',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });
      // now present the alert on top of all other content
      alert.present();
    }

  }

  removeFavorite(slidingItem: ItemSliding, listData, title) {
    let alert = this.alertCtrl.create({
      title: title,
      message: '确定移除？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: '移除',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(listData.name);
            this.updateNews();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  openSocial(network, fab) {
    let loading = this.loadingCtrl.create({
      content: `Sharing in ${network}...`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }
}
