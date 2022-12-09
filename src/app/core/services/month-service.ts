import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { MonthModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'

@Injectable({
  providedIn: 'root',
})
export class MonthService extends DataAccessService {
  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }
  // function to get all months
  getMonths() {
    return this.getDataList(COLLECTION_KEYS.MONTHS)
  }
  // function to get month details by id
  getMonthDetails(id: any) {
    return this.getDataDetails(COLLECTION_KEYS.MONTHS, id)
  }
  // function to mange month like save and update
  manageMonth(objTopic: MonthModel): any {
    const result = this.saveOrUpdateData(COLLECTION_KEYS.MONTHS, objTopic)
    return result
  }
  // function to delete month
  deleteMonth(id: any): any {
    const result = this.deleteDatas(COLLECTION_KEYS.MONTHS, id).then(
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
