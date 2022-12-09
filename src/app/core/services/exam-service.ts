import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { ExamModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'
import { marks } from 'ngx-editor'

@Injectable({
  providedIn: 'root',
})
export class ExamService extends DataAccessService {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }

  // function to get all published categories
  async getAllPublishedCategories() {
    return firebase
      .database()
      .ref(COLLECTION_KEYS.MAIN_TOPIC)
      .orderByChild('isPublished')
      .equalTo(true)
  }

  getQuestionsByExam(examKey) {
    return this.getDataDetails(COLLECTION_KEYS.EXAM, examKey)
  }

  // function to get all exam level
  getAllExamLevel() {
    return this.getDataList(COLLECTION_KEYS.EXAM_LEVEL)
  }
  // function to get all questions from question bank
  getAllQuestionList() {
    return this.getDataList(COLLECTION_KEYS.QUESTION_BANK)
  }
  // function to manage exam like save
  manageExam(objTopic: ExamModel): any {
    const result = this.saveOrUpdateData(COLLECTION_KEYS.EXAM, objTopic)
    return result
  }
  getExamList() {
    return this.getDataList(COLLECTION_KEYS.MAIN_TOPIC)
  }

  // function to add exam under category
  addExamInCategory(categorykey, metaData) {
    const examInCategories = firebase.database().ref('categories')
    const objExam = examInCategories.child(categorykey).child('examsInCategory')
    const objExamResult = objExam.push(metaData)
    if (objExamResult) {
      objExam.child(objExamResult.key).update({
        examsInCategoryKey: objExamResult.key,
      })
      return objExamResult.key
    }
  }

  // function to get data from question bank based on qstnId
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
  // function to get all exam details
  getExamDetails(categorykey, examkey, examcategoryKey) {
    return firebase
      .database()
      .ref('categories')
      .child(categorykey)
      .child('examsInCategory')
      .child(examcategoryKey)
      .child('metaData')
  }

  async getExamDetails_v2(args: any) {
    return firebase
      .database()
      .ref('categories')
      .child(args.categorykey)
      .child('examsInCategory')
      .child(args.examinCatkey)
      .child('metaData')
  }

  async getExamResults(examId) {
    return firebase.database().ref('topPerformersofExam').child(examId)
  }

  // function to get all questions
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
  async getPublishedCategories() {
    return await firebase
      .database()
      .ref(COLLECTION_KEYS.MAIN_TOPIC)
      .orderByChild('isPublished')
      .equalTo(true)
  }

  // function to get question details based on question key
  getQuestionDetails(examkey, qstnkey) {
    return firebase
      .database()
      .ref('exams')
      .child(examkey)
      .child('data')
      .child('questions')
      .child(qstnkey)
      .once('value')
  }
  // function to add question
  addQuestions(questions, examkey) {
    const exams = firebase.database().ref('exams')
    const exam = exams.child(examkey)
    return exam.child('data').child('questions').push(questions)
  }
  // function to get all questions based on exams
  getAllQuestionsBykey(examkey) {
    return firebase
      .database()
      .ref('exams')
      .child(examkey)
  }

  // function to get all exam details
  getallExams(categorykey, examkey) {
    return firebase
      .database()
      .ref('categories')
      .child(categorykey)
      .child('examsInCategory')
      .child(examkey)
      .child('metaData')
  }
  // function to remove exam from category
  removeExamInCategory(categorykey, examkey) {
    const examsInCategory = firebase
      .database()
      .ref('categories')
      .child(categorykey)
      .child('examsInCategory')
      .child(examkey)
      .remove()
    //  var deleteFromCategories = examsInCategory.remove();

    if (examsInCategory) {
      return 'deleted'
    } else {
      return 'not deleted'
    }
  }
  // function to update exam
  updateExams(categoryKey, metaData) {
    const examInCategories = firebase.database().ref('categories')
    const objExam = examInCategories.child(categoryKey).child('examsInCategory')
    const objExamResult = objExam.push(metaData)
    if (objExamResult) {
      objExam.child(objExamResult.key).update({
        examsInCategoryKey: objExamResult.key,
      })
      return objExamResult.key
    }
  }
  getAllPublishedCategory() {
    return this.getDataList(COLLECTION_KEYS.MAIN_TOPIC)
  }
  // function to update questions
  updateQuestion(
    examkey,
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
        'exams' +
          '/' +
          examkey +
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
  // function to delete exam
  deleteExam(examsInCategoryKey, categorykey): any {
    return this.deleteExamData(examsInCategoryKey, categorykey).then(
      () => {
        return { examsInCategoryKey, categorykey }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    );
  }
  // function to unpublish exam
  updateUnPublishbyKey(examkeys, categorykey) {
    const exam = firebase
      .database()
      .ref(
        'categories' +
          '/' +
          categorykey +
          '/' +
          'examsInCategory' +
          '/' +
          examkeys +
          '/' +
          'metaData'
      )

      .update({
        isPublished: false,
      })
    if (exam) {
      return exam
    }
  }
  // function to publish exam
  updatePublishbyKey(examkeys, categorykey) {
    const exam = firebase
      .database()
      .ref(
        'categories' +
          '/' +
          categorykey +
          '/' +
          'examsInCategory' +
          '/' +
          examkeys +
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
  // function to delete questions
  deleteQuestion(examkeys, qstnkey): any {
    return this.deleteExamQuestionData(examkeys, qstnkey).then(
      () => {
        return { examkeys, qstnkey }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
  }
  // update marks in questions
  updateMarksInExamQuestions(examkey,marks,negativeMarks){
    let examNode;
    firebase.database()
    .ref('exams')
    .child(examkey)
    .once('value').then((snapshot) => {
      examNode = snapshot.val();
      Object.values(examNode.data).forEach((questionNode)=>{
        Object.entries(questionNode).forEach(([qstnkey,question])=>{
          firebase.database().ref('exams')
          .child(examkey)
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
  // for single module
 getExamDetails1(categorykey, examkey, examcategoryKey) {
  return firebase
    .database()
    .ref('categories')
    .child(categorykey)
    .child('examsInCategory')
    .child(examcategoryKey)
    .child('metaData')
    .once('value')
  }
  getExamDetails2(categorykey, examkey, examcategoryKey) {
    return firebase
      .database()
      .ref('categories')
      .child(categorykey)
      .child('examsInCategory')
      .child(examcategoryKey)
      .child('metaData')
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
