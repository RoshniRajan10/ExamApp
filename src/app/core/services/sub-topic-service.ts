import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { SubTopicModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'
import { async } from '@angular/core/testing'

@Injectable({
  providedIn: 'root',
})
export class SubTopicService extends DataAccessService {
  constructor(firebase1: AngularFireDatabase) {
    super(firebase1)
  }
  // function to get all sub topics
  getSubTopics() {
    return this.getDataList(COLLECTION_KEYS.MAIN_TOPIC)
  }
  // function to get sub topics by categorykey
  getSubTopicDetails(subcatKey, categorykey) {
    return this.getDataDetails(COLLECTION_KEYS.MAIN_TOPIC, categorykey)
  }
  // function to update sub topics
  updateSubTopic(
    subcatKey,
    categorykey,
    subCategoryNames,
    categoryNames,
    subCategoryThumbs,
    subCategoryThumbNames,
    isPremium
  ) {
    const res = firebase
      .database()
      .ref(
        'categories' +
          '/' +
          categorykey +
          '/' +
          'subCategories' +
          '/' +
          subcatKey
      )
      .update({
        subCategoryName: subCategoryNames,
        categoryName: categoryNames,
        subCategoryThumb: subCategoryThumbs,
        subCategoryThumbName: subCategoryThumbNames,
        isPublished: false,
        isPremium: isPremium,
      })
    if (res) {
      return res
    }
  }
  // function to add sub topics
  manageSubTopic(objTopic: SubTopicModel, isSubTopic: boolean = true): any {
    const { categoryName, ...objsubTopic } = objTopic
    const Collectioney = isSubTopic
      ? `${COLLECTION_KEYS.MAIN_TOPIC}/${categoryName}/${COLLECTION_KEYS.SUB_TOPIC}`
      : `${COLLECTION_KEYS.MAIN_TOPIC}`
    const result = this.saveOrUpdateData(
      Collectioney,
      isSubTopic ? objsubTopic : objTopic
    )
    return Collectioney
  }
  // function to delete sub topics
  deleteSubTopic(subcatKey, categorykey) {
    const subcategory = firebase
      .database()
      .ref(
        'categories' +
          '/' +
          categorykey +
          '/' +
          'subCategories' +
          '/' +
          subcatKey
      )
    const res = subcategory.remove()
    if (res) {
      return true
    }
  }
  // function to unpublish sub topics
  updateUnPublishbyKey(subcatKey, categorykey) {
    const subcategory = firebase
      .database()
      .ref(
        'categories' +
          '/' +
          categorykey +
          '/' +
          'subCategories' +
          '/' +
          subcatKey
      )
      .update({
        isPublished: false,
      })
    if (subcategory) {
      return subcategory
    }
  }
  // function to publish sub topics
  updatePublishbyKey(subcatKey, categorykey) {
    const subcategory = firebase
      .database()
      .ref(
        'categories' +
          '/' +
          categorykey +
          '/' +
          'subCategories' +
          '/' +
          subcatKey
      )
      .update({
        isPublished: true,
      })
    if (subcategory) {
      return subcategory
    }
  }
  // function to get subtopic details by a particular subcategory key
  getSubTopicByKey(subcatKey, categorykey) {
    let data
    firebase
      .database()
      .ref('categories')
      .child(categorykey)
      .child('subCategories')
      .child(subcatKey)
      .on('value', (snapshot) => {
        data = snapshot.val()
      })
    return data
  }
  // function to get main topic details by a particular category key
  getMainTopicByKey(categorykey) {
    let data
    firebase
      .database()
      .ref('categories')
      .child(categorykey)
      .on('value', (snapshot) => {
        data = snapshot.val()
      })
    return data
  }
  //To update sub topic in chapters
  getChapters(categorykey, subcatKey, subCategoryName) {
    const res = firebase
      .database()
      .ref(COLLECTION_KEYS.CHAPTER)
      .orderByChild('categorykey')
      .equalTo(categorykey)
      .once('value')
      .then((snapshot) => {
        const data = snapshot.val()
        const filteredArray = []
        const chaparray = Object.entries(data)
        chaparray.forEach((chapters) => {
          let chapterKey = chapters[0]
          if (
            chapters[1]['categorykey'] == categorykey &&
            chapters[1]['subCategorykey'] == subcatKey
          ) {
            this.updateChapter(chapterKey, subCategoryName)
          }
        })
      })
  }
  updateChapter(subCategorykey, subCategoryName) {
    const res = firebase
      .database()
      .ref(COLLECTION_KEYS.CHAPTER)
      .child(subCategorykey)
      .update({
        subCategoryName: subCategoryName,
      })
    if (res) {
      return res
    }
  }
  // To update sub topic in study materials
  getStudyMaterials(categorykey, subcatKey, subCategoryName, studymaterials) {
    studymaterials.forEach((materials) => {
      if (
        materials.categorykey == categorykey &&
        materials.subCategoryKey == subcatKey
      ) {
        this.updateStudyMaterial(
          materials.chapterKey,
          materials.studyMaterialsInChapterKey,
          subcatKey,
          subCategoryName
        )
      }
    })
  }
  updateStudyMaterial(chapterkey, sMCKkey, subCategorykey, subCategoryName) {
    const res = firebase
      .database()
      .ref(COLLECTION_KEYS.STUDY_MATERIAL_SUBCAT)
      .child(chapterkey)
      .child(sMCKkey)
      .child('metaData')
      .child('subCategoryKey')
      .once('value')
      .then((snapShot) => {
        let data = snapShot.val()
        if (data == subCategorykey) {
          firebase
            .database()
            .ref(COLLECTION_KEYS.STUDY_MATERIAL_SUBCAT)
            .child(chapterkey)
            .child(sMCKkey)
            .child('metaData')
            .update({
              subCategoryName: subCategoryName,
            })
        }
      })
    if (res) {
      return res
    }
  }
  // To update sub topic in Practices
  getPractices(categorykey, subcatKey, subCategoryName, PracticeItems) {
    PracticeItems.forEach((practices) => {
      if (
        practices.categoryKeys == categorykey &&
        practices.subCategoryKeys == subcatKey
      ) {
        this.updatePractices(
          practices.chapterkey,
          practices.practicesInChapterKeys,
          subcatKey,
          subCategoryName
        )
      }
    })
  }
  updatePractices(mainKey, pCTKkey, subCategorykey, subCategoryName) {
    const res = firebase
      .database()
      .ref(COLLECTION_KEYS.PRACTICE_SUBCATEGORIES)
      .child(mainKey)
      .child(pCTKkey)
      .child('metaData')
      .child('subCategoryKey')
      .once('value')
      .then((snapShot) => {
        let data = snapShot.val()
        if (data == subCategorykey) {
          firebase
            .database()
            .ref(COLLECTION_KEYS.PRACTICE_SUBCATEGORIES)
            .child(mainKey)
            .child(pCTKkey)
            .child('metaData')
            .update({
              subCategoryName: subCategoryName,
            })
        }
      })
    if (res) {
      return res
    }
  }
}
