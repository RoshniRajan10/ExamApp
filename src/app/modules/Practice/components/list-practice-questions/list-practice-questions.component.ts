import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  ExamService,
  ToastMessageService,
  PracticeService,
  CommonDeletePublishModal,
} from '@app/core'
import { APP_MESSAGE } from '@app/core/config'
import { SECTIONS } from '@app/core/utils'
import * as firebase from 'firebase'
declare var $: any
import { NgxSpinnerService } from 'ngx-spinner'
import * as _ from 'lodash'
@Component({
  selector: 'app-list-practice-questions',
  templateUrl: './list-practice-questions.component.html',
  styleUrls: ['./list-practice-questions.component.scss'],
})
export class ListPracticeQuestionsComponent implements OnInit {
  deleteMessage = APP_MESSAGE.DELETE.delete;
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
  subCategoryKeys: any;
  practiceKey: any;
  practiceInSubcategoryKey: any;
  subCategoryKey: any;
  practiceNames: any;
  categoryNames: any;
  subCategoryNames: any;
  totalNoOfQuestion: any;
  practiceKeys: any;
  isDataLoaded = false;
  chapterkeys: any;
  practiceInChapterKey: any
  deleteItem: any;
  canAdQuestion = false;
  weightage: any;
  //for pagination
  pageNo: number;
  itemsPerPage: number;
  qstnPageNo: number = 1;
  pageNoBind: number;
  pageMaxSize: number = 10;
  qstitemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end  
  pageSort = 'asc';
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  constructor(
    public activatedRoute: ActivatedRoute,
    public examService: ExamService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public practiceService: PracticeService,
    public toastr: ToastMessageService,
  ) {

    this.activatedRoute.queryParams.subscribe((params) => {
      this.practiceKey = params.practicekeys;
      this.practiceInChapterKey = params.practiceInChapterKeys;
      this.chapterkeys = params.chapterkey;
      this.weightage = params.weightage;
      this.qstnPageNo = params.qstnPageNo;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      this.qstitemsPerPage = params.qstitemsPerPage ? parseInt(params.qstitemsPerPage) : 10;
    })
  }
  ngOnInit() {
    this.getPracticeDetails();
    this.getAllQuestions();
  }
  // function to get all questions
  getAllQuestions() {
    this.spinner.show();
    this.isDataLoaded = true
    this.practiceService.getAllQuestionsBykey(this.practiceKey)
    .then((snapshot)=>{
      this.spinner.hide();
      const { data: questions } = snapshot.val();
      if(questions.questions) {
        this.QuestionList = Object.entries(questions.questions).map(([qstnkeys, qstnvalue1])=>{
          this.option = "N/A";
          if(qstnvalue1['options']){
            qstnvalue1['options'].forEach((element) => {
              if (element.rightAnswer === true) {
                this.option = element.option
              }
            })
          }
          return {
            practiceKeys: this.practiceKey,
            qstnkey: qstnkeys,
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
          }
        });
      }
      this.Qstnlength = this.QuestionList.length;
      this.canAdQuestion = this.QuestionList.length < this.totalNoOfQuestion
    });
  }

  // function to get practice details
  getPracticeDetails() {
    this.practiceService.getPracticeDetail(
      this.chapterkeys,
      this.practiceKey,
      this.practiceInChapterKey
    ).on('value', (snapshot) => {
      const objPracticeres = snapshot.val();
      this.practiceNames = objPracticeres.practiceName;
      this.categoryNames = objPracticeres.categoryName;
      this.subCategoryNames = objPracticeres.subCategoryName;
      this.totalNoOfQuestion = objPracticeres.totalNoOfQuestions;
      this.isPublished = objPracticeres.isPublished;
      this.weightage = objPracticeres.same_weightage;
      if (this.isPublished === true) {
        this.PublishedStatus = 'Yes'
      } else {
        if (this.isPublished === false) {
          this.PublishedStatus = 'No'
        }
      }
    })
  }
  // redirect to add questions
  addQuestions(practiceKey, practiceInChapterKey, chapterkey) {
    this.router.navigate(['/add-questions/Add'], {
      queryParams: {
        practiceKeys: practiceKey,
        chapterkeys: chapterkey,
        practiceInChapterKeys: practiceInChapterKey,
        weightage: this.weightage,
        qstnPageNo: this.qstnPageNo,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        qstitemsPerPage: this.qstitemsPerPage
      },
    })
  }
  // function to show modal for delete
  onDeleteQuestion(practiceKey, qstnkey) {
    this.practiceKeys = practiceKey
    this.qstnkey = qstnkey
    $('#showDeleteDialog').modal('show')
  }
  deletePracticeQuestion(practicekey, qstnkey) {
    this.practiceService.deleteQuestion(practicekey, qstnkey).then(()=>{
      this.toastr.show(APP_MESSAGE.DELETE.delete_data, false);
      $('#showDeleteDialog').modal('hide');
      this.QuestionList = [];
      this.getAllQuestions();
    })
  }

  // redirect to edit question page
  onUpdateQuestion(practiceKeys, qstnkey) {
    this.router.navigate(['/update-questions/update'], {
      queryParams: {
        /* tslint:disable */
        practiceKey: practiceKeys,
        qstnkey: qstnkey,
        practiceInChapterkey: this.practiceInChapterKey,
        chapterkey: this.chapterkeys,
        weightage: this.weightage,
        qstnPageNo: this.qstnPageNo,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        qstitemsPerPage: this.qstitemsPerPage
      },
    })
  }
  Back() {
    this.router.navigate(['/practice'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      },
    })
  }
  // for pagination
  onPageBoundsCorrection(number: number) {
    this.qstnPageNo = number;
    this.toastr.show("Number exceeded page limit")
  }
  checkPageNumber(event){
    if(event.target.value && event.target.value < 1){
        this.qstnPageNo = 1;
        this.toastr.show("Page number should not be less than 1");
    } else if(event.target.value === ""){
      this.qstnPageNo = 1;
    } else {
      this.qstnPageNo = event.target.value;
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
