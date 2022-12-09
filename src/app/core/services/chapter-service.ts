import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class ChapterService extends DataAccessService {
  constructor(fireBase: AngularFireDatabase) {
    super(fireBase)
  }
  // function to get all chapters
  getAllChaptersInSubCategory() {
    return this.getDataList(COLLECTION_KEYS.CHAPTER)
  }
  // function to add chapters under subcategory
  addChapterInSubCategory(params, categorykey, subCategorykey) {
    const chapterInCategories = firebase.database().ref('categories')
    const objChapter = chapterInCategories
      .child(categorykey)
      .child('subCategories')
      .child(subCategorykey)
      .child('chaptersInSubCategories')
    const objChapterResult = objChapter.push(params)
    return objChapterResult
  }
  // function to add chapters
  addChapter(params) {
    const chapterInCategories = firebase.database().ref('chapter')
    const objChapterResult = chapterInCategories.push(params)
    return objChapterResult.key
  }
  // function to update chapter in subcategory key
  updateChapterkeyInSubCategory(
    chapterInSubCatKeys,
    categorykeys,
    subCategorykeys,
    value
  ) {
    const chapterResults = firebase
      .database()
      .ref(
        'categories' +
          '/' +
          categorykeys +
          '/' +
          'subCategories' +
          '/' +
          subCategorykeys +
          '/' +
          'chaptersInSubCategories' +
          '/' +
          chapterInSubCatKeys
      )
      .update({
        chapterId: value,
      })
    if (chapterResults) {
      return chapterResults
    }
  }
  // function to delete chapter
  deleteChapter(id: any): any {
    const result = this.deleteDatas(COLLECTION_KEYS.CHAPTER, id).then(
      () => {
        return { id }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
  // function to delete chapter in subcategory
  deleteChapInSubCategory(
    id,
    chapterInSubCatKeys,
    categorykeys,
    subCategorykeys
  ) {
    const chapterRes = firebase
      .database()
      .ref(
        'categories' +
          '/' +
          categorykeys +
          '/' +
          'subCategories' +
          '/' +
          subCategorykeys +
          '/' +
          'chaptersInSubCategories' +
          '/' +
          chapterInSubCatKeys
      )
    const res = chapterRes.remove()
    if (res) {
      return true
    }
  }
  // function to unpublish chapter
  unPublishChapter(key: any): any {
    const chapterRes = firebase
      .database()
      .ref('chapter' + '/' + key)

      .update({
        isPublished: false,
      })
    if (chapterRes) {
      return chapterRes
    }
  }
  // function to publish chapter
  publishChapter(key: any): any {
    const chapterRes = firebase
      .database()
      .ref('chapter' + '/' + key)
      .update({
        isPublished: true,
      })
    if (chapterRes) {
      return chapterRes
    }
  }
  // function to get chapter details by id
  getChapterDetails(id: any) {
    return this.getDataDetails(COLLECTION_KEYS.CHAPTER, id)
  }
  // function to update chapter
  updateChapters(id: any, subCategoryNames, categoryNames, chapterNames, isPremium) {
    const res = firebase
      .database()
      .ref('chapter' + '/' + id)
      .update({
        subCategoryName: subCategoryNames,
        categoryName: categoryNames,
        chapterName: chapterNames,
        isPremium: isPremium,
        isPublished: false
      })
    if (res) {
      return res
    }
  }
  // function to update chapter in subcategory
  updateChaptersInSubCategory(
    chapterInSubCatKeys,
    categorykeys,
    subCategorykeys,
    chapterNames
  ) {
    const chapterRes = firebase
      .database()
      .ref(
        'categories' +
          '/' +
          categorykeys +
          '/' +
          'subCategories' +
          '/' +
          subCategorykeys +
          '/' +
          'chaptersInSubCategories' +
          '/' +
          chapterInSubCatKeys
      )
      .update({
        chapterName: chapterNames,
      })
    if (chapterRes) {
      return chapterRes
    }
  }
  // To update sub topic in Practices categorykeys,subCategorykeys,id,this.chapterName,this.videoItems
  getVideos(categorykeys,subCategorykeys,chapterKey,chapterName,youtubeItems){
    youtubeItems.forEach((youtubeItem) => {
      if((youtubeItem.categoryKey === categorykeys)
          &&(youtubeItem.subCategoryKey === subCategorykeys)
          &&(youtubeItem.chapterKey === chapterKey)){
        this.updateYoutube(youtubeItem.videokey,chapterKey,chapterName);
      }
    });
  }
  updateYoutube(mainKey,chapterKey,chapterName){
    const res = firebase.database()
    .ref(COLLECTION_KEYS.YOUTUBE_DATA)
    .child(mainKey)
    .child("data")
    .child("chapterKey")
    .once("value").then((snapShot)=>{
      const data = snapShot.val();
      if(data === chapterKey){
        firebase.database()
        .ref(COLLECTION_KEYS.YOUTUBE_DATA)
        .child(mainKey)
        .child('data')
        .update({
          chapterName:chapterName,
        });
      }
    })
    if(res){
      return res;
    }
  }
  // To update sub topic in study materials
  getStudyMaterials(categorykeys,subCategorykeys,chapterKey,chapterName,studymaterials){
    studymaterials.forEach((materials) => {
      if((materials.categorykey === categorykeys)
          &&(materials.subCategoryKey === subCategorykeys) 
          &&(materials.chapterKey === chapterKey)){
        this.updateStudyMaterial(materials.chapterKey,materials.studyMaterialsInChapterKey,chapterKey,chapterName);
      }
    });
  }
  updateStudyMaterial(chapterkey,sMCKkey,chapterKey,chapterName){
    const res = firebase.database()
    .ref(COLLECTION_KEYS.STUDY_MATERIAL_SUBCAT)
    .child(chapterkey)
    .child(sMCKkey)
    .child("metaData")
    .child("chapterkey")
    .once("value").then((snapShot)=>{
      const data = snapShot.val();
      if(data === chapterKey){
        firebase.database()
        .ref(COLLECTION_KEYS.STUDY_MATERIAL_SUBCAT)
        .child(chapterkey)
        .child(sMCKkey)
        .child('metaData')
        .update({
          chapterName:chapterName,
        });
      }
    })
    if(res){
      return res;
    }
  }
  // To update sub topic in Practices
  getPractices(categorykeys,subCategorykeys,chapterKey,chapterName,PracticeItems){
    PracticeItems.forEach((practices) => {
      if((practices.categoryKeys === categorykeys)
          &&(practices.subCategoryKeys === subCategorykeys)
          &&(practices.chapterkey === chapterKey)){
        this.updatePractices(practices.chapterkey,practices.practicesInChapterKeys,chapterKey,chapterName);
      }
    });
  }
  updatePractices(mainKey,pCTKkey,chapterKey,chapterName){
    const res = firebase.database()
    .ref(COLLECTION_KEYS.PRACTICE_SUBCATEGORIES)
    .child(mainKey)
    .child(pCTKkey)
    .child("metaData")
    .child("chapterkey")
    .once("value").then((snapShot)=>{
      const data = snapShot.val();
      if(data === chapterKey){
        firebase.database()
        .ref(COLLECTION_KEYS.PRACTICE_SUBCATEGORIES)
        .child(mainKey)
        .child(pCTKkey)
        .child('metaData')
        .update({
          chapterName:chapterName,
        });
      }
    })
    if(res){
      return res;
    }
  }

  // get chapterdetails by id
  getChapterById(key){
    return firebase
      .database()
      .ref(COLLECTION_KEYS.CHAPTER)
      .child(key)
  }

  // save chapter key in practices 
  saveChapterIdInPractices(practiceKey, chapterKeyToSave, chapterDetails) {
    const practiceNode  = firebase
                          .database()
                          .ref(COLLECTION_KEYS.PRACTICE)
                          .child(practiceKey)
    practiceNode
    .once('value').then((snapshot)=>{
      const hasNode = snapshot.hasChild("chaptersUsing");
      if(!hasNode){
        this.addchaptersUsingNode(practiceNode)
        .then(()=>{
          practiceNode
          .update({
            "chaptersUsing": {
              [chapterKeyToSave]: chapterDetails
            }
          });
        });
      } else {
        const chapterUsingNode = practiceNode.child("chaptersUsing");
        chapterUsingNode.once('value').then((snapShot)=>{
          const hasChapter = snapShot.hasChild(chapterKeyToSave);
          if(!hasChapter){
            chapterUsingNode.update({
              [chapterKeyToSave]: chapterDetails
            });
          } else {
            console.log(chapterKeyToSave+" already exists")
          }
        });
      }
    });
  }
  removeChapterFromPractice(practiceKey, chapterKeyToSave){
    console.log("practiceKey")
    console.log(practiceKey)
    console.log("chapterKeyToSave")
    console.log(chapterKeyToSave)
    const practiceNode = firebase
                          .database()
                          .ref(COLLECTION_KEYS.PRACTICE)
                          .child(practiceKey)
                          .child("chaptersUsing");
    practiceNode.child(chapterKeyToSave).remove();
    
  }
  addchaptersUsingNode(practiceNode){
    return practiceNode
    .update({
      chaptersUsing:""
    });
  }

  getAllPracticesChapterUsed(){
    const practices = firebase.database().ref(COLLECTION_KEYS.PRACTICE)
    .once('value');
    return practices;
  }
}
