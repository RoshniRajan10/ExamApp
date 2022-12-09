import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  CommonDeletePublishModal,
  ExamService,
  ToastMessageService,
} from '@app/core'
import { APP_MESSAGE } from '@app/core/config'
import { SECTIONS } from '@app/core/utils'
import * as firebase from 'firebase'
declare var $: any
import { NgxSpinnerService } from 'ngx-spinner'
import * as _ from 'lodash'
@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.scss'],
})
export class ListQuestionsComponent implements OnInit {
  examkey: any;
  examinCatkey: any;
  categorykey: any;
  data: any;
  QuestionList: any[] = [];
  examkeys: any;
  qstnkey: any;
  option: any;
  rightAnswer: any;
  public data1: any;
  qstnCount: any;
  Qstnlength: number = 0;
  examNames: any;
  totalNoOfQuestions: any;
  totalMark: any;
  categoryName: any;
  levelName: any;
  isPublished: any;
  PublishedStatus: string;
  isDataLoaded = false;
  //for pagination
  searchParentTopic;
  pageNo: number;
  itemsPerPage: number;
  qstPageNo: number = 1;
  pageNoBind: number;
  pageMaxSize: number = 10;
  qstitemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  deleteItem: any;
  weightage: boolean;
  deleteMessage: string;  
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  pageSort = 'asc';
  constructor(
    public activatedRoute: ActivatedRoute,
    public examService: ExamService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public toastr: ToastMessageService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.examkey = params.examkey;
      this.examinCatkey = params.examinCatkey;
      this.categorykey = params.categorykey;
      this.qstnCount = params.qstncount;
      this.weightage = params.weightage;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      this.qstPageNo = params.qstPageNo ? params.qstPageNo : 1;
      this.qstitemsPerPage = params.qstitemsPerPage ? parseInt(params.qstitemsPerPage) : 10;
    });
  }
  ngOnInit() {
    this.getExamDetails();
  }

  getAllQuestionsBykey() {
    // function to get all questions based on a particular examkey
    return firebase
      .database()
      .ref('exams')
      .child(this.examkey)
      .child('data')
      .child('questions')
      .once('value')
  }

  getAllQuestions() {
    // this.getExamDetails()
    this.isDataLoaded = true
    // const data = this.examService.getAllQuestionsBykey(this.examkey)
    this.getAllQuestionsBykey().then((snapShot)=>{
      const qstnvalue = snapShot.val();
      Object.entries(qstnvalue).forEach(([qstnkeys, qstnvalue1]) => {
        // tslint:disable-next-line: no-string-literal
        this.option = "N/A";
        if(qstnvalue1['options']){
          qstnvalue1['options'].forEach((element) => {
            if (element.rightAnswer === true) {
              this.option = element.option
            }
          })
        }
        let qstionTag = qstnvalue1['qstnTags']?qstnvalue1['qstnTags'].toString():"";
        let subqstnTags = qstnvalue1['subqstnTags']?qstnvalue1['subqstnTags'].toString():"";
        this.QuestionList.push({
          examkeys: this.examkey,
          qstnkey: qstnkeys,
          /* tslint:disable */
          difficulty: qstnvalue1['difficulty'],
          hint: qstnvalue1['hint'],
          marks: qstnvalue1['marks'],
          negativeMarks: qstnvalue1['negativeMarks'],
          question: qstnvalue1['question'],
          solutions: qstnvalue1['solutions'],
          bestSolutions: qstnvalue1['bestSolutions'],
          options: qstnvalue1['options'],
          noOfOptions: qstnvalue1['noOfOptions'],
          rightAnswer: this.option,
          qstnTags: qstionTag,
          subqstnTags: subqstnTags
        })
        this.Qstnlength = this.QuestionList.length
      })
    })
  }
  getExamDetails() {
    this.spinner.show()
    this.examService.getExamDetails1(
      this.categorykey,
      this.examkey,
      this.examinCatkey
    ).then((result)=>{
      this.spinner.hide()
      const objExamres = result.val();
      this.examNames = objExamres.examName
      this.totalMark = objExamres.totalMark
      this.totalNoOfQuestions = objExamres.totalNoOfQuestions
      this.categoryName = objExamres.categoryName
      this.levelName = objExamres.levelName
      this.isPublished = objExamres.isPublished
      if (this.isPublished === true) {
        this.PublishedStatus = 'Yes'
      } else {
        if (this.isPublished === false) {
          this.PublishedStatus = 'No'
        }
      }
    }).then(()=>{
      this.getAllQuestions()
    })
  }
  addQuestions(examkey, examinCatkey, categorykey) {
    // redirect to add-question component
    this.router.navigate(['/add-exam/manage-exam'], {
      /* tslint:disable */
      queryParams: {
        examkey: examkey,
        categorykey: categorykey,
        examcategoryKey: examinCatkey,
        weightage: this.weightage,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        qstPageNo: this.qstPageNo,
        qstitemsPerPage: this.qstitemsPerPage
      },
    })
  }
  onDeleteQuestion(examkeys, qstnkey) {
    // function to show delete modal popup
    this.examkeys = examkeys
    this.qstnkey = qstnkey
    this.deleteMessage = APP_MESSAGE.DELETE.delete
    $('#showDeleteDialog').modal('show')
  }
  deleteExamQuestion(examkeys, qstnkey) {
    this.examService.deleteQuestion(examkeys, qstnkey).then(()=>{
      this.examService.updateUnPublishbyKey(this.examinCatkey, this.categorykey)
      this.QuestionList = [];
      this.getAllQuestions();
      this.toastr.show(APP_MESSAGE.DELETE.delete_data, false);
      $('#showDeleteDialog').modal('hide');
    })
  }
  onUpdateQuestion(examkey, qstnkey) {
    // redirect to update question component for update questions
    this.router.navigate(['/update-question/update'], {
      queryParams: {
        /* tslint:disable */
        examkey: examkey,
        qstnkey: qstnkey,
        examcategoryKey: this.examinCatkey,
        categorykey: this.categorykey,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        qstPageNo: this.qstPageNo,
        qstitemsPerPage: this.qstitemsPerPage,
        weightage: this.weightage
      },
    })
  }
  Back() {
    this.router.navigate(['/exam'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      },
    })
  }

  // for pagination
  onPageBoundsCorrection(number: number) {
    this.qstPageNo = number;
    this.toastr.show("Number exceeded page limit")
  }
  checkPageNumber(event){
    if(event.target.value && event.target.value < 1){
        this.qstPageNo = 1;
        this.toastr.show("Page number should not be less than 1");
    } else if(event.target.value === ""){
      this.qstPageNo = 1;
    } else {
      this.qstPageNo = event.target.value;
    }
  }
  onPageSortAsc() {
    // function to sort the data in ascending order
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.QuestionList, this.pageSort)
  }
  onPageSortDesc() {
    // function to sort the data in decending order
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.QuestionList, this.pageSort)
  }
  sortResult(source, sort) {
    // sort the list based on specific value
    this.QuestionList = _.orderBy(
      source,
      [(data) => data?.question?.toLowerCase()],
      sort
    )
  }
}
