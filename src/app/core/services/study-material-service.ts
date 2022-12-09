import { Injectable } from '@angular/core'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { AddStudyMaterialModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class StudyMaterialService extends DataAccessService {
  constructor(firebase1: AngularFireDatabase,
    ) {
    super(firebase1)
  }

  getSubTopics() {
    return this.getDataList(COLLECTION_KEYS.MAIN_TOPIC)
  }
  getAllStudyMaterialList() {
    return this.getDataList(COLLECTION_KEYS.STUDY_MATERIAL_SUBCAT)
  }

  getStuMaterialDetails(chapterKeys, studyMaterialsInChapterKey) {
    return firebase
      .database()
      .ref('studyMaterialsInSubCategories')
      .child(chapterKeys)
      .child(studyMaterialsInChapterKey)
      .child('metaData')
  }
  getStudyMaterialDetailsById(studyMaterialID, studyMatDatakey) {
    return firebase
      .database()
      .ref('studyMaterials')
      .child(studyMaterialID)
      .child('data')
      .child(studyMatDatakey)
  }

  addStudyMaterials(studyMaterialNew, sudyMaterialKey) {
    const studyMaterials = firebase
      .database()
      .ref('studyMaterials')
      .child(sudyMaterialKey)
      .child('data')
    const push = studyMaterials.push(studyMaterialNew)
    if (push) {
      return true
    } else {
      return false
    }
  }

  getSubTopicDetails(subcatKey, categorykey) {
    return this.getDataDetails(COLLECTION_KEYS.MAIN_TOPIC, categorykey)
  }
  manageStudyMaterial(objTopic: AddStudyMaterialModel): any {
    const result = this.saveOrUpdateData('studyMaterials', objTopic)
    return result
  }

  updatePublishbyKey(chapterKeys, studyMaterialsInChapterKeys) {
    const studymatRes = firebase
      .database()
      .ref(
        'studyMaterialsInSubCategories' +
          '/' +
          chapterKeys +
          '/' +
          studyMaterialsInChapterKeys +
          '/' +
          'metaData'
      )

      .update({
        isPublished: true,
      })
    if (studymatRes) {
      return studymatRes
    }
  }
  updateUnPublishbyKey(chapterKeys, studyMaterialsInChapterKeys) {
    const studymatRes = firebase
      .database()
      .ref(
        'studyMaterialsInSubCategories' +
          '/' +
          chapterKeys +
          '/' +
          studyMaterialsInChapterKeys +
          '/' +
          'metaData'
      )

      .update({
        isPublished: false,
      })
    if (studymatRes) {
      return studymatRes
    }
  }
  deleteStudyMaterial(chapterKeys, studyMaterialsInChapterKeys): any {
    const result = this.deleteStudyMaterialData(
      chapterKeys,
      studyMaterialsInChapterKeys
    ).then(
      () => {
        return { chapterKeys, studyMaterialsInChapterKeys }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
  deleteAllStudyMaterial(studyMaterialID, studyMatkey) {
    const result = this.deleteAllStudyMaterialData(
      studyMaterialID,
      studyMatkey
    ).then(
      () => {
        return { studyMaterialID, studyMatkey }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
  getAllStudyMaterialBykey(studyMaterialID) {
    let data
    firebase
      .database()
      .ref('studyMaterials')
      .child(studyMaterialID)
      .on('value', (snapshot) => {
        data = snapshot.val()
      })
    return data
  }
  getallStudyMaterialDetails(chapterKeys, studyMaterialsInChapterKeys) {
    return firebase
      .database()
      .ref('studyMaterialsInSubCategories')
      .child(chapterKeys)
      .child(studyMaterialsInChapterKeys)
      .child('metaData')
  }

  removeStudyMaterial(studyMaterialsInChapterKeys, chapterkeys) {
    const studyMaterialInChapter = firebase
      .database()
      .ref('studyMaterialsInSubCategories')
      .child(chapterkeys)
      .child(studyMaterialsInChapterKeys)

      .remove()
    //  var deleteFromCategories = examsInCategory.remove();

    if (studyMaterialInChapter) {
      return 'deleted'
    } else {
      return 'not deleted'
    }
  }

  updateStudyMaterial(chapterKeys, value) {
    const studyMaterialsInSubCategories = firebase
      .database()
      .ref('studyMaterialsInSubCategories')
    const push = studyMaterialsInSubCategories.child(chapterKeys).push(value)
    if (push) {
      studyMaterialsInSubCategories.child(chapterKeys).child(push.key).update({
        studyMaterialsInChapterKey: push.key,
      })
      return push.key
    }
  }
  updateStudyMaterialById(
    studyMaterialID,
    studyMatDatakey,
    title,
    hasText,
    description,
    hasImage,
    imageLink,
    materialPdf,
    materialPdfName
  ) {
    const res = firebase
      .database()
      .ref(
        'studyMaterials' +
          '/' +
          studyMaterialID +
          '/' +
          'data' +
          '/' +
          studyMatDatakey
      )
      .update({
        title,
        hasText,
        description,
        hasImage,
        imageLink,
        materialPdf,
        materialPdfName,
      })
    if (res) {
      return res
    }
  }

  addStudyMaterialInSubCategory(categoryKey, subcatKey, chapterkey, metaData) {
    console.log(metaData)
    const studyMaterialsInSubCategories = firebase
      .database()
      .ref('studyMaterialsInSubCategories')
    const push = studyMaterialsInSubCategories.child(chapterkey).push(metaData)
    if (push) {
      studyMaterialsInSubCategories.child(chapterkey).child(push.key).update({
        studyMaterialsInChapterKey: push.key,
      })
      return push.key
    }
  }

  getAllStudyMaterialBykeyNew(studyMaterialID) {
    // return this.getDataListById('studyMaterials',studyMaterialID)


    return firebase
          .database()
          .ref('studyMaterials')
          .child(studyMaterialID)
    //   .on('value', (snapshot) => {
    //     this.data1 = snapshot.val()
    //   });
    // return this.data1
  }
}
