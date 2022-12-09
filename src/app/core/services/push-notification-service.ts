import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { element } from 'protractor'
import * as firebase from 'firebase'
import { environment } from '../../../environments/environment'
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
}
@Injectable({
  providedIn: 'root',
})
export class PushNotificationService extends DataAccessService {
  postId: any
  constructor(firebases: AngularFireDatabase, private http: HttpClient) {
    super(firebases)
  }

  sendNotification(title, message, datas: any, imageUr: string) 
  {
    const contentMessage = { en: message }
    const contentTitle = { en: title }
    const obj = { en: 'You have $[notif_count] new messages' }
    const {
      push_notify: {
        app_id,
        included_segments,
        android_group,
        android_accent_color,
        authorize_key,
        api,
      },
    } = environment

    const parameter = JSON.stringify({
      app_id,
      contents: contentMessage,
      headings: contentTitle,
      data: datas,
      included_segments: 'test user segment',
      android_group,
      android_group_message: obj,
      android_accent_color,
    })

    const headers = {
      Authorization: authorize_key,
      'Content-Type': 'application/json; charset=utf-8',
    }
    return this.http
      .post<any>(api, parameter, {
        headers,
      })
      .subscribe(
        (data) => {
          this.postId = data.id
        },
        (error) => {
          console.log(error)
        }
      )
  }
}
