import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { NewsModel } from '../models'
import { DataAccessService } from './data-access.service'
import { COLLECTION_KEYS } from '../config'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root',
})
export class NewsService extends DataAccessService {
  // tslint:disable-next-line: no-shadowed-variable
  constructor(firebase: AngularFireDatabase) {
    super(firebase)
  }
  // function to get all news
  getNews() {
    return this.getDataList(COLLECTION_KEYS.NEWS)
  }
  // function to get main topic details by id
  getCategoryDetails(id: any) {
    return this.getDataDetails(COLLECTION_KEYS.MAIN_TOPIC, id)
  }
  // function to manage news like save
  manageNews(objTopic: NewsModel): any {
    const { categoryKey } = objTopic
    const Collectioney = `${COLLECTION_KEYS.NEWS}/${categoryKey}`
    const result = this.saveOrUpdateData(Collectioney, objTopic)
    return Collectioney
  }
  // function to delete news
  deleteNews(categoryKey, newsKey): any {
    const result = this.deleteNewsData(categoryKey, newsKey).then(
      () => {
        return { categoryKey, newsKey }
      },
      (error) => {
        return { error: 'failed', details: error }
      }
    )
    return result
  }
  // function to get news details by key
  getNewsDetailss(categoryKey, newsKey) {
    const details = `${COLLECTION_KEYS.NEWS}/${categoryKey}`
    // return this.getDataDetails(
    //   `${COLLECTION_KEYS.NEWS}/${categoryKey}`,
    //   newsKey
    // )
    return firebase
      .database()
      .ref(details)
      .child(newsKey)
      
  }
  // function to update news
  updateNews(
    key,
    newsKey,
    categoryNames,
    description1,
    newsName1,
    newsLinks,
    categoryKeys
  ) {
    const res = firebase
      .database()
      .ref('newsInCategory' + '/' + key + '/' + newsKey)
      .update({
        categoryName: categoryNames,
        description: description1,
        newsName: newsName1,
        newsLink: newsLinks,
        categoryKey: categoryKeys,
      })
    if (res) {
      return res
    }
  }
}
