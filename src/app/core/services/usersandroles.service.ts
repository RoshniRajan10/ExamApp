import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'
import { ACTION_CODE_SETTINGS } from '@app/core/config'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class UsersandrolesService extends DataAccessService {

  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }
  // function to get all users
  getAllUsers() {
    return this.getDataList(COLLECTION_KEYS.USERS_AND_ROLES)
  }
  //get user details by key
  getUserDetailsByKey(userKey){
    return firebase.database().ref(COLLECTION_KEYS.USERS_AND_ROLES)
    .child(userKey)
    .once("value")
  }
  // add user
  addUserDetails(userDetails){
    const password = "abcd?1234"
    const userData = firebase.auth().createUserWithEmailAndPassword(userDetails.email, password)
    .then((userCredential) => {
      // Signed in 
      let user = userCredential.user;
      console.log(user.uid)
      if(user){
        firebase.auth().sendSignInLinkToEmail(userDetails.email,ACTION_CODE_SETTINGS)
      }
      const updateQuesry = firebase.database().ref(COLLECTION_KEYS.USERS_AND_ROLES);
      const insertUserDetails = updateQuesry
      .update({
        [user.uid]:userDetails
      })
      if (insertUserDetails) {
        updateQuesry.update({userKey: user.uid })
      }
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      // ..
    });
    if(userData){
      return userData
    }
  }
  // edit user
  updateUserDetails(userKey){
    // Imports the Google Cloud client library.
    // const ad = admin
    return true;
  }
}
