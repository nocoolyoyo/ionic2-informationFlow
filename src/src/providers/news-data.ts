import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class NewsData {
  data: any;

  constructor(public http: Http,
              public user: UserData) { }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/news.json')
        .map(this.processData);
    }
  }

  processData(data) {
    this.data = data.json();
    this.data.labels = [];

    this.data.news.forEach(section => {
      section.lists.forEach(list => {
        if (list.labels) {
          list.labels.forEach(label => {
            if (this.data.labels.indexOf(label) < 0) {
              this.data.labels.push(label);
            }
          });
        }
      })
    });
    return this.data;
  }

  getSections(sectionIndex, queryText = '', excludeLabels = [], segment = 'all') {
    return this.load().map(data => {
      let section = data.news[sectionIndex];
      console.log(data.news[0]);
      section.shownLists = 0;

      queryText = queryText.replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

      section.lists.forEach(list => {
        list.hide = true;
        this.filterList(list, queryWords, excludeLabels, segment);
        // list.sessions.forEach(session => {
        //   // check if this session should show or not
        //   this.filterSession(session, queryWords, excludeLabels, segment);
        //
        //   if (!session.hide) {
        //     // if this session is not hidden then this group should show
        //     list.hide = false;
        //     section.shownLists++;
        //   }
        // });
        if (!list.hide) {
          list.hide = false;
          section.shownLists++;
        }


      });

      return section;
    });
  }

  filterList(list, queryWords, excludeLabels, segment) {
    //查询过滤
    let matchesQueryText = false;
    if (queryWords.length) {
      queryWords.forEach(queryWord => {
        if (list.title.indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      matchesQueryText = true;
    }

    //标签过滤
    let matchesLabels = false;
    list.labels.forEach(label => {
      if (excludeLabels.indexOf(label) === -1) {
        matchesLabels = true;
      }
    });

    //收藏过滤
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(list.title)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // 隐藏false过滤项
    list.hide = !(matchesQueryText && matchesLabels && matchesSegment);
  }

  getSpeakers() {
    return this.load().map(data => {
      return data.speakers.sort((a, b) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  getLabels() {
    return this.load().map(data => {
      return data.labels.sort();
    });
  }

  getMap() {
    return this.load().map(data => {
      return data.map;
    });
  }



}
