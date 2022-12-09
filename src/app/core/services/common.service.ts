import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import * as firebase from 'firebase'
import { firestore } from 'firebase'
const keys = {
  parent: 'parentsRoot',
}
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  ParentList: AngularFireList<any>
  constructor(private Firebase: AngularFireDatabase) {}

  getParentTopic() {
    this.ParentList = this.Firebase.list('parentsRoot')
    return this.ParentList.snapshotChanges()
  }
  getAllMainTopics() {
    this.ParentList = this.Firebase.list('categories')
    return this.ParentList.snapshotChanges()
  }
}
