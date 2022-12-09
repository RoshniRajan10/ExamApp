import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { ExamLevelModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'

@Injectable({
  providedIn: 'root',
})
export class ExamLevelService extends DataAccessService {
  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }
  // function to get all exam levels
  getAllExamLevels() {
    return this.getDataList(COLLECTION_KEYS.EXAM_LEVEL)
  }
  // function to get all exam levels by id
  getexamLevelDetails(id: any) {
    return this.getDataDetails(COLLECTION_KEYS.EXAM_LEVEL, id)
  }
  // function to manage exam level like save and update
  manageExamLevel(objTopic: ExamLevelModel): any {
    const result = this.saveOrUpdateData(COLLECTION_KEYS.EXAM_LEVEL, objTopic)
    return result
  }
  // function to delete exam level
  deleteExamLevel(id: any): any {
    const result = this.deleteLevelData(COLLECTION_KEYS.EXAM_LEVEL, id).then(
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
