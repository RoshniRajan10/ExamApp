import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import {
  ExamService,
  ToastMessageService,
  PracticeModel,
  MainTopicService,
  PracticeService,
  ChapterService,
} from '@app/core'
import { Router, ActivatedRoute } from '@angular/router'
import * as firebase from 'firebase'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'

@Component({
  selector: 'app-add-practice',
  templateUrl: './add-practice.component.html',
  styleUrls: ['./add-practice.component.scss'],
})
export class AddPracticeComponent implements OnInit {
  addPracticeForm: FormGroup
  categoryList: any[] = []
  categoryList1: any[] = []
  submitted: boolean
  passmark: boolean
  catname: any
  subCategoryList = []
  subCategories: any
  MainTopicItems1: any[] = []
  subTopicList: any[]
  chapterItems: any[] = []
  practiceKey: any
  subcatname: any[]
  chapterList: any
  spaceValidate: boolean
  isPremium = false;
  validateQuestionMark: boolean
  validateQuestionMarkMsg: string
  negativeValidation: boolean
  weightage: boolean = false;
  pageNo: number;
  itemsPerPage: number;
  constructor(
    public practiceService: PracticeService,
    public formbuilder: FormBuilder,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastMessageService,
    public mainTopicService: MainTopicService,
    public chapterService: ChapterService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
    })
    this.setPracticeForm()
  }

  ngOnInit(): void {
    this.getAllCategories()
    this.getSubTopicList()
    this.getAllChapters()
  }

  setPracticeForm() {
    // function to initialize practice form
    this.addPracticeForm = this.formbuilder.group({
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
  getAllCategories() {
    // function to get all categories
    this.practiceService.getAllPublishedCategories().subscribe((list) => {
      const categoryList = list.map((item) => {
        const itemList1 = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList1
      })
      this.categoryList = _.orderBy(
        categoryList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
    })
  }

  gotoList() {
    this.router.navigate(['/practice'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      },
    })
  }

  getSubTopicList() {
    // function to get sub categories
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
                /* tslint:disable */
                subCategory: value['subCategoryName'],
              })
            }
          )
        }
      })
    })
  }

  getAllChapters() {
    this.chapterService.getAllChaptersInSubCategory().subscribe((list) => {
      this.chapterList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.chapterList.forEach((chapter) => {
        this.chapterItems.push({
          chapterName: chapter.chapterName,
          chapterkey: chapter.$key,
          subCategoryName: chapter.subCategoryName,
          subCategorykey: chapter.subCategorykey,
        })
      })
    })
  }

  changeCategory() {
    const category = this.addPracticeForm.value.categoryName
    this.catname = this.MainTopicItems1.filter(
      (item) => item.categorykey === category.$key
    )

  }
  changeSubCategory() {
    const subCategoryName = this.addPracticeForm.value.subCategoryName
      .subcatKey
    this.subcatname = this.chapterItems.filter(
      (item) => item.subCategorykey === subCategoryName
    )
  }
  get practiceform() {
    return this.addPracticeForm.controls
  }
  validateWhiteSpace() {
    const videoID = this.addPracticeForm.value.practiceName
    if (videoID != undefined || videoID != '') {
      var regExp = /^.*(\s|\S)*(\S)+(\s|\S).*/
      var match = videoID.match(regExp)
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
  addPractice() {
    // function to save practice
    const { valid, invalid } = this.addPracticeForm
    this.submitted = true
    const createdAt = new Date().getTime()
    const objPractice: PracticeModel = {
      $key: '',
      createdAt,
    }
    const objResult = this.practiceService.managePractice(objPractice)
    if (objResult) {
      this.practiceKey = objResult.key
    }
    if (valid) {
      const params = {
        metaData: {
          categoryName: this.addPracticeForm.value.categoryName.categoryName,
          categorykey: this.addPracticeForm.value.categoryName.$key,
          subCategoryName: this.addPracticeForm.value.subCategoryName.subCategory,
          subCategoryKey: this.addPracticeForm.value.subCategoryName.subcatKey,
          practiceName: this.addPracticeForm.value.practiceName,
          totalNoOfQuestions: this.addPracticeForm.value.totalNoOfQuestions,
          chapterName: this.addPracticeForm.value.chapterName.chapterName,
          chapterkey: this.addPracticeForm.value.chapterName.chapterkey,
          same_weightage: this.weightage,
          marks: this.addPracticeForm.value.marks,
          negativeMarks: this.addPracticeForm.value.negativeMarks,
          isPublished: false,
          createdDate: createdAt,
          isPremium: this.isPremium
        },
        practiceId: this.practiceKey,
      }

      const objResultPractice = this.practiceService.addPracticeInSubCategory(
        this.addPracticeForm.value.subCategoryName.subcatKey,
        params.metaData.chapterkey,
        params
      )
      const practiceInChapterKey = objResultPractice
      this.router.navigate(['/add-questions/Add'], {
        queryParams: {
          chapterkeys: params.metaData.chapterkey,
          practiceKeys: this.practiceKey,
          practiceInChapterKeys: practiceInChapterKey,
          weightage: this.weightage,
          isPremium: this.isPremium,
          pageNo: this.pageNo, 
          itemsPerPage: this.itemsPerPage
        },
      })
    }
  }
  // function to show Marks field if weigtage is same for all questions
  addexamLink(event) {
    /* tslint:disable */
    if (event.target.checked === true) {
      this.practiceform['marks'].setValidators([Validators.required]);
      this.practiceform['negativeMarks'].setValidators([Validators.required]);
      this.weightage = true;
    } else {
      this.practiceform['marks'].clearValidators();
      this.practiceform['marks'].updateValueAndValidity();
      this.practiceform['negativeMarks'].clearValidators();
      this.practiceform['negativeMarks'].updateValueAndValidity();
      this.weightage = false;
    }
  }
  checkTotalMark() {
    if (this.practiceform.marks.value > this.practiceform.totalMark.value) {
      this.validateQuestionMark = true;
      this.validateQuestionMarkMsg =
        'Entered mark should not be greater than total mark';
      this.submitted = true;
    } else {
      const marksQuestions = (this.practiceform.totalNoOfQuestions.value * this.practiceform.marks.value)
        
      if (marksQuestions != this.practiceform.totalMark.value) {
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
      (Number(this.practiceform.negativeMarks.value) >
      Number(this.practiceform.marks.value)) ||
      (Number(this.practiceform.negativeMarks.value) < 0)
    ) {
      this.negativeValidation = true
      this.submitted = true
    } else {
      this.negativeValidation = false
    }
  }
  isPremiumEvent(event){
    if(event.target.checked === true){
      this.isPremium = true
    }else{
      this.isPremium = false
    }
  }
  allowNumberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true
  }
}
