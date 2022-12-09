import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { DataAccessService } from './data-access.service'
import {
  ParentTopicService,
  MainTopicService,
  SubTopicService,
  ToastMessageService,
  ChapterService,
  MonthService,
  FaqService,
  StudyMaterialService,
  PracticeService,
  YouTubeVideoService,
  ExamService,
  CurrentAffairService,
} from '@app/core'
import { APP_MESSAGE } from '../config'
declare var $: any
@Injectable({
  providedIn: 'root',
})
export class CommonUnPublishService extends DataAccessService {
  constructor(
    firebase1: AngularFireDatabase,
    private toastr: ToastMessageService,
    private parentTopicService: ParentTopicService,
    public mainTopicService: MainTopicService,
    private subTopicService: SubTopicService,
    private chapterService: ChapterService,
    private monthService: MonthService,
    public faqService: FaqService,
    public studyMaterialService: StudyMaterialService,
    public practiceService: PracticeService,
    public youTubeVideoService: YouTubeVideoService,
    public examService: ExamService,
    public currentAffiarService: CurrentAffairService
  ) {
    super(firebase1)
  }

  unPublishItem(sectionid, sectionItems) {
    if (sectionid === 1) {
      const $key = sectionItems.id
      this.parentTopicService
        .manageParentTopic({ $key, isPublished: false })
        .then(() => {
          this.toastr.show(
            APP_MESSAGE.PARENT_TOPIC.parent_topic_unpublished,
            false
          )
        })
    } else if (sectionid === 2) {
      const $key = sectionItems.id
      this.mainTopicService
        .manageMainTopic({ $key, isPublished: false })
        .then(() => {
          this.toastr.show(APP_MESSAGE.MAIN_TOPIC.main_topic_unpublished, false)
        })
    } else if (sectionid === 3) {
      const categorykey = sectionItems.categorykey
      const subcatKey = sectionItems.subcatKey
      this.subTopicService
        .updateUnPublishbyKey(subcatKey, categorykey)
        .then(() => {
          this.toastr.show(APP_MESSAGE.SUB_TOPIC.sub_topic_unpublished, false)
        })
    } else if (sectionid === 4) {
      const $key = sectionItems.id
      this.chapterService.unPublishChapter($key).then(() => {
        this.toastr.show(APP_MESSAGE.CHAPTER.chapter_unpublished, false)
      })
    } else if (sectionid === 6) {
      const $key = sectionItems.id
      this.monthService.manageMonth({ $key, isPublished: false }).then(() => {
        this.toastr.show(APP_MESSAGE.MONTH.month_unpublished, false)
      })
    } else if (sectionid === 9) {
      const subcatKey = sectionItems.subcatKey
      const faqKey = sectionItems.faqKey
      this.faqService.unPublishFaq(subcatKey, faqKey).then(() => {
        this.toastr.show(APP_MESSAGE.FAQ.faq_unpublished, false)
      })
    } else if (sectionid === 10) {
      const videokey = sectionItems.videokey
      this.youTubeVideoService.unPublishVideo(videokey).then(() => {
        this.toastr.show(APP_MESSAGE.VIDEO.video_unPublished, false)
      })
    } else if (sectionid === 11) {
      const chapterKeys = sectionItems.chapterKey
      const studyMaterialsInChapterKeys =
        sectionItems.studyMaterialsInChapterKey
      this.studyMaterialService
        .updateUnPublishbyKey(chapterKeys, studyMaterialsInChapterKeys)
        .then(() => {
          this.toastr.show(
            APP_MESSAGE.STUDY_MATERIAL.study_mat_unpublished,
            false
          )
        })
    } else if (sectionid === 13) {
      const practicekey = sectionItems.practicesInChapterKeys
      const chapterkey = sectionItems.chapterkey
      this.practiceService
        .updateUnPublishbyKey(practicekey, chapterkey)
        .then(() => {
          this.toastr.show(APP_MESSAGE.PRACTICE.practice_unpublished, false)
        })
    } else if (sectionid === 15) {
      const examkeys = sectionItems.examkeys
      const categorykey = sectionItems.categorykey
      this.examService.updateUnPublishbyKey(examkeys, categorykey).then(() => {
        this.toastr.show(APP_MESSAGE.EXAM.exam_unpublished, false)
      })
    } else if (sectionid === 17) {
      const $key = sectionItems.id
      this.currentAffiarService
        .manageCurrentAffair({ $key, isPublished: false })
        .then(() => {
          this.toastr.show(
            APP_MESSAGE.CURRENT_AFFAIRS.current_affairs_unpublished,
            false
          )
        })
    }

    $('#modal-update-unpublish').modal('hide')
  }
}
