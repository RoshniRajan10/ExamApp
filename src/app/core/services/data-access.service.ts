import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class DataAccessService {
  constructor(private Firebase: AngularFireDatabase) {}

  protected getDataList(collectionName: string) {
    const dataList: AngularFireList<any> = this.Firebase.list(collectionName)
    return dataList.snapshotChanges()
  }
  protected getDataListById(collectionName: string, childName: string) {
    const dataList: AngularFireList<any> = this.Firebase
    .list(collectionName, ref=> ref.child(childName))
    return dataList.snapshotChanges()
  }
  protected getDataListLimited(collectionName: string, orderBy: any, limit: number) {
    const dataList: AngularFireList<any> = this.Firebase
    .list(collectionName, ref => ref.orderByChild(orderBy).limitToLast(limit))
    return dataList.snapshotChanges()
  }
  protected getDataDetails(collectionName: string, key: any) {
    let data
    firebase
      .database()
      .ref(collectionName)
      .child(key)
      .on('value', (snapshot) => {
        data = snapshot.val()
      })
    return data
  }

  protected saveOrUpdateData(collectionName: string, data): any {
    const { $key } = data
    if (!$key) {
      return this.saveData(collectionName, data)
    } else {
      return this.updateData(collectionName, data)
    }
  }

  protected deleteData(collectionName: string, $key: any): any {
    return firebase.database().ref(collectionName).child($key).remove()
  }
  protected deleteMainTopicData(collectionName: string, $key: any): any {
    return firebase.database().ref('categories').child($key).remove()
  }
  protected deleteLevelData(collectionName: string, $key: any): any {
    return firebase.database().ref('levels').child($key).remove()
  }
  protected deleteDatas(collectionName: string, $key: any): any {
    return firebase.database().ref(collectionName).child($key).remove()
  }
  protected deleteCurrentAffairs(collectionName: string, $key: any): any {
    return firebase.database().ref(collectionName).child($key).remove()
  }
  protected deleteUsers(collectionName: string, $key: any): any {
    return firebase.database().ref(collectionName).child($key).update({userState:0})
  }
  protected restoreUsers(collectionName: string, $key: any): any {
    return firebase.database().ref(collectionName).child($key).update({userState:1})
  }
  protected deleteUserTipData(
    collectionName: string,
    categoryKey,
    userTipKey
  ): any {
    return firebase
      .database()
      .ref('examTipsInCategory')
      .child(categoryKey)
      .child(userTipKey)
      .remove()
  }
  protected deleteFaqData(subcatKey, faqKey): any {
    return firebase
      .database()
      .ref('faqInSubCategory')
      .child(subcatKey)
      .child(faqKey)
      .remove()
  }
  protected deleteExamData(examsInCategoryKey, categorykey): any {
    return firebase
      .database()
      .ref('categories')
      .child(categorykey)
      .child('examsInCategory')
      .child(examsInCategoryKey)
      .remove()
  }
  protected deletePracticeData(practicekey, qstnkey): any {
    return firebase
      .database()
      .ref('practicesInSubCategories')
      .child(qstnkey)
      .child(practicekey)
      .remove()
  }
  protected deleteStudyMaterialData(
    chapterKeys,
    studyMaterialsInChapterKeys
  ): any {
    return firebase
      .database()
      .ref('studyMaterialsInSubCategories')
      .child(chapterKeys)
      .child(studyMaterialsInChapterKeys)
      .remove()
  }
  protected deleteVideoData(videokey): any {
    return firebase.database().ref('youtubeData').child(videokey).remove()
  }
  protected deleteVideoDatas(chapterKeys): any {
    return firebase
      .database()
      .ref('youtubeVideoInChapter')
      .child(chapterKeys)
      .remove()
  }

  protected deleteVideoDatas_v2(chapterKeys,videokey): any {
    return firebase
      .database()
      .ref('youtubeVideoInChapter')
      .child(chapterKeys)
      .child(videokey)
      .remove()
  }

  protected deleteAllStudyMaterialData(studyMaterialID, studyMatkey): any {
    return firebase
      .database()
      .ref('studyMaterials')
      .child(studyMaterialID)
      .child('data')
      .child(studyMatkey)
      .remove()
  }
  protected deleteQuestionData(practiceKeys, qstnkey): any {
    return firebase
      .database()
      .ref('practices')
      .child(practiceKeys)
      .child('data')
      .child('questions')
      .child(qstnkey)
      .remove()
  }
  protected deleteExamQuestionData(examkeys, qstnkey): any {
    return firebase
      .database()
      .ref('exams')
      .child(examkeys)
      .child('data')
      .child('questions')
      .child(qstnkey)
      .remove()
  }

  protected deleteNewsData(categoryKey, newsKey): any {
    return firebase
      .database()
      .ref('newsInCategory')
      .child(categoryKey)
      .child(newsKey)
      .remove()
  }

  private saveData(collectionName: string, data): any {
    const { $key, ...formatData } = data
    const result = firebase.database().ref(collectionName).push(formatData)
    return result
  }

  private updateData(collectionName: string, data): any {
    const { $key, ...formatData } = data
    return firebase
      .database()
      .ref(collectionName)
      .child($key)
      .update(formatData)
  }
}
