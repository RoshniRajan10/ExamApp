import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'

import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFireModule } from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { ToastrModule } from 'ngx-toastr'

import { ErrorInterceptor } from './interceptors'
import { ToastConfig } from './config'
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    ToastrModule.forRoot(ToastConfig),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
