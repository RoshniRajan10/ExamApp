import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { ParentTopicModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'

@Injectable({
  providedIn: 'root',
})
export class ParentTopicService extends DataAccessService {
  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }
  // function to get all parent topics
  getParentTopics() {
    return this.getDataList(COLLECTION_KEYS.PARENT_TOPIC)
  }
  // function to get parent topics by id
  getParentTopicDetails(id: any) {
    return this.getDataDetails(COLLECTION_KEYS.PARENT_TOPIC, id)
  }
  // function to manage parent topics like update and add
  manageParentTopic(objTopic: ParentTopicModel): any {
    const result = this.saveOrUpdateData(COLLECTION_KEYS.PARENT_TOPIC, objTopic)
    return result
  }
  // function to delete parent topics
  deleteTopic(id: any): any {
    const result = this.deleteData(COLLECTION_KEYS.PARENT_TOPIC, id).then(
      () => {
        return { id }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
}
