import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxPaginationModule } from 'ngx-pagination'
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SharedModule, ExamAppLayoutComponent } from '@app/shared'
import { CoreModule } from '@app/core';
import { 
AngularFireAnalyticsModule, 
ScreenTrackingService, 
UserTrackingService
}from '@angular/fire/analytics';
import { AngularFireModule } from '@angular/fire'
import { environment } from 'src/environments/environment';
@NgModule({
  declarations: [AppComponent, ExamAppLayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule
  ],
  providers: [
    ScreenTrackingService, 
    UserTrackingService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
