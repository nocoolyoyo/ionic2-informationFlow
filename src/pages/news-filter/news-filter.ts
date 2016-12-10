import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { NewsData } from '../../providers/news-data';


@Component({
  selector: 'page-news-filter',
  templateUrl: 'news-filter.html'
})
export class NewsFilterPage {
  labels: Array<{name: string, isChecked: boolean}> = [];

  constructor(
    public newsData: NewsData,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    // passed in array of track names that should be excluded (unchecked)
    let excludedLabelNames = this.navParams.data;

    this.newsData.getLabels().subscribe((labelNames: string[]) => {

      labelNames.forEach(labelName => {
        this.labels.push({
          name: labelName,
          isChecked: (excludedLabelNames.indexOf(labelName) === -1)
        });
      });

    });
  }

  resetFilters() {
    // reset all of the toggles to be checked
    this.labels.forEach(track => {
      track.isChecked = true;
    });
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    let excludedlabelNames = this.labels.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedlabelNames);
  }

  dismiss(data?: any) {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss(data);
  }
}
