import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { ExamService, ToastMessageService, ExamModel } from '@app/core'
import { Router, ActivatedRoute } from '@angular/router'
import * as firebase from 'firebase'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.scss'],
})
export class AddExamComponent implements OnInit {
  addExamForm: FormGroup;
  categoryList: any[] = [];
  examLevelList: any[] = [];
  categoryList1: any[] = [];
  submitted: boolean;
  passmark: boolean;
  examKey: any;
  weightage: boolean = false;
  validateQuestionMark: boolean;
  validateQuestionMarkMsg: string;
  negativeValidation: boolean;
  isPremium = false;
  pageNo: number;
  itemsPerPage: number;
  constructor(
    public examService: ExamService,
    public formbuilder: FormBuilder,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastMessageService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage
    })
    this.passmark = false;
    this.setExamForm();
  }

  ngOnInit() {
    this.getAllCategories();
    this.getAllExamLevel();
  }

  setExamForm() {
    //
    this.addExamForm = this.formbuilder.group({
      categoryName: [''],
      levelName: [''],
      examName: [''],
      examDuration: [''],
      totalMark: [''],
      passMark: [''],
      totalNoOfQuestions: [''],
      examInstruction: [''],
      w_yes: [''],
      marks: [''],
      negativeMarks: [''],
      ispremium:['']
    })
  }

  allowNumberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false
    }
    return true
  }

  getAllCategories() {
    // get all published categories
    this.examService.getAllPublishedCategories().then((list) => {
      list.on('value', (snapshot) => {
        const data = snapshot.val()
        
        if (data) {
          Object.entries(data).forEach(([datakey, datavalue]) => {
            this.categoryList.push({
              $key: datakey,
              // tslint:disable-next-line: no-string-literal
              categoryName: datavalue['categoryName'],
            })
          })
          this.categoryList = _.orderBy(
            this.categoryList,
            [(data) => data.categoryName?.toLowerCase()],
            'asc'
          );
        }
      })
    })
  }

  getAllExamLevel() {
    // get all exam levels
    this.examService.getAllExamLevel().subscribe((list) => {
      const examLevelList = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      });
      this.examLevelList = _.orderBy(
        examLevelList,
        [(data) => data.levelName?.toLowerCase()],
        'asc'
      );
    })
  }

  get examform() {
    return this.addExamForm.controls
  }

  checkPassmark() {
    // funtion to check passmark greater than total mark
    if (Number(this.addExamForm.value.passMark) > Number(this.addExamForm.value.totalMark)) {
      this.passmark = true
    } else {
      this.passmark = false
    }
  }
  addExam() {
    // function to add exam under category
    const { valid, invalid } = this.addExamForm
    this.submitted = true;
    const createdAt = new Date().getTime()
    const objExam: ExamModel = {
      $key: '',
      createdAt,
    }
    const objResult = this.examService.manageExam(objExam)
    if (objResult) {
      this.examKey = objResult.key
    }
    if (valid && this.passmark === false) {
      const params = {
        metaData: {
          categoryName: this.addExamForm.value.categoryName.categoryName,
          categoryKey: this.addExamForm.value.categoryName.$key,
          levelName: this.addExamForm.value.levelName.levelName,
          levelkey: this.addExamForm.value.levelName.$key,
          examName: this.addExamForm.value.examName,
          examDuration: this.addExamForm.value.examDuration,
          totalMark: this.addExamForm.value.totalMark,
          passMark: this.addExamForm.value.passMark,
          totalNoOfQuestions: this.addExamForm.value.totalNoOfQuestions,
          examInstruction: this.addExamForm.value.examInstruction,
          same_weightage: this.weightage,
          marks: this.addExamForm.value.marks,
          negativeMarks: this.addExamForm.value.negativeMarks,
          isPublished: false,
          createdDate: createdAt,
          isPremium: this.isPremium
        },

        examsId: this.examKey,
      }
      const objResultExam = this.examService.addExamInCategory(
        this.addExamForm.value.categoryName.$key,
        params
      )
      this.toastr.show(APP_MESSAGE.EXAM.exam_create, false)
      const examCategoryKey = objResultExam
      this.router.navigate(['/add-exam/manage-exam'], {
        queryParams: {
          categorykey: params.metaData.categoryKey,
          examkey: this.examKey,
          examcategoryKey: examCategoryKey,
          weightage: this.weightage,
          pageNo: this.pageNo, 
          itemsPerPage: this.itemsPerPage
        }
      });
    }
  }
  // function to show Marks field if weigtage is same for all questions
  addexamLink(event) {
    /* tslint:disable */
    if (event.target.checked === true) {
      this.examform['marks'].setValidators([Validators.required]);
      this.examform['negativeMarks'].setValidators([Validators.required]);
      this.weightage = true
    } else {
      this.examform['marks'].clearValidators();
      this.examform['marks'].updateValueAndValidity();
      this.examform['negativeMarks'].clearValidators();
      this.examform['negativeMarks'].updateValueAndValidity();
      this.weightage = false
    }
  }
  checkTotalMark() {
    const marksQuestions = this.examform.totalNoOfQuestions.value * this.examform.marks.value;
    if (this.examform.marks.value > this.examform.totalMark.value) {
      this.validateQuestionMark = true
      this.validateQuestionMarkMsg = 'Entered mark should not be greater than total mark';
      this.submitted = true
    } else if (marksQuestions !== this.examform.totalMark.value) {
      this.validateQuestionMark = true
      this.validateQuestionMarkMsg = 'Number of questions multiplied by Mark should be equal to Total Mark';
      this.submitted = true
    } else {
      this.validateQuestionMark = false
    }
  }
  checkNegativeMark() {
    if (Number(this.examform.negativeMarks.value) > Number(this.examform.marks.value)) {
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
  gotoList() {
    this.router.navigate(['/exam'], {
      queryParams: {
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage
      }
    });
  }
}
