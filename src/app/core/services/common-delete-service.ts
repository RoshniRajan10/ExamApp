import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { DataAccessService } from './data-access.service'
import {
  ChapterService,
  MainTopicService,
  ParentTopicService,
  SubTopicService,
  ToastMessageService,
  MonthService,
  UserTipService,
  NewsService,
  FaqService,
  YouTubeVideoService,
  StudyMaterialService,
  PracticeService,
  ExamService,
  CurrentAffairService,
  AllUserService
} from '@app/core'
import { APP_MESSAGE } from '../config'
import { ExamLevelService } from './exam-level-service'
declare var $: any
@Injectable({
  providedIn: 'root',
})
export class CommonDeleteService extends DataAccessService {
  userTipItems: any[]
  addExamTipForm: any
  constructor(
    firebase1: AngularFireDatabase,
    private toastr: ToastMessageService,
    private parentTopicService: ParentTopicService,
    public mainTopicService: MainTopicService,
    private subTopicService: SubTopicService,
    private chapterService: ChapterService,
    private monthService: MonthService,
    private examLevelService: ExamLevelService,
    public userTipService: UserTipService,
    public newsService: NewsService,
    public faqService: FaqService,
    public youTubeVideoService: YouTubeVideoService,
    public studyMaterialService: StudyMaterialService,
    public practiceService: PracticeService,
    public examService: ExamService,
    public currentAffiarService: CurrentAffairService,
    public allUserService: AllUserService
  ) {
    super(firebase1)
  }

  deleteItem(sectionid, sectionItems) {
    if (sectionid === 1) {
      const id = sectionItems.id
      const result = this.parentTopicService.deleteTopic(id).then(() => {})
    } else if (sectionid === 2) {
      const id = sectionItems.id
      const result = this.mainTopicService.deleteMainTopic(id)
    } else if (sectionid === 3) {
      const subcatKey = sectionItems.subcatKey
      const categorykey = sectionItems.categorykey
      const result = this.subTopicService.deleteSubTopic(subcatKey, categorykey)
    } else if (sectionid === 4) {
      const id = sectionItems.$key
      const chapterInSubCatKeys = sectionItems.chapterInSubCatKey
      const categorykeys = sectionItems.categorykey
      const subCategorykeys = sectionItems.subCategorykey
      this.chapterService.deleteChapter(id)
      this.chapterService.deleteChapInSubCategory(
        id,
        chapterInSubCatKeys,
        categorykeys,
        subCategorykeys
      )
    } else if (sectionid === 5) {
      const id = sectionItems.id
      const result = this.examLevelService.deleteExamLevel(id)
    } else if (sectionid === 6) {
      const id = sectionItems.id
      const result = this.monthService.deleteMonth(id)
    } else if (sectionid === 7) {
      const categoryKey = sectionItems.categoryKey
      const userTipKey = sectionItems.userTipKey
      const result = this.userTipService.deleteUserTips(categoryKey, userTipKey)
      $('#showDeleteDialog').modal('hide')
    } else if (sectionid === 8) {
      const categoryKey = sectionItems.categoryKey
      const newsKey = sectionItems.newsKeys
      const result = this.newsService.deleteNews(categoryKey, newsKey)
      // this.NewsItems = []
    } else if (sectionid === 9) {
      const subcatKey = sectionItems.subcatKey
      const faqKey = sectionItems.faqKey
      const result = this.faqService.deleteFaq(subcatKey, faqKey)
      // this.MainTopicItems1 = []
    } else if (sectionid === 10) {
      const categoryKey = sectionItems.categoryKey
      const subCategoryKey = sectionItems.subCategoryKey
      const chapterKeys = sectionItems.chapterKey
      const videokey = sectionItems.videokey
      const videosInchapterKey = sectionItems.videosInchapterKey
      const result = this.youTubeVideoService.deleteVideo(videokey)
      if (result) {
        const videoDeleteRes = this.youTubeVideoService.deleteVideoInChapterKey_v2(
          chapterKeys,videokey
        )
        $('#showDeleteDialog').modal('hide')
      }
    } else if (sectionid === 11) {
      const chapterKeys = sectionItems.chapterKey
      const studyMaterialsInChapterKeys =
        sectionItems.studyMaterialsInChapterKey
      const result = this.studyMaterialService.deleteStudyMaterial(
        chapterKeys,
        studyMaterialsInChapterKeys
      )
    } else if (sectionid === 12) {
      const studyMaterialID = sectionItems.studyMaterialID
      const studyMatkey = sectionItems.studyMatDatakey
      const result = this.studyMaterialService.deleteAllStudyMaterial(
        studyMaterialID,
        studyMatkey
      )
    } else if (sectionid === 13) {
      const practicekey = sectionItems.practicekeys
      const chapterkey = sectionItems.chapterkey
      const result = this.practiceService.deletePractice(
        practicekey,
        chapterkey
      )
    } else if (sectionid === 14) {
      const practicekey = sectionItems.practiceKey
      const qstnkey = sectionItems.qstnkey
      const result = this.practiceService.deleteQuestion(practicekey, qstnkey)
    } else if (sectionid === 15) {
      const examsInCategoryKey = sectionItems.examsInCategoryKey
      const categorykey = sectionItems.categorykey
      const result = this.examService.deleteExam(
        examsInCategoryKey,
        categorykey
      )
    } else if (sectionid === 16) {
      const examkeys = sectionItems.examkeys
      const qstnkey = sectionItems.qstnkey
      const result = this.examService.deleteQuestion(examkeys, qstnkey)
    } else if (sectionid === 17) {
      const id = sectionItems.id
      const result = this.currentAffiarService.deleteCurrentAffair(id)
    } else if (sectionid === 18) {
      const id = sectionItems.id
      const result = this.allUserService.deleteUser(id)
    }

    $('#showDeleteDialog').modal('hide')
    this.toastr.show(APP_MESSAGE.DELETE.delete_data, false)
  }
  restoreItem(sectionid, sectionItems) {
    if (sectionid === 18) {
      const id = sectionItems.id
      const result = this.allUserService.restoreUser(id)
    }
    $('#showRestoreDialog').modal('hide')
    this.toastr.show(APP_MESSAGE.RESTORE.restore_data, false)
  }
}
