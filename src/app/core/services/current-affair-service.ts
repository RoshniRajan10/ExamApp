import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import { CurrentAffairModel } from '../models'
import * as firebase from 'firebase'
@Injectable({
  providedIn: 'root',
})
export class CurrentAffairService extends DataAccessService {
  constructor(firebase1: AngularFireDatabase) {
    super(firebase1)
  }
  // function to get all current affairs
  getCurrentAffairs() {
    return this.getDataList(COLLECTION_KEYS.CURRENT_AFFAIRS)
  }
  // function to get current affair details by id
  getCurrentAffairDetails(id: any) {
    return firebase
      .database()
      .ref(COLLECTION_KEYS.CURRENT_AFFAIRS)
      .child(id)
  }
  // function to get month details by id
  getMonthDetails(id: any) {
    return firebase
      .database()
      .ref(COLLECTION_KEYS.MONTHS)
      .child(id);      
  }
  // function to get all months
  getMonth() {
    return this.getDataList(COLLECTION_KEYS.MONTHS)
  }
  // function to manage current affair like save and update
  manageCurrentAffair(objTopic: CurrentAffairModel): any {
    const result = this.saveOrUpdateData(
      COLLECTION_KEYS.CURRENT_AFFAIRS,
      objTopic
    )
    return result
  }
  // function to delete current affair
  deleteCurrentAffair(id: any): any {
    const result = this.deleteCurrentAffairs(
      COLLECTION_KEYS.CURRENT_AFFAIRS,
      id
    ).then(
      () => {
        return { id }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
  // function to get limited current affairs
  getCurrentAffairsLimited(orderBy,limit) {
    return this.getDataListLimited(COLLECTION_KEYS.CURRENT_AFFAIRS,orderBy,limit)
  }
}
