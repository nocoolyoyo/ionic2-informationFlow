import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { NewsData } from '../../providers/news-data';
import { NewsListDetailPage } from '../news-list-detail/news-list-detail';
import { CirclesDetailPage } from '../circles-detail/circles-detail';


@Component({
  selector: 'page-speaker-list',
  templateUrl: 'circles.html'
})
export class CirclesPage {
  actionSheet: ActionSheet;
  speakers = [];

  constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public confData: NewsData, public config: Config) {}

  ionViewDidLoad() {
    this.confData.getSpeakers().subscribe(speakers => {
      this.speakers = speakers;
    });
  }

  goToSessionDetail(session) {
    this.navCtrl.push(NewsListDetailPage, session);
  }

  goToSpeakerDetail(speakerName: any) {
    this.navCtrl.push(CirclesDetailPage, speakerName);
  }

  goToSpeakerTwitter(speaker) {
    // TODO fix error
    let browser = new InAppBrowser(`https://twitter.com/${speaker.twitter}`, '_blank');

    browser.on('loadstop')
      .subscribe((ev) => {
        console.log('InAppBrowser loaded!');
      });
  }

  openSpeakerShare(speaker) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: ($event) => {
            console.log('Copy link clicked on https://twitter.com/' + speaker.twitter);
            if (window['cordova'] && window['cordova'].plugins.clipboard) {
              window['cordova'].plugins.clipboard.copy('https://twitter.com/' + speaker.twitter);
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  openContact(speaker) {
    let mode = this.config.get('mode');

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        }
      ]
    });

    actionSheet.present();
  }
}
