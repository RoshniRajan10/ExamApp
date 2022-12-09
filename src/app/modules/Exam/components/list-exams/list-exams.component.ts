import { Component, OnInit } from '@angular/core'
import {
  ExamService,
  ToastMessageService,
  PushNotificationService,
  ChapterService,
  MainTopicService,
} from '@app/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import * as firebase from 'firebase'
import { SECTIONS } from '@app/core/utils'
import { MatTextareaAutosize } from '@angular/material/input'
import { of } from 'rxjs'
@Component({
  selector: 'app-list-exams',
  templateUrl: './list-exams.component.html',
  styleUrls: ['./list-exams.component.scss'],
})
export class ListExamsComponent implements OnInit {
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  notificationForm: FormGroup;
  examList: any[] = [];
  examsInCategory: any[];
  AllExamList: any[];
  ExamItems1: any[] = [];
  categorykey: any;
  examkeys: any;
  isPublished: boolean;
  searchExam: any;
  MainTopicItems1: any;
  subcatname: any;
  chapterItems: any;
  chapterData: any[] = [];
  subCategoryList: any[];
  subCategories: any;
  MainTopicList: any;
  chapterList: any[];
  type: string;
  details: any;
  msgtitle: boolean;
  Result: any;
  examsId: any;
  submitted: boolean;
  deleteMessage: string;
  pageSort = 'asc';
  isDataLoaded = false;
  examLevelList: any[];
  examLevelForm: any;
  data1: any;
  QstnList: any[] = [];
  Qstnlength: number;
  deleteItem: any;
  publishItem: any;
  unPublishItem: any;
  searchFilter = {
    mainTopic: { $key: '', categoryName: 'Select Main Topic' },
    subTopic: { $key: '', subCategory: 'Select Sub Topic', subcatKey: '' },
    chapter: { $key: '', chapterName: 'Select Chapter', chapterkey: '' },
  };
  // for pagination
  pageNo: number = 1;
  pageNoBind: number;
  publishWarning: string
  onSearchChange(searchExam: string): void {
    this.pageNo = 1
  }
  pageMaxSize: number = 10;
  itemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  checked = false;
  constructor(
    public examService: ExamService,
    public chapterService: ChapterService,
    public mainTopicService: MainTopicService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public formbuilder: FormBuilder,
    public toastr: ToastMessageService,
    private spinner: NgxSpinnerService,
    public pushNotificationService: PushNotificationService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo ? params.pageNo : 1;
      this.itemsPerPage = params.itemsPerPage ? parseInt(params.itemsPerPage) : 10;
    })
    this.setexamLevelForm()
    this.setNotificationForm()
  }
  ngOnInit() {
    this.getAllExamList()
    this.getAllExamLevel()
    this.getMainTopicList()
  }
  getAllExamList() {
    // function to get all exam details
    this.loadSpinner(true)
    this.examList = []
    this.ExamItems1 = []
    const ref = this
    this.examService.getAllPublishedCategories().then((list) => {
      list.once('value', (snapshot) => {
        ref.bindExamData(snapshot.val())
      })
    })
    this.loadSpinner(false)
  }
  // function to initialize notification form
  setNotificationForm() {
    this.notificationForm = this.formbuilder.group({
      notificationtitle: [''],
      notificationmessage: [''],
    })
  }
  get notificationform() {
    return this.notificationForm.controls
  }
  checkNotification(event) {
    if (event.target.checked === true) {
      this.notificationForm.controls.notificationtitle.setValidators([Validators.required]);
      this.msgtitle = true;
      this.checked = true;
    } else {
      this.msgtitle = false;
      this.checked = false;
    }
  }
  bindExamData(data) {
    // this.loadSpinner(true);
    this.isDataLoaded = true
    if (!data) {
      return
    }
    // this.loadSpinner(false);
    Object.entries(data).forEach(([datakey, datavalue]) => {
      this.examList.push({
        $key: datakey,
        // tslint:disable-next-line: no-string-literal
        categoryName: datavalue['categoryName'],
        // tslint:disable-next-line: no-string-literal
        examsInCategory: datavalue['examsInCategory'],
      })
    })
    this.examList.forEach((category, value) => {
      if (category.examsInCategory) {
        Object.entries(category.examsInCategory).forEach(
          ([examkey, examvalue]) => {
            this.ExamItems1.push({
              examkeys: examkey,
              examsInCategoryKey: examvalue['examsInCategoryKey'],
              examsId: examvalue['examsId'],
              categorykey: examvalue['metaData'].categoryKey,
              categoryName: examvalue['metaData'].categoryName,
              examDuration: examvalue['metaData'].examDuration,
              examInstruction: examvalue['metaData'].examInstruction,
              examName: examvalue['metaData'].examName,
              isPublished: examvalue['metaData'].isPublished,
              levelName: examvalue['metaData'].levelName,
              levelkey: examvalue['metaData'].levelkey,
              passMark: examvalue['metaData'].passMark,
              totalMark: examvalue['metaData'].totalMark,
              totalNoOfQuestions: examvalue['metaData'].totalNoOfQuestions,
              same_weightage: examvalue['metaData'].same_weightage,
              marks: examvalue['metaData'].marks,
              negativeMarks: examvalue['metaData'].negativeMarks,
              isPremium: examvalue['metaData'].isPremium,
              notificationMetaData: examvalue['metaData'],
            })
            this.AllExamList = this.ExamItems1
          }
        )
      }
      // console.log(this.AllExamList)
    })
    if (this.searchFilter.mainTopic.$key !== '') {
      this.changeCategory()
    } else {
      this.AllExamList = _.orderBy(
        this.ExamItems1,
        [(data) => data?.order],
        'asc'
      )
    }
  }
  addExam() {
    this.router.navigate(['/add-exam/manage'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      }
    })
  }
  resetFilter() {
    // reset the exam list
    this.searchExam = ''
    this.AllExamList = [];
    this.searchFilter.mainTopic = this.MainTopicList[0];
    this.searchFilter.mainTopic.$key = '';
    this.pageNo = 1;
    this.getMainTopicList();
    this.filterExamList();
    this.getAllExamList();
  }
  loadSpinner(isShow: boolean) {
    // function to load the page
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  onPageSortAsc() {
    // function to sort the data in ascending order
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.AllExamList, this.pageSort)
  }
  onPageSortDesc() {
    // function to sort the data in decending order
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.AllExamList, this.pageSort)
  }
  sortResult(source, sort) {
    // sort the list based on specific value
    this.AllExamList = _.orderBy(
      source,
      [(data) => data?.examName?.toLowerCase()],
      sort
    )
  }
  setexamLevelForm() {
    this.examLevelForm = this.formbuilder.group({
      levelName: [''],
      categoryName: [''],
    })
  }
  getAllExamLevel() {
    // function to get all exam levels
    this.examService.getAllExamLevel().subscribe((list) => {
      this.examLevelList = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      })
    })
  }
  changeLevel() {
    // function to filter data based on exam level
    const { levelName } = this.examLevelForm.value
    this.AllExamList = this.ExamItems1.filter(
      (item) => item.levelkey === levelName.$key
    )
  }

  onUpdateExam(examkeys, categorykey, examsId, isPremium) {
    // go to edit exam page
    this.router.navigate(['/edit-exam/edit'], {
      queryParams: {
        examkey: examkeys,
        categorykeys: categorykey,
        examsIds: examsId,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        isPremium: isPremium,
      },
    })
  }
  onDeleteExam(examkeys, categorykey, isPublished) {
    // function to show delete modal popup
    this.examkeys = examkeys
    this.categorykey = categorykey
    if (isPublished === false) {
      this.deleteMessage = APP_MESSAGE.DELETE.delete
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.EXAM.exam_cant_delete)
    }
  }
  deleteExam(examkeys, categorykey) {
    // function to delete exam baded on key
    this.examService.deleteExam(examkeys, categorykey).then(() => {
      this.ExamItems1 = []
      const index = this.AllExamList.findIndex((x) => x.examkeys === examkeys)
      this.AllExamList.splice(index, 1)
      this.toastr.show(APP_MESSAGE.DELETE.delete_data, false)
      $('#showDeleteDialog').modal('hide')
    })
  }
  onUpdateUnPublish(examkeys, categorykey) {
    // function to show modal for unpublish exam
    this.examkeys = examkeys;
    this.categorykey = categorykey;
    this.publishWarning = APP_MESSAGE.UNPUBLISH.unpublish;
    $('#modal-update-unpublish').modal('show')
  }
  // function to get all questions under a specific exam
  async getAllQuestionsBykey(examsId) {
    firebase
      .database()
      .ref('exams')
      .child(examsId)
      .on('value', (snapshot) => {
        this.data1 = snapshot.val()
        this.QstnList = []
        Object.entries(this.data1).forEach(([datakey, datavalue]) => {
          Object.entries(datavalue).forEach(([qstnkey1, qstnvalue]) => {
            Object.entries(qstnvalue).forEach(([qstnkeys, qstnvalue1]) => {
              this.QstnList.push(qstnvalue1)
              this.Qstnlength = this.QstnList.length
            })
          })
        })
      })
    return this.Qstnlength
  }
  // function to show modal for publish exam
  onUpdatePublish(examkeys, categorykey, examsId, totalNoOfQuestions, details) {
    this.type = 'EXAM';
    this.examkeys = examkeys;
    this.categorykey = categorykey;
    this.details = details;
    this.examsId = examsId;
    this.publishWarning = APP_MESSAGE.PUBLISH.publish
    this.getAllQuestionsBykey(examsId);

    setTimeout(() => {
      if (this.Qstnlength) {
        const examQstnLength = this.Qstnlength.toString()
        setTimeout(() => {
          // tslint:disable-next-line
          if (totalNoOfQuestions == examQstnLength) {
            $('#modal-update-publish').modal('show')
          } else {
            this.toastr.show(APP_MESSAGE.EXAM.exam_qstn)
          }
        }, 100)
      } else {
        this.toastr.show(APP_MESSAGE.EXAM.exam_qstn)
      }
    }, 600)
  }
  updatePublishItem(examkeys, categorykey, type, details) {
    this.submitted = true
    let notTitle = "";
    let notMessage = "";
    if(this.notificationForm.value.notificationtitle !== null){
      notTitle = this.notificationForm.value.notificationtitle.trim();
    }
    if(this.notificationForm.value.notificationmessage !== null){
      notMessage = this.notificationForm.value.notificationmessage.trim();
    }
    const notificationtitle = notTitle;
    const notificationmessage = notMessage;
    if ( this.msgtitle === true && (notificationtitle === '' || notificationmessage === '')) {
      this.toastr.show('Title and Message fields can not be empty, notification is not send',true)
      this.submitted = false
    } else if (this.msgtitle === true && (notificationtitle !== '' || notificationmessage !== '')) {
      const result = this.pushNotificationService.sendNotification(
        notificationtitle,
        notificationmessage,
        { key: this.examsId, type: type, details: details },
        ''
      )
      if (result) {
        this.submitted = false;
        this.toastr.show(APP_MESSAGE.NOTIFICATION.notification_send, false)
      }
      this.examService.updatePublishbyKey(examkeys, categorykey).then(() => {
        $('#modal-update-publish').modal('hide')
        this.toastr.show(APP_MESSAGE.EXAM.exam_published, false)
        this.checked = false;
        this.msgtitle = false;
        this.notificationForm.reset()
        this.AllExamList = []
        this.ExamItems1 = []
        this.examList = []
        this.getAllExamList()
      })
    } else {
      this.examService.updatePublishbyKey(examkeys, categorykey).then(() => {
        $('#modal-update-publish').modal('hide')
        this.toastr.show(APP_MESSAGE.EXAM.exam_published, false)
        this.AllExamList = []
        this.ExamItems1 = []
        this.examList = []
        this.getAllExamList()
      })
    }
  }
  updateunPublishItem(examkeys, categorykey) {
    this.examService.updateUnPublishbyKey(examkeys, categorykey).then(() => {
      this.toastr.show(APP_MESSAGE.EXAM.exam_unpublished, false)
      $('#modal-update-unpublish').modal('hide')
      this.AllExamList = []
      this.ExamItems1 = []
      this.examList = []
      this.getAllExamList()
    })
  }
  cancelPublish() {
    // cancel modal
    $('#modal-update-publish').modal('hide')
  }
  // redirect to question list page based on exam
  viewQuestion(
    examsId,
    examsInCategoryKey,
    categorykeys,
    totalNoOfQuestions,
    weightage
  ) {
    this.router.navigate(['/manage-exam/view-questions'], {
      queryParams: {
        examkey: examsId,
        examinCatkey: examsInCategoryKey,
        categorykey: categorykeys,
        qstncount: totalNoOfQuestions,
        weightage: weightage,
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage
      }
    })
  }
  viewExamResults(examId, examsInCategoryKey, categorykeys) {
    this.router.navigate(['/exam/results'], {
      queryParams: {
        examkey: examId,
        examinCatkey: examsInCategoryKey,
        categorykey: categorykeys,
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage
      },
    })
  }
  getMainTopicList() {
    this.loadSpinner(true)
    this.mainTopicService.getMainTopics().subscribe((list) => {
      this.loadSpinner(false)
      this.isDataLoaded = true
      const MainTopicList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.MainTopicList = _.orderBy(
        MainTopicList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
      if (this.searchFilter.mainTopic.$key === '') {
        this.MainTopicList.unshift({
          $key: '',
          categoryName: 'Select Main Topic',
        })
        this.searchFilter.mainTopic = this.MainTopicList[0]
      } else {
        this.changeCategory()
        this.MainTopicList.unshift({
          $key: this.searchFilter.mainTopic.$key,
          categoryName: this.searchFilter.mainTopic.categoryName,
        })
        this.searchFilter.mainTopic = this.MainTopicList[0]
      }
    })
  }
  filterExamList() {
    const maintopic = this.searchFilter.mainTopic
    this.AllExamList = this.ExamItems1.filter(
      (item) => item.categorykey === maintopic.$key
    )
    this.pageNo = 1
  }
  // function to filter subcategories based on categories
  changeCategory() {
    const categories = this.searchFilter.mainTopic
    if (categories.$key !== '') {
      this.AllExamList = this.ExamItems1.filter(
        (item) => item.categorykey === categories.$key
      )
      this.pageNo = 1
    }
  }
  onPageBoundsCorrection(number: number) {
    this.pageNo = number;
    this.toastr.show("Number exceeded page limit")
  }
  checkPageNumber(event){
    if(event.target.value && event.target.value < 1){
        this.pageNo = 1;
        this.toastr.show("Page number should not be less than 1");
    } else if(event.target.value === ""){
      this.pageNo = 1;
    } else {
      this.pageNo = event.target.value;
    }
  }
}
