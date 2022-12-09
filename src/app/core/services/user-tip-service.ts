import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { UserTipsModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class UserTipService extends DataAccessService {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }
  // function to get all userTips
  getUserTips() {
    return this.getDataList(COLLECTION_KEYS.USER_TIPS)
  }
  // function to get userTip details by key
  getUserTipsDetails(categoryKey, usertipKey) {
    const collectionName = `${COLLECTION_KEYS.USER_TIPS}/${categoryKey}`
    return firebase
      .database()
      .ref(collectionName)
      .child(usertipKey);
  }
  // function to get category details by id
  getcategoryDetails(id: any) {
    return this.getDataDetails(COLLECTION_KEYS.MAIN_TOPIC, id)
  }
  // function to manage examTips like save and update
  manageUserTips(objTopic: UserTipsModel): any {
    const { categoryKey, ...objExamTip } = objTopic
    const Collectioney = `${COLLECTION_KEYS.USER_TIPS}/${categoryKey}`
    const result = this.saveOrUpdateData(Collectioney, objTopic)
    return Collectioney
  }

  // function to delete user tips
  deleteUserTips(categoryKey, userTipKey): any {
    const result = this.deleteUserTipData(
      COLLECTION_KEYS.USER_TIPS,
      categoryKey,
      userTipKey
    ).then(
      () => {
        return { categoryKey, userTipKey }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
}
