import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { element } from 'protractor'
import * as firebase from 'firebase'
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
}
@Injectable({
  providedIn: 'root',
})
export class YouTubeVideoService extends DataAccessService {
  constructor(firebases: AngularFireDatabase, private http: HttpClient) {
    super(firebases)
  }
  // function to get all videos
  getAllYoutubeVideos() {
    return this.getDataList(COLLECTION_KEYS.YOUTUBE_DATA)
  }
  // function to fetch video details based on url
  getVideoDetails(videoDetails) {
    const id = videoDetails
    // let headers = new HttpHeaders()
    // const url =
    // 'https://noembed.com/embed?url=https://www.youtube.com/watch?v=' + id
    const url =
      'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + id
    // const options = { headers: headers }
    return this.http.get(url, {
      headers: new HttpHeaders({
        'content-type': 'application/json',
      }),
    })
  }
  // function to publish video
  publishVideo(videokey) {
    const res = firebase
      .database()
      .ref('youtubeData' + '/' + videokey + '/' + 'data')
      .update({
        isPublished: true,
      })
    if (res) {
      return res
    }
  }
  // function to unpublish video
  unPublishVideo(videokey) {
    const res = firebase
      .database()
      .ref('youtubeData' + '/' + videokey + '/' + 'data')
      .update({
        isPublished: false,
      })
    if (res) {
      return res
    }
  }
  // function to delete video
  deleteVideo(videokey): any {
    const result = this.deleteVideoData(videokey).then(
      () => {
        return { videokey }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
  // function to delete video under chapter key
  deleteVideoInChapterKey(chapterKeys): any {
    const result = this.deleteVideoDatas(chapterKeys).then(
      () => {
        return { chapterKeys }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }

  deleteVideoInChapterKey_v2(chapterKeys,videokey):any  {
    const result = this.deleteVideoDatas_v2(chapterKeys,videokey).then(
      () => {
        return { chapterKeys }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }


  // function to add youtube data
  addYoutubeData(VideoData) {
    const videoData = firebase.database().ref('youtubeData')

    if (!VideoData.embedUrl) {
      VideoData.embedUrl = `"https://www.youtube.com/embed/${VideoData.video_id}?feature=oembed"`
    }
    if (!VideoData.thumbnail_url) {
      VideoData.thumbnail_url = ''
    }
    if (!VideoData.author_url) {
      VideoData.author_url = ''
    }
    VideoData.url = VideoData.ur || ''

    const objResult = videoData.push({ data: VideoData })
    return objResult.key
  }
  //update video data
  updateYoutubeData(VideoData,videoKey){
    if (!VideoData.embedUrl) {
      VideoData.embedUrl = `"https://www.youtube.com/embed/${VideoData.video_id}?feature=oembed"`
    }
    if (!VideoData.thumbnail_url) {
      VideoData.thumbnail_url = ''
    }
    if (!VideoData.author_url) {
      VideoData.author_url = ''
    }
     const videoData = firebase.database()
     .ref(COLLECTION_KEYS.YOUTUBE_DATA)
     .child(videoKey)
     .child('data')
     .update(VideoData);
    // const videoData = true;
     return videoData
  }
  // function to add videodetails under chapterkey
  addVideosInChapter(params, chapterKey, youtubeDataKey, VideoData) {
    const videoData = firebase.database().ref('youtubeVideoInChapter')
    const objResults = videoData
      .child(chapterKey)
      .child(youtubeDataKey)
      .update(params)
    if (objResults) {
      const objResultsData = videoData
        .child(chapterKey)
        .child(youtubeDataKey)
        .update({ data: VideoData })
      return objResultsData
    }
    // const objResult = objResults.push(params)
    // .push(params)
    // const objResult = objResults.push(params)
  }
  // function to update video
  updateVideoOrder(videokey, order) {
    const res = firebase
      .database()
      .ref('youtubeData' + '/' + videokey + '/' + 'data')
      // tslint:disable-next-line
      .update({ order: order })
    if (res) {
      return res
    }
  }
  // async getVideoDetailsById(chapterKey,youtubeDataKey) {
  //   return await firebase.database()
  //   .ref(COLLECTION_KEYS.YOUTUBE_INCHAPTER)
  //   .child(chapterKey)
  //   .child(youtubeDataKey)
  // }
  // function to get all exam details
  async getVideoDetailsById(chapterKey,youtubeDataKey) {
    return await firebase.database()
    .ref('youtubeVideoInChapter')
    .child(chapterKey)
    .child(youtubeDataKey)
    
  }
  getAllPublishedCategories() {
    return this.getDataList(COLLECTION_KEYS.MAIN_TOPIC)
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
