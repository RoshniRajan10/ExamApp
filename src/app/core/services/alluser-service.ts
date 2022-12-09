import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import { UserModel } from '../models'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class AllUserService extends DataAccessService {
  hasNode: boolean
  constructor(firebases: AngularFireDatabase) {
    super(firebases)
  }

  getAllUsers() {
    return this.getDataList(COLLECTION_KEYS.USER)
  }

  updatePrimeStatus(userkeys, isPrimeUser) {
    const user = firebase
      .database()
      .ref('users' + '/' + userkeys)

      .update({
        isPrimeUser: 'Prime',
      })
    if (user) {
      return user
    }
  }
  updateUserPrimeStatus(userkeys, isPrimeUser) {
    const user = firebase
      .database()
      .ref('users' + '/' + userkeys)

      .update({
        isPrimeUser: 'Non Prime',
      })
    if (user) {
      return user
    }
  }
  updateActiveStatus(userkeys, isActives) {
    const user = firebase
      .database()
      .ref('users' + '/' + userkeys)

      .update({
        isActive: true,
      })
    if (user) {
      return user
    }
  }
  updateDeActiveStatus(userkeys, isActives) {
    const user = firebase
      .database()
      .ref('users' + '/' + userkeys)

      .update({
        isActive: false,
      })
    if (user) {
      return user
    }
  }
  // to save course data
  saveCourse(courseId,userId,status,date){
    let course;
    this.addCourseNode(userId);
    courseId.forEach(element => {
      course = firebase
      .database()
      .ref(COLLECTION_KEYS.USER)
      .child(userId)
      .child('courses')
      .update({
        [element]:{
          id:element,
          status:status,
          created_at:date
        }
      });
    });
    if (course) {
      return course;
    }
  }
  // to update course data
  updateCourse(courseData,userId,status){
    let course;
    this.addCourseNode(userId);
    courseData.forEach(element => {
      const key = element.id;
      course = firebase
      .database()
      .ref(COLLECTION_KEYS.USER)
      .child(userId)
      .child('courses')
      .update({
        [key]:element
      });
    });
    if (course) {
      return course;
    }
  }
  addCourseNode(userId){
    const course = firebase
    .database()
    .ref(COLLECTION_KEYS.USER)
    .child(userId)
    .update({
      courses:""
    });
  }
  getUserById(userid) {
    let data
    firebase
      .database()
      .ref(COLLECTION_KEYS.USER)
      .child(userid)
      .once('value', (snapshot) => {
        data = snapshot.val()
      })
    return data
  }
  checkForCourseNode(userid,courseKey){
    let hasCourseKey = false;
    const course = firebase
    .database()
    .ref(COLLECTION_KEYS.USER)
    .child(userid)
    .once("value")
    .then((snapshot)=>{
      const hasCourse = snapshot.hasChild("courses");
      if(hasCourse){
        firebase
        .database()
        .ref(COLLECTION_KEYS.USER)
        .child(userid)
        .child('courses')
        .once("value")
        .then((snapshot1)=>{
          hasCourseKey = snapshot.hasChild(courseKey)
        });
      }
    });
    return hasCourseKey
  }
   // function to delete user
   deleteUser(id: any): any {
    // console.log("0")
    const course = firebase
    .database()
    .ref(COLLECTION_KEYS.USER)
    .child(id)
    .once("value").then((snapshot)=>{
      const deleted = snapshot.hasChild("userState");
      if(deleted){
        const result = this.deleteUsers(
          COLLECTION_KEYS.USER,
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
      } else {
        // console.log("2")
        this.addDeleteNode(id);
        this.deleteUser(id);
      }
    });
  }
  addDeleteNode(userId){
    // console.log("3")
    const course = firebase
    .database()
    .ref(COLLECTION_KEYS.USER)
    .child(userId)
    .update({
      userState:""
    });
  }
  // function to delete user
  restoreUser(id: any): any {
    // console.log("0")
    const result = this.restoreUsers(
      COLLECTION_KEYS.USER,
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
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
