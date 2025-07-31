import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { SharedModule } from './Module/shared/shared.module';
import { FetureModule } from './Module/feture/feture.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AuthModule } from './Module/auth/auth.module';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoaderComponent } from './Module/shared/components/loader/loader.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    CommonModule,
    FetureModule,
    SharedModule,
    AuthModule,
    HttpClientModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
  ],
  exports: [RouterModule],
  bootstrap: [AppComponent],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    provideAnimationsAsync(),
    provideHttpClient()
  ]
})
export class AppModule { }
