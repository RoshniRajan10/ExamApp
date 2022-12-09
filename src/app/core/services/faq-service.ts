import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { FaqModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class FaqService extends DataAccessService {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }
  // function to get all faq details
  getfaq() {
    return this.getDataList(COLLECTION_KEYS.FAQ)
  }
  // function to manage faq like save
  manageFaq(objTopic: FaqModel): any {
    const { categorykey, subCategoryKey } = objTopic
    const Collectioney = `${COLLECTION_KEYS.FAQ}/${subCategoryKey}`
    const result = this.saveOrUpdateData(Collectioney, objTopic)
    return Collectioney
  }
  // function to delete faq
  deleteFaq(subcatKey, faqKey): any {
    const result = this.deleteFaqData(subcatKey, faqKey).then(
      () => {
        return { subcatKey, faqKey }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
  // function to get faq details by key
  getFaqDetails(subCatKey, faqKey) {
    const details = `${COLLECTION_KEYS.FAQ}/${subCatKey}/${faqKey}`
    return firebase
        .database()
        .ref(details)
        .once('value')
    // return this.getDataDetails(`${COLLECTION_KEYS.FAQ}/${subCatKey}`, faqKey)
  }
  // function to get category details by key
  getCategoryDetails(categoryKey) {
    const details = `${COLLECTION_KEYS.MAIN_TOPIC}/${categoryKey}`
    return this.getDataDetails(`${COLLECTION_KEYS.MAIN_TOPIC}`, categoryKey)
  }
  // function to get subcategory detailsby key
  getSubCategoryDetails(categoryKey, subCatKey) {
    const details = `${COLLECTION_KEYS.MAIN_TOPIC}/${categoryKey}/${COLLECTION_KEYS.SUB_TOPIC}`
    return this.getDataDetails(
      `${COLLECTION_KEYS.MAIN_TOPIC}/${categoryKey}/${COLLECTION_KEYS.SUB_TOPIC}`,
      subCatKey
    )
  }
  // function to update faq
  updateFaq(subCatKey, faqKey, fQuestions, fAnswers, isPublish, createdDate) {
    const res = firebase
      .database()
      .ref('faqInSubCategory' + '/' + subCatKey + '/' + faqKey)
      .update({
        subCategoryKey: subCatKey,
        fQuestion: fQuestions,
        fAnswer: fAnswers,
        isPublished: isPublish,
        createdAt: createdDate,
      })
    if (res) {
      return res
    }
  }

  // function to publish faq
  publishFaq(subCatKey, faqKey) {
    const res = firebase
      .database()
      .ref('faqInSubCategory' + '/' + subCatKey + '/' + faqKey)
      .update({
        isPublished: true,
      })
    if (res) {
      return res
    }
  }
  // function to unpublish faq
  unPublishFaq(subCatKey, faqKey) {
    const res = firebase
      .database()
      .ref('faqInSubCategory' + '/' + subCatKey + '/' + faqKey)
      .update({
        isPublished: false,
      })
    if (res) {
      return res
    }
  }
}
