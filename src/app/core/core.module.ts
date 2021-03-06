import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FlexLayoutModule } from '@angular/flex-layout';

// The Angular Material module must be imported after Angular's BrowserModule, as the import order matters for NgModules.
import { MAT_DATE_LOCALE } from '@angular/material';
import { AngularMaterialModule } from '@app/shared/angular-material.module';

import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';

import { environment } from '@env/environment';

import { throwIfAlreadyLoaded } from './module-import-guard';

//
// Firebase Hosting
//

// https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md

import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireStorageModule } from '@angular/fire/storage';
// import { AngularFireAuthModule } from '@angular/fire/auth';

//
// Utils lib
//

import { UtilsModule } from 'utils';
import { LoggerService } from 'utils';
import { ConsoleLoggerService } from 'utils';

//
// Auth lib
//

import { AuthModule } from 'auth';

//
// Dynamic Forms lib
//

import { DynamicFormsModule } from 'dynamic-forms';

//
// Sales lib
//

import { SalesModule } from 'sales';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularMaterialModule,
    AuthModule,
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [ HttpClient ]
      }
    }),

    UtilsModule.forRoot(environment),
    DynamicFormsModule.forRoot(environment),
    SalesModule,

    RouterModule  // There is no directive with "exportAs" set to "routerLinkActive ...
  ],
  declarations: [ PlaceholderComponent, NavigationBarComponent, NavComponent, LoginComponent ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: environment.defaultLanguage },
    { provide: LoggerService, useClass: ConsoleLoggerService }
  ],
  exports: [ PlaceholderComponent, NavigationBarComponent, NavComponent ] // TranslateModule
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule,
               private translate: TranslateService,
               private logger: LoggerService) {

    this.logger.info('Core Module initialised');

    // 'en-GB' -> 'en'
    const defaultLanguage = environment.defaultLanguage.split('-')[0];

    this.logger.info('Default Language: ' + defaultLanguage);
    this.logger.info('Local: ' + environment.defaultLanguage.split('-')[1]);

    translate.setDefaultLang(defaultLanguage);
    translate.use(defaultLanguage);

    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// https://stackoverflow.com/questions/50860898/angular-6-services-providedin-root-vs-coremodule

// this.logger.info('CoreModule: constructor()');
