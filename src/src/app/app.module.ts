import { NgModule} from '@angular/core';
import { IonicApp, IonicModule} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { WelcomePage } from '../pages/welcome/welcome';
import { SignupPage } from '../pages/signup/signup';
import { AccountPage } from '../pages/account/account';
import { SupportPage } from '../pages/support/support';

import { NewsPage } from '../pages/news/news';
import { NewsFilterPage } from '../pages/news-filter/news-filter';
import { NewsListDetailPage } from '../pages/news-list-detail/news-list-detail';

import { CirclesPage } from '../pages/circles/circles';
import { CirclesDetailPage } from '../pages/circles-detail/circles-detail';

import { NewsData } from '../providers/news-data';
import { UserData } from '../providers/user-data';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    WelcomePage,
    LoginPage,
    SignupPage,
    AccountPage,
    SupportPage,
    NewsPage,
    NewsFilterPage,
    NewsListDetailPage,
    CirclesPage,
    CirclesDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    WelcomePage,
    LoginPage,
    SignupPage,
    AccountPage,
    SupportPage,
    NewsPage,
    NewsFilterPage,
    NewsListDetailPage,
    CirclesPage,
    CirclesDetailPage
  ],
  providers: [NewsData, UserData, Storage]
})
export class AppModule {}
