import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ExamAppLayoutComponent } from '@app/shared'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import * as firebase from 'firebase'
import {
  ExamService,
  ToastMessageService,
  PracticeService,
  MainTopicService,
  ChapterService,
} from '@app/core'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'
@Component({
  selector: 'app-update-practice',
  templateUrl: './update-practice.component.html',
  styleUrls: ['./update-practice.component.scss'],
})
export class UpdatePracticeComponent implements OnInit {
  practicekey: any;
  practicesInSubCategorykey: any;
  subCategoryKey: any;
  addPracticeForm: FormGroup;
  categoryList: any[] = [];
  categoryList1: any[] = [];
  submitted: boolean;
  passmark: boolean;
  catname: any;
  subCategoryList = [];
  subCategories: any;
  MainTopicItems1: any[] = [];
  MainTopicList: any[];
  practiceKey: any;
  updatePracticeForm: FormGroup;
  categoryName: any;
  subCategoryName: any;
  categoryKey: any;
  practiceName: any;
  totalNoOfQuestions: any;
  isPublished: any;
  practicesInSubCategoryKey: any;
  practiceId: any;
  categoryKeys: any;
  categoryNames: any;
  practicesInChapterkey: any
  practicesInChapterKey: any
  chapterkeys: any
  chapterkey: any
  categoryItems: any[] = [];
  subcatname: any[];
  chapterItems: any[] = [];
  chapterName: any;
  subTopicList: any[];
  subCategoryItems: any[] = [];
  subCategoryKeys: any;
  chapterData: any[] = [];
  chapterList: any[];
  questionList: any[];
  spaceValidate: boolean;
  isPremium: boolean;
  pageNo: number;
  itemsPerPage: number;
  negativeValidation: boolean;
  validateQuestionMark: boolean;
  validateQuestionMarkMsg: string;
  marks: string;
  negativeMarks: string;
  weightage: boolean;
  constructor(
    public activatedRoute: ActivatedRoute,
    public practiceService: PracticeService,
    public formbuilder: FormBuilder,
    public toastr: ToastMessageService,
    private router: Router,
    public mainTopicService: MainTopicService,
    public chapterService: ChapterService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.practicekey = params.practicekey
      this.practicesInChapterkey = params.practicesInChapterKey;
      this.chapterkeys = params.chapterkey;
      this.categoryKeys = params.categoryKey;
      this.subCategoryKeys = params.subCategoryKey;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      if(params.isPremium === 'true'){
        this.isPremium = true;
      } else {
        this.isPremium = false;
      }
    })
    this.setPracticeForm()
  }
  ngOnInit(): void {
    this.allPracticeDetails()
    this.getSubTopicList()
    this.getAllCategories()
    this.getAllChapters()
  }
  setPracticeForm() {
    this.updatePracticeForm = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
      practiceName: [''],
      totalNoOfQuestions: [''],
      chapterName: [''],
      w_yes: [''],
      marks: [''],
      negativeMarks: [''],
      ispremium: ['']
    })
  }
  get practiceform() {
    return this.updatePracticeForm.controls
  }
  gotoList() {
    this.router.navigate(['/practice'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      },
    })
  }
  // function to get all categories
  getAllCategories() {
    this.practiceService.getAllPublishedCategories().subscribe((list) => {
      const categoryList = list.map((item) => {
        const itemList1 = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList1
      });
      this.categoryList = _.orderBy(
        categoryList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
    });
  }
  // function to get all subtopics
  getSubTopicList() {
    this.mainTopicService.getMainTopics().subscribe((list) => {
      this.subTopicList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.MainTopicItems1 = []
      this.subCategoryList = []
      this.subTopicList.forEach((category) => {
        this.subCategories = category.subCategories
        if (this.subCategories) {
          this.subCategoryList.push(this.subCategories)
        }

        if (!this.subCategories) {
        } else {
          Object.entries(category.subCategories).forEach(
            ([subcatkey, value]) => {
              this.MainTopicItems1.push({
                parentkey: category.parentKey,
                subcatKey: subcatkey,
                categorykey: category.$key,
                category: category.categoryName,
                // tslint:disable-next-line: no-string-literal
                subCategory: value['subCategoryName'],
                $key: subcatkey,
              })
              this.changeCategorys()
            }
          )
        }
      })
    })
  }
  // function to get all chapters
  getAllChapters() {
    this.chapterService.getAllChaptersInSubCategory().subscribe((list) => {
      this.chapterList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.chapterList.forEach((chapter) => {
        this.chapterData.push({
          chapterName: chapter.chapterName,
          chapterkey: chapter.$key,
          subCategory: chapter.subCategoryName,
          subcatKey: chapter.subCategorykey,
          $key: chapter.$key,
        })
        this.changeSubCategorys()
      })
    })
  }
  // function to filter subcategories based on categories
  changeCategory() {
    const category = this.updatePracticeForm.value.categoryName
    this.subCategoryItems = this.MainTopicItems1.filter(
      (item) => item.categorykey === category.$key
    )
  }
  changeCategorys() {
    const category = this.categoryKeys
    this.subCategoryItems = this.MainTopicItems1.filter(
      (item) => item.categorykey === category
    )
  }
  // function to filter chapters based on subCategories
  changeSubCategory() {
    const subCategoryName = this.updatePracticeForm.value.subCategoryName
      .subcatKey;
    this.chapterItems = this.chapterData.filter(
      (item) => item.subcatKey === subCategoryName
    )
  }
  changeSubCategorys() {
    const subCategoryKeys = this.subCategoryKeys
    this.chapterItems = this.chapterData.filter(
      (item) => item.subcatKey === subCategoryKeys
    )
  }
  validateWhiteSpace() {
    const videoID = this.updatePracticeForm.value.practiceName
    if (videoID != undefined || videoID != '') {
      const regExp = /^.*(\s|\S)*(\S)+(\s|\S).*/
      const match = videoID.match(regExp)
      if (match) {
        // Do anything for being valid
        // if need to change the url to embed url then use below line
        this.spaceValidate = false
      } else {
        this.spaceValidate = true
        // Do anything for not being valid
      }
    }
  }

  // function to get practice details
  allPracticeDetails() {
    const data = this.practiceService.getallExams(
      this.chapterkeys,
      this.practicesInChapterkey
    )
    this.practiceName = data.practiceName
    this.totalNoOfQuestions = data.totalNoOfQuestions
    this.isPublished = data.isPublished
    this.totalNoOfQuestions = data.totalNoOfQuestions
    this.practicesInChapterKey = data.practicesInChapterkey
    this.practiceId = data.practiceId
    this.marks = "";
    this.negativeMarks = "";
    if(data.same_weightage){
      this.weightage = data.same_weightage;
      this.marks = data.marks
      this.negativeMarks = data.negativeMarks
    } 
    this.categoryName = {
      $key: data.categorykey,
      categoryName: data.categoryName,
    }
    this.subCategoryName = {
      $key: data.subCategoryKey,
      subCategory: data.subCategoryName,
    }

    this.chapterName = {
      $key: data.chapterkey,
      chapterName: data.chapterName,
    }
    const ref = this
    this.practiceService
      .getQuestionsByPractice(this.practicekey)
      .then((data) => {
        data.on('value', (snapshot) => {
          const { data: { questions = {} } = {} } = snapshot.val()
          ref.questionList = questions
        })
      })
  }

  validateExamQuestions(): boolean {
    if (this.questionList) {
      const questionKeys = Object.keys(this.questionList)
      const questionCount = questionKeys.length
      if (
        this.updatePracticeForm.value.totalNoOfQuestions < questionCount &&
        questionCount !== 0
      ) {
        this.toastr.show(
          'Total number of questions must not be less than existing number of questions',
          true
        )
        return false
      }
    }
    return true
  }

  // function to update practice
  updatePractice() {
    this.submitted = true
    if (this.validateExamQuestions()) {
      const params = {
        metaData: {
          categoryName: this.updatePracticeForm.value.categoryName.categoryName,
          categorykey: this.updatePracticeForm.value.categoryName.$key,
          subCategoryName: this.updatePracticeForm.value.subCategoryName.subCategory,
          practiceName: this.updatePracticeForm.value.practiceName,
          totalNoOfQuestions: this.updatePracticeForm.value.totalNoOfQuestions,
          isPublished: false,
          subCategoryKey: this.updatePracticeForm.value.subCategoryName.$key,
          chapterkey: this.updatePracticeForm.value.chapterName.$key,
          chapterName: this.updatePracticeForm.value.chapterName.chapterName,
          same_weightage: this.weightage,
          marks: this.updatePracticeForm.value.marks,
          negativeMarks: this.updatePracticeForm.value.negativeMarks,
          isPremium: this.isPremium
        },
        practiceId: this.practicekey,
      }
      const removeData = this.practiceService.removePractice(
        this.practicesInChapterkey,
        this.chapterkeys
      )
      this.practiceService.updateMarksInExamQuestions(this.practicekey,this.marks,this.negativeMarks)
      if (removeData === 'deleted') {
        this.practiceService.updatePractices(params.metaData.chapterkey, params)
        this.toastr.show(APP_MESSAGE.PRACTICE.practice_update, false)
        this.submitted = false
        this.router.navigate(['/practice'],{
          queryParams:{
            pageNo: this.pageNo, 
            itemsPerPage: this.itemsPerPage
          }
        })
      }
    }
  }
  // function to compare two values
  checkDatas(option, value) {
    return option.categoryName === value.categoryName
  }
  checkSubCatname(option, value) {
    return option.subCategory === value.subCategory
  }
  checkChapterName(option, value) {
    return option.chapterName === value.chapterName
  }
  isPremiumEvent(event){
    if(event.target.checked === true){
      this.isPremium = true
    }else{
      this.isPremium = false
    }
  }
  // function to show Marks field if weigtage is same for all questions
  addexamLink(event) {
    /* tslint:disable */
    if (event.target.checked === true) {
      this.practiceform['marks'].setValidators([Validators.required]);
      this.practiceform['negativeMarks'].setValidators([Validators.required]);
      this.weightage = true
    } else {
      this.marks = "";
      this.negativeMarks = "";
      this.practiceform['marks'].clearValidators();
      this.practiceform['marks'].updateValueAndValidity();
      this.practiceform['negativeMarks'].clearValidators();
      this.practiceform['negativeMarks'].updateValueAndValidity();
      this.weightage = false
    }
  }
  checkTotalMark() {
    if (this.updatePracticeForm.value.marks > this.updatePracticeForm.value.totalMark) {
      this.validateQuestionMark = true;
      this.validateQuestionMarkMsg =
        'Entered mark should not be greater than total mark';
      this.submitted = true;
    } else {
      const marksQuestions = (this.updatePracticeForm.value.totalNoOfQuestions * this.updatePracticeForm.value.marks)
        
      if (marksQuestions != this.updatePracticeForm.value.totalMark) {
        this.validateQuestionMark = true
        this.validateQuestionMarkMsg =
          'Number of questions multiplied by Mark should be equal to Total Mark'
        this.submitted = true
      } else {
        this.validateQuestionMark = false
      }
    }
  }
  
  checkNegativeMark() {
    if (
      (Number(this.updatePracticeForm.value.negativeMarks) >
      Number(this.updatePracticeForm.value.marks)) ||
      (Number(this.updatePracticeForm.value.negativeMarks) < 0)
    ) { 
      this.negativeValidation = true
      this.submitted = true
    } else {
      this.negativeValidation = false
    }
  }
  Back() {
    this.router.navigate(['/exam'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      },
    })
  }
  allowNumberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true
  }
}
