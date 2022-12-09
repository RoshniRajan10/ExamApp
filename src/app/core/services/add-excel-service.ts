import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { ExamLevelModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class AddExcelService extends DataAccessService {
  constructor(firebases: AngularFireDatabase) {
    super(firebases)
  }

  getDataFromQuestionBank(catKey) {
    let data
    firebase
      .database()
      .ref('questionbank')
      .orderByChild('categoryKey')
      .equalTo(catKey)

      .on('value', (snapshot) => {
        data = snapshot.val()
      })
    return data
  }
}
