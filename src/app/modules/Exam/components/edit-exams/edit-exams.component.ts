import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ExamAppLayoutComponent } from '@app/shared'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { ExamService, ToastMessageService } from '@app/core'
import { concatAll } from 'rxjs/operators'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'
@Component({
  selector: 'app-edit-exams',
  templateUrl: './edit-exams.component.html',
  styleUrls: ['./edit-exams.component.scss'],
})
export class EditExamsComponent implements OnInit {
  pageNo: any;
  examkey: any;
  categorykey: any;
  categoryName: any;
  examName: any;
  passMark: any;
  levelName: any;
  totalMark: any;
  totalNoOfQuestions: any;
  examDuration: any;
  examInstruction: any;
  same_weightage: any;
  marks: any;
  negativeMarks: any;
  updateExamForm: FormGroup;
  submitted: boolean;
  categoryList: any[] = [];
  examLevelList: any[] = [];
  passmark: boolean;
  levelNames: any;
  levelkey: any;
  categorykeys: any;
  levelkeys: any;
  categoryNames: any;
  examsId: any;
  questionList: any;
  weightage = false;
  negativeValidation: boolean;
  validateQuestionMark: boolean;
  validateQuestionMarkMsg: string;
  isPremium: boolean;
  itemsPerPage: number;
  constructor(
    public activatedRoute: ActivatedRoute,
    public examService: ExamService,
    public formbuilder: FormBuilder,
    public toastr: ToastMessageService,
    private router: Router
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.examkey = params.examkey;
      this.categorykey = params.categorykeys;
      this.examsId = params.examsIds;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      if (params.isPremium === 'true') {
        this.isPremium = true;
      } else {
        this.isPremium = false;
      }
    })
    if (!this.pageNo) {
      this.pageNo = 1
    }
    this.setExamForm()
  }

  ngOnInit(): void {
    this.allExamDetails()
    this.getAllExamLevel()
    this.getAllCategories()
  }
  setExamForm() {
    this.updateExamForm = this.formbuilder.group({
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
      ispremium: [''],
    })
  }
  get examform() {
    return this.updateExamForm.controls
  }
  getAllCategories() {
    // function to get all published categories
    this.examService.getAllPublishedCategories().then((list) => {
      list.on('value', (snapshot) => {
        const data = snapshot.val()
        Object.entries(snapshot.val()).forEach(([datakey, datavalue]) => {
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
      })
    })
  }

  getAllExamLevel() {
    // function to get all exam level
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
  checkPassmark() {
    // function to check pass mark value greater than total mark
    if (Number(this.updateExamForm.value.passMark) > Number(this.updateExamForm.value.totalMark)) {
      this.passmark = true
    } else {
      this.passmark = false
    }
  }

  allExamDetails() {
    // function to get exam details by specific key
    this.examService.getallExams(this.categorykey, this.examkey)
    .on('value', (snapshot) => {
      const data = snapshot.val();
      this.questionList = this.examService.getQuestionsByExam(this.examsId)
      this.categoryNames = data.categoryName
      this.examName = data.examName
      this.passMark = data.passMark
      this.levelName = data.levelName
      this.categorykeys = data.categoryKey
      this.levelkeys = data.levelkey
      this.totalMark = data.totalMark
      this.totalNoOfQuestions = data.totalNoOfQuestions
      this.examDuration = data.examDuration
      this.examInstruction = data.examInstruction
      this.marks = ''
      this.negativeMarks = ''
      if (data.same_weightage) {
        this.weightage = data.same_weightage
        this.marks = data.marks
        this.negativeMarks = data.negativeMarks
      }
      this.categoryName = {
        $key: data.categoryKey,
        categoryName: data.categoryName,
      }
      // console.log(this.categoryName);
      this.levelName = {
        $key: data.levelkey,
        levelName: data.levelName,
      }
    })
  }

  validateExamQuestions(): boolean {
    if (this.questionList) {
      const { data: { questions = null } = {} } = this.questionList
      if (questions) {
        const questionKeys = Object.keys(questions)
        const questionCount = questionKeys.length
        // Check questipns count
        if (
          this.updateExamForm.value.totalNoOfQuestions < questionCount &&
          questionCount !== 0
        ) {
          this.toastr.show(
            'Total number of questions must not be less than existing number of questions',
            true
          )
          return false
        }

        let questionsMark = 0
        questionKeys.forEach((itm) => {
          const { marks } = questions[itm]
          questionsMark += Number(marks)
        })

        // Check total moarks 2< 3 question mark =< enter mrk
        const enteredMark = Number(this.updateExamForm.value.totalMark)
        if (
          questionCount < this.updateExamForm.value.totalNoOfQuestions &&
          questionsMark >= enteredMark
        ) {
          this.toastr.show(
            'Total marks is not sufficient for creating additional questions',
            true
          )
          return false
        }
      }
    }
    return true
  }

  updateExam() {
    console.log("this.updateExamForm",this.updateExamForm)
    this.submitted = true
    if (this.updateExamForm.status === 'VALID') {
      if (this.validateExamQuestions()) {
        // function to update exam
        const params = {
          metaData: {
            categoryName: this.updateExamForm.value.categoryName.categoryName,
            categoryKey: this.updateExamForm.value.categoryName.$key,
            levelName: this.updateExamForm.value.levelName.levelName,
            examName: this.updateExamForm.value.examName,
            examDuration: this.updateExamForm.value.examDuration,
            totalMark: this.updateExamForm.value.totalMark,
            passMark: this.updateExamForm.value.passMark,
            totalNoOfQuestions: this.updateExamForm.value.totalNoOfQuestions,
            examInstruction: this.updateExamForm.value.examInstruction,
            isPublished: false,
            levelkey: this.updateExamForm.value.levelName.$key,
            same_weightage: this.weightage,
            marks: this.updateExamForm.value.marks,
            negativeMarks: this.updateExamForm.value.negativeMarks,
            isPremium: this.isPremium,
          },
          examsId: this.examsId,
        }
        const removeData = this.examService.removeExamInCategory(
          this.categorykey,
          this.examkey
        )
        // if(this.weightage){
        this.examService.updateMarksInExamQuestions(
          this.examsId,
          this.marks,
          this.negativeMarks
        )
        // }
        // function to remove exam under a category when we change the category
        if (removeData === 'deleted') {
          console.log(params)
          this.examService.updateExams(
            this.updateExamForm.value.categoryName.$key,
            params
          )
          this.toastr.show(APP_MESSAGE.EXAM.exam_update, false)
          this.submitted = false
          this.router.navigate(['/exam'], {
            queryParams: {
              pageNo: this.pageNo,
              itemsPerPage: this.itemsPerPage
            },
          })
        }
      }
    }
  }
  checkDatas(option, value) {
    // compare two values in select
    return option.$key === value.$key
  }
  checkLevel(option, value) {
    // compare two values in select
    return option.$key === value.$key
  }
  // function to show Marks field if weigtage is same for all questions
  addexamLink(event) {
    /* tslint:disable */
    if (event.target.checked === true) {
      this.examform['marks'].setValidators([Validators.required])
      this.examform['negativeMarks'].setValidators([Validators.required])
      this.weightage = true
    } else {
      this.marks = ''
      this.negativeMarks = ''
      this.examform['marks'].clearValidators()
      this.examform['marks'].updateValueAndValidity()
      this.examform['negativeMarks'].clearValidators()
      this.examform['negativeMarks'].updateValueAndValidity()
      this.weightage = false
    }
  }
  checkTotalMark() {
    const marksQuestions = this.examform.totalNoOfQuestions.value * this.examform.marks.value;
    if (this.examform.marks.value > this.examform.totalMark.value) {
      this.validateQuestionMark = true
      this.validateQuestionMarkMsg = 'Entered mark should not be greater than total mark';
      this.submitted = true
    } else if (marksQuestions != this.examform.totalMark.value) {
      this.validateQuestionMark = true
      this.validateQuestionMarkMsg = 'Number of questions multiplied by Mark should be equal to Total Mark';
      this.submitted = true
    } else {
      this.validateQuestionMark = false
    }
  }

  checkNegativeMark() {
    if (
      (Number(this.examform.negativeMarks.value) > Number(this.examform.marks.value)) ||
      (Number(this.examform.negativeMarks.value) < 0)
      ){
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
  isPremiumEvent(event) {
    if (event.target.checked === true) {
      this.isPremium = true
    } else {
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
