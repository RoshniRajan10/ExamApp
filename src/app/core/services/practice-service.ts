import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { PracticeModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class PracticeService extends DataAccessService {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }

  getAllPublishedCategories() {
    return this.getDataList(COLLECTION_KEYS.MAIN_TOPIC)
  }
  //  getAllPublishedCategories() {
  // 	return firebase
  // 		.database()
  // 		.ref(COLLECTION_KEYS.MAIN_TOPIC)
  // 		.orderByChild('isPublished')
  // 		.equalTo(true);

  // }

  async getQuestionsByPractice(id) {
    // return this.getDataDetails(COLLECTION_KEYS.PRACTICE, id);
    return firebase.database().ref(COLLECTION_KEYS.PRACTICE).child(id)
  }

  getAllExamLevel() {
    return this.getDataList(COLLECTION_KEYS.EXAM_LEVEL)
  }
  getAllQuestionList() {
    return this.getDataList(COLLECTION_KEYS.QUESTION_BANK)
  }

  getQuestionsByPracticeId(id) {
    return this.getDataDetails(COLLECTION_KEYS.PRACTICE, id)
  }

  managePractice(objTopic: PracticeModel): any {
    const result = this.saveOrUpdateData(COLLECTION_KEYS.PRACTICE, objTopic)
    return result
  }
  getExamList() {
    return this.getDataList(COLLECTION_KEYS.PRACTICE_SUBCATEGORIES)
  }
  getAllPractices(){
    // return this.getDataList(COLLECTION_KEYS.PRACTICE_SUBCATEGORIES)
    return firebase.database().ref(COLLECTION_KEYS.PRACTICE_SUBCATEGORIES)
    .once('value')
  }
  addPracticeInSubCategory(subCategoryKey, chapterkey, metaData) {
    const practiceInSubCategories = firebase
      .database()
      .ref('practicesInSubCategories')
    const objPractice = practiceInSubCategories.child(chapterkey)
    const objPracticeResult = objPractice.push(metaData)
    if(objPracticeResult) {
      objPractice.child(objPracticeResult.key).update({
        practicesInChapterKey: objPracticeResult.key,
      })
      return objPracticeResult.key
    }
  }

  getDataFromQuestionBank(qstnId) {
    let data
    firebase
      .database()
      .ref('questionbank')
      .orderByChild('QID')
      .equalTo(qstnId)

      .on('value', (snapshot) => {
        data = snapshot.val()
      })
    return data
  }

  getPracticeDetail(chapterkeys, practiceKey, practiceInChapterKey) {
    return firebase
      .database()
      .ref('practicesInSubCategories')
      .child(chapterkeys)
      .child(practiceInChapterKey)
      .child('metaData')
  }
  getAllQuestions(examkey) {
    let data
    firebase
      .database()
      .ref('exams')
      .child(examkey)
      .on('value', (snapshot) => {
        data = snapshot.val()
      })
    return data
  }
  getQuestionDetails(practicekey, qstnkey) {
    return firebase
      .database()
      .ref('practices')
      .child(practicekey)
      .child('data')
      .child('questions')
      .child(qstnkey)
  }
  addQuestions(questions, practiceKey) {
    const exams = firebase.database().ref('practices')
    const exam = exams.child(practiceKey)
    const push = exam.child('data').child('questions').push(questions)
    if (push) {
      return true
    } else {
      return false
    }
  }
  getAllQuestionsBykey(practiceKey) {
    return firebase
      .database()
      .ref('practices')
      .child(practiceKey)
      .once('value')
  }
  getallExams(chapterkeys, practicesInChapterKey) {
    let data
    firebase
      .database()
      .ref('practicesInSubCategories')
      .child(chapterkeys)
      .child(practicesInChapterKey)
      .child('metaData')
      .on('value', (snapshot) => {
        data = snapshot.val()
      })
    return data
  }
  updatePractices(chapterkey, value) {
    const practiceInSubCategories = firebase
      .database()
      .ref('practicesInSubCategories')
    const objPractice = practiceInSubCategories.child(chapterkey);
    const objPracticeResult = objPractice.push(value)
    if (objPracticeResult) {
      objPractice.child(objPracticeResult.key).update({
        practicesInChapterKey: objPracticeResult.key,
      })
      return objPracticeResult.key
    }
  }
  removePractice(practicesInChapterkey, chapterkeys) {
    const practiceInChapter = firebase
      .database()
      .ref('practicesInSubCategories')
      .child(chapterkeys)
      .child(practicesInChapterkey)

      .remove()
    //  var deleteFromCategories = examsInCategory.remove();

    if (practiceInChapter) {
      return 'deleted'
    } else {
      return 'not deleted'
    }
  }

  updateQuestion(
    practiceKey,
    qstnkey,
    question,
    hint,
    difficulty,
    marks,
    negativeMarks,
    options,
    noOfOptions,
    noOfsolutions,
    noOfbestSolutions,
    solutions,
    bestSolutions,
    qstnTags,
    subqstnTags
  ) {
    const res = firebase
      .database()
      .ref(
        'practices' +
          '/' +
          practiceKey +
          '/' +
          'data' +
          '/' +
          'questions' +
          '/' +
          qstnkey
      )
      .update({
        question,
        hint,
        difficulty,
        marks,
        negativeMarks,
        options,
        noOfOptions,
        noOfsolutions,
        noOfbestSolutions,
        solutions,
        bestSolutions,
        qstnTags,
        subqstnTags
      })
    if (res) {
      return res
    }
  }

  deletePractice(practicekey, qstnkey): any {
    const result = this.deletePracticeData(practicekey, qstnkey).then(
      () => {
        return { practicekey, qstnkey }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }

  updatePublishbyKey(practicekey, chapterkey) {
    const exam = firebase
      .database()
      .ref(
        'practicesInSubCategories' +
          '/' +
          chapterkey +
          '/' +
          practicekey +
          '/' +
          'metaData'
      )

      .update({
        isPublished: true,
      })
    if (exam) {
      return exam
    }
  }
  updateUnPublishbyKey(practicekey, chapterkey) {
    const exam = firebase
      .database()
      .ref(
        'practicesInSubCategories' +
          '/' +
          chapterkey +
          '/' +
          practicekey +
          '/' +
          'metaData'
      )
      .update({ isPublished: false })
    if (exam) {
      return exam
    }
  }

  deleteQuestion(practiceKeys, qstnkey): any {
    const result = this.deleteQuestionData(practiceKeys, qstnkey).then(
      () => {
        return { practiceKeys, qstnkey }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
  // update marks in questions
  updateMarksInExamQuestions(practiceKey,marks,negativeMarks){
    let practiceNode;
    firebase.database()
    .ref('practices')
    .child(practiceKey)
    .once('value').then((snapshot) => {
      practiceNode = snapshot.val();
      Object.values(practiceNode.data).forEach((questionNode)=>{
        Object.entries(questionNode).forEach(([qstnkey,question])=>{
          firebase.database().ref('practices')
          .child(practiceKey)
          .child('data')
          .child('questions')
          .child(qstnkey)
          .update({
            marks: marks,
            negativeMarks: negativeMarks,
          })
        })
      })
    })
  }
  // function to get question tags
  getAllQstnTags(){
    return firebase.database().ref(COLLECTION_KEYS.QUESTION_TAGS)
    .child('tags')
    .once("value")
  }
  // function to get sub question tags
  getAllSubQstnTags(){
    return firebase.database().ref(COLLECTION_KEYS.QUESTION_TAGS)
    .child('subtags')
    .once("value")
  }
  // add question tags
  saveQuestionTags(filteredTags){
    const filteredTagsString =  filteredTags.join();
    const data = firebase.database().ref(COLLECTION_KEYS.QUESTION_TAGS)
    .update({tags:filteredTagsString})
  }
  // add question sub tags
  saveSubQuestionTags(filteredTags){
    const filteredTagsString =  filteredTags.join();
    const data = firebase.database().ref(COLLECTION_KEYS.QUESTION_TAGS)
    .update({subtags:filteredTagsString})
  }
}
