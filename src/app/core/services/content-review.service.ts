import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import { CurrentAffairModel } from '../models'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class ContentReviewService extends DataAccessService {

  constructor(firebase1: AngularFireDatabase) {
    super(firebase1)
  }

  // function to get all Content reviews
  getContentReviews() {
    return this.getDataList(COLLECTION_KEYS.CONTENT_REVIEWS)
  }
  // Add comments
  addComments(commentObj){
  }
  // Add comments
  updateComment(selectedId,module,rev_type,comments){
    const replied_at = firebase.database.ServerValue.TIMESTAMP;
    const data = firebase.database()
    .ref(COLLECTION_KEYS.CONTENT_REVIEWS)
    .child(module)
    .child(rev_type)
    .child(selectedId)
    .update({
      comments : comments,
      status : true,
      replied_at : replied_at
    });
  }
}
