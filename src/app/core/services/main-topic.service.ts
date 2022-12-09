import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { MainTopicModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class MainTopicService extends DataAccessService {
  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }
  // function to get all main topics
  getMainTopics() {
    return this.getDataList(COLLECTION_KEYS.MAIN_TOPIC)
  }
  // function to get main topics by id
  getMainTopicDetails(id: any) {
    return this.getDataDetails(COLLECTION_KEYS.MAIN_TOPIC, id)
  }
  // function to manage main topics like update and add
  manageMainTopic(objTopic: MainTopicModel): any {
    const result = this.saveOrUpdateData(COLLECTION_KEYS.MAIN_TOPIC, objTopic)
    return result
  }
  // function to delete main topics
  deleteMainTopic(id: any): any {
    const result = this.deleteMainTopicData(
      COLLECTION_KEYS.MAIN_TOPIC,
      id
    ).then(
      () => {
        return { id }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
  async getAllPublishedCategories() {
    return firebase
      .database()
      .ref(COLLECTION_KEYS.MAIN_TOPIC)
      .orderByChild('isPublished')
      .equalTo(true)
  }
  // To update Exams in Categories
  getExams(categorykey,categoryName,exams){
    exams.forEach((exam) => {
      this.updateExam(categorykey,exam.examsInCategoryKey,categoryName);
    });
  }
  updateExam(mainKey,examsInCategoryKey,categoryName){
    const res = firebase.database()
    .ref(COLLECTION_KEYS.MAIN_TOPIC)
    .child(mainKey)
    .child('examsInCategory')
    .child(examsInCategoryKey)
    .child('metaData')
    .child('categoryKey')
    .once("value").then((snapShot)=>{
      const data = snapShot.val();
      if(data === mainKey){
        firebase.database()
        .ref(COLLECTION_KEYS.MAIN_TOPIC)
        .child(mainKey)
        .child('examsInCategory')
        .child(examsInCategoryKey)
        .child('metaData')
        .update({
          categoryName:categoryName,
        });
      }
    })
    if(res){
      return res;
    }
  }
  // To update Practices in Categories
  getPractices(categorykey,categoryName,practices){
    practices.forEach((practice) => {
      this.updatePractice(practice.chapterkey,practice.practicesInChapterKeys,categorykey,categoryName);
    });
  }
  updatePractice(mainKey,childKey,categorykey,categoryName){
    const res = firebase.database()
    .ref(COLLECTION_KEYS.PRACTICE_SUBCATEGORIES)
    .child(mainKey)
    .child(childKey)
    .child('metaData')
    .child("categorykey")
    .once("value").then((snapShot)=>{
      const data = snapShot.val();
      if(data === categorykey){
        firebase.database()
        .ref(COLLECTION_KEYS.PRACTICE_SUBCATEGORIES)
        .child(mainKey)
        .child(childKey)
        .child('metaData')
        .update({
          categoryName:categoryName,
        });
      }
    })
    if(res){
      return res;
    }
  }
  // update main topic name in study materials
  getStudyMaterials(categorykey,categoryName,studymaterials){
    studymaterials.forEach((materials) => {
      this.updateStudyMaterial(materials.chapterKey,materials.studyMaterialsInChapterKey,categorykey,categoryName);
    });
  }
  updateStudyMaterial(mainKey,childKey,categorykey,categoryName){
    const res = firebase.database()
    .ref(COLLECTION_KEYS.STUDY_MATERIAL_SUBCAT)
    .child(mainKey)
    .child(childKey)
    .child("metaData")
    .child("categorykey")
    .once("value").then((snapShot)=>{
      const data = snapShot.val();
      if(data === categorykey){
        firebase.database()
        .ref(COLLECTION_KEYS.STUDY_MATERIAL_SUBCAT)
        .child(mainKey)
        .child(childKey)
        .child('metaData')
        .update({
          categoryName:categoryName,
        });
      }
    })
    if(res){
      return res;
    }
  }
}
