import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { UserTipsModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class UploadExcelService extends DataAccessService {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }

  getDataFromQuestionBank(catKey) {
    return firebase
      .database()
      .ref('questionbank')
      .orderByChild('categoryKey')
      .equalTo(catKey)
  }
  addExcelFile(params) {
    console.log("params", params)
    const ExcelRes = firebase
      .database()
      .ref('questionbank/')
      .push({
        QID: params.QID,
        Question: params.Question,
        Quest_Hint: params.QuestHint,
        Options: {
          Option1: params.Option1,
          Option2: params.Option2,
          Option3: params.Option3,
          Option4: params.Option4,
          Option5: params.Option5,
        },
        Right_Answer: params.RightAnswer,
        Solutions: {
          Solution1: params.Solution1,
          Solution2: params.Solution2,
          Solution3: params.Solution3,
          Solution4: params.Solution4,
          Solution5: params.Solution5,
        },
        Best_Solutions: {
          Best_Solution1: params.BestSolution1,
          Best_Solution2: params.BestSolution2,
          Best_Solution3: params.BestSolution3,
        },
        Category: {
          categoryKey: params.categorykey,
          categoryName: params.categoryName,
        },
        categoryKey: params.categorykey,
        qstnTags: params.qstnTagsArray,
        subqstnTags: params.subqstnTagsArray,
        marks: params.marks,
        negativeMarks: params.negativeMarks,
        difficulty: params.difficulty
      })

    if (ExcelRes) {
      return true
    } else {
      return false
    }
  }
}
