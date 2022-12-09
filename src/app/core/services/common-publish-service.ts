import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { DataAccessService } from './data-access.service'
import {
  ParentTopicService,
  SubTopicService,
  ToastMessageService,
  MainTopicService,
  ChapterService,
  MonthService,
  FaqService,
  StudyMaterialService,
  PracticeService,
  YouTubeVideoService,
  ExamService,
} from '@app/core'
import { APP_MESSAGE } from '../config'
import { ToastrService } from 'ngx-toastr'
declare var $: any
@Injectable({
  providedIn: 'root',
})
export class CommonPublishService extends DataAccessService {
  constructor(
    firebase1: AngularFireDatabase,
    private toastr: ToastMessageService,
    private parentTopicService: ParentTopicService,
    public mainTopicService: MainTopicService,
    private subTopicService: SubTopicService,
    private chapterService: ChapterService,
    private monthService: MonthService,
    public faqService: FaqService,
    public youTubeVideoService: YouTubeVideoService,
    public studyMaterialService: StudyMaterialService,
    public practiceService: PracticeService,
    public examService: ExamService
  ) {
    super(firebase1)
  }

  publishItem(sectionid, sectionItems) {
    if (sectionid === 1) {
      const $key = sectionItems.id
      this.parentTopicService
        .manageParentTopic({ $key, isPublished: true })
        .then(() => {
          this.toastr.show(
            APP_MESSAGE.PARENT_TOPIC.parent_topic_published,
            false
          )
        })
    } else if (sectionid === 2) {
      const $key = sectionItems.id
      this.mainTopicService
        .manageMainTopic({ $key, isPublished: true })
        .then(() => {
          this.toastr.show(APP_MESSAGE.MAIN_TOPIC.main_topic_published, false)
        })
    } else if (sectionid === 3) {
      const categorykey = sectionItems.categorykey
      const subcatKey = sectionItems.subcatKey
      this.subTopicService
        .updatePublishbyKey(subcatKey, categorykey)
        .then(() => {
          this.toastr.show(APP_MESSAGE.SUB_TOPIC.sub_topic_published, false)
        })
    } else if (sectionid === 4) {
      const $key = sectionItems.id
      this.chapterService.publishChapter($key).then(() => {
        this.toastr.show(APP_MESSAGE.CHAPTER.chapter_published, false)
      })
    } else if (sectionid === 6) {
      const $key = sectionItems.id
      this.monthService.manageMonth({ $key, isPublished: true }).then(() => {
        this.toastr.show(APP_MESSAGE.MONTH.month_published, false)
      })
    } else if (sectionid === 9) {
      const subcatKey = sectionItems.subcatKey
      const faqKey = sectionItems.faqKey
      this.faqService.publishFaq(subcatKey, faqKey).then(() => {
        this.toastr.show(APP_MESSAGE.FAQ.faq_published, false)
      })
    } else if (sectionid === 10) {
      const videokey = sectionItems.videokey
      this.youTubeVideoService.publishVideo(videokey).then(() => {
        this.toastr.show(APP_MESSAGE.VIDEO.video_published, false)
      })
    } else if (sectionid === 11) {
      const chapterKeys = sectionItems.chapterKey
      const studyMaterialsInChapterKeys =
        sectionItems.studyMaterialsInChapterKey
      this.studyMaterialService
        .updatePublishbyKey(chapterKeys, studyMaterialsInChapterKeys)
        .then(() => {
          this.toastr.show(
            APP_MESSAGE.STUDY_MATERIAL.study_mat_published,
            false
          )
        })
    } else if (sectionid === 13) {
      const {
        practicesInChapterKeys: practicekey,
        practiceId,
        isPublished,
        chapterkey,
      } = sectionItems
      const questionList = this.practiceService
        .getQuestionsByPractice(practiceId)
        .then((list) => {
          list.on('value', (data) => {
            const { data: qData } = data.val()
            if (
              qData &&
              qData.questions &&
              Object.keys(qData.questions).length > 0
            ) {
              this.practiceService
                .updatePublishbyKey(practicekey, chapterkey)
                .then(() => {
                  this.toastr.show(
                    APP_MESSAGE.PRACTICE.practice_published,
                    false
                  )
                  $('#modal-update-publish').modal('hide')
                })
            } else {
              this.toastr.show(
                'Create at least one question for publishing this practice',
                true
              )
            }
          })
        })
    } else if (sectionid === 15) {
      const examkeys = sectionItems.examkeys
      const categorykey = sectionItems.categorykey
      this.examService.updatePublishbyKey(examkeys, categorykey).then(() => {
        $('#modal-update-publish').modal('hide')
        this.toastr.show(APP_MESSAGE.EXAM.exam_published, false)
      })
    }
    if (sectionid !== 13) {
      $('#modal-update-publish').modal('hide')
    }
  }
}
