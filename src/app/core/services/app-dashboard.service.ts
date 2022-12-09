import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class AppDashboardService extends DataAccessService {

  constructor(fireBase: AngularFireDatabase) {
    super(fireBase)
  }
  // function to get all chapters
  getAllVideosInDashBoard() {
    return this.getDataList('dashboard/highLightedVideos')
  }
  removeHighlightedVideo(videoKey){
    const result = firebase.database().ref('dashboard/highLightedVideos')
    .child(videoKey)
    .remove()
    if(result){
      return result
    }
  }
  addVideoToDashBoard(videoDetails,order){
    const result = firebase.database().ref('dashboard/highLightedVideos')
    .update({
      [videoDetails.videokey]:{
        order: order,
        videoId: videoDetails.videokey,
        data: videoDetails
      }
    })
    if(result){
      return result;
    }
  }
  addCurrentAffairsData(params){
    const result = firebase.database().ref(COLLECTION_KEYS.APP_DASHBOARD)
    .update(params);
    if(result){
      return result;
    }
  }
  getCurrentAffairsData(){
    return firebase.database().ref(COLLECTION_KEYS.APP_DASHBOARD)
  }
  // function to update video
  updateVideoOrder(videokey, order) {
    const res = firebase.database().ref(COLLECTION_KEYS.APP_DASHBOARD)
    .child('highLightedVideos')
    .child(videokey)
    .update({ order: order })
    if (res) {
      return res
    }
  }
}
