import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Options } from 'ng5-slider'
import { APP_MESSAGE } from '@app/core/config'
import { ExamService, ToastMessageService } from '@app/core'
import * as firebase from 'firebase'
import { NgxSpinnerService } from 'ngx-spinner'
// for mat chips
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete'
import { MatChipInputEvent } from '@angular/material/chips'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { MatStepper } from '@angular/material/stepper'
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast'
@Component({
  selector: 'app-update-exam',
  templateUrl: './update-exam.component.html',
  styleUrls: ['./update-exam.component.scss'],
})
export class UpdateExamComponent implements OnInit {
  pageNo: number;
  itemsPerPage: number;
  qstitemsPerPage: number;
  examkey: any;
  examcategoryKey: any;
  categorykey: any;
  qstnkey: any;
  examNames: any;
  examDuration: any;
  passMark: any;
  totalMark: any;
  totalNoOfQuestions: any;
  firstFormGroup: FormGroup;
  questionForm: FormGroup;
  question: string = "";
  hint: any = '';
  difficulty: any;
  marks: any;
  currentMark: any;
  negativeMarks: any;
  value = 100;
  submitted = true;
  options: Options = {
    floor: 0,
    ceil: 10,
  };
  disableButton = false;
  optionForm: FormGroup;
  optionss: any;
  solutionForm: FormGroup;
  bestSolutions: any;
  Solutions: any;
  optionArray: any[] = [];
  solutions: any;
  bestSolutionsArray: any[] = [];
  solutionArray: any[] = [];
  isPublished: boolean;
  categoryName: any;
  levelName: any;
  validateQuestionMark: boolean;
  validateQuestionMarkMsg: string;
  data1: any;
  questionMarks = 0;
  QuestionList: any[] = [];
  totalMarksForQuestions: number;
  negativeValidation: boolean;
  optValidation = false;
  submitButton = false;
  weightage: boolean;
  disabled: any = null;
  qstPageNo: any;
  // mat chips
  @ViewChild('qstnTagInput') qstnTagInput: ElementRef<HTMLInputElement>;
  @ViewChild('subqstnTagInput') subqstnTagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('autoSub') matAutocomplete1: MatAutocomplete;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  // Main tags
  qstnTagsCtrl = new FormControl();
  filteredqstnTags: Observable<string[]>;
  qstnTags: string[] = [];
  filteredList: string[];
  filteredTags: string[];
  qstnTagstoShow: any[];
  tagsToSave: any[];
  qstnTagsFromDb: any[];
  // mat chips Main tags end
  // Sub tags
  subqstnTagsCtrl = new FormControl();
  filteredsubqstnTags: Observable<string[]>;
  subqstnTags: string[] = [];
  subTagfilteredList: string[];
  filteredSubTags: string[];
  subqstnTagstoShow: any[];
  subtagsToSave: any[];
  subqstnTagsFromDb: any[];
  // mat chips end
  constructor(
    public activatedRoute: ActivatedRoute,
    public examService: ExamService,
    private formBuilder: FormBuilder,
    private router: Router,
    public toastr: ToastMessageService,
    private spinner: NgxSpinnerService
  ) {
    this.validateQuestionMark = false
    this.activatedRoute.queryParams.subscribe((params) => {
      this.examkey = params.examkey
      this.examcategoryKey = params.examcategoryKey
      this.categorykey = params.categorykey
      this.qstnkey = params.qstnkey
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      this.qstPageNo = params.qstPageNo;
      this.qstitemsPerPage = params.qstitemsPerPage;
      if (params.weightage == 'true') {
        this.weightage = params.weightage
        this.disabled = 'true'
      }
      if (params.weightage == 'false') {
        this.weightage = params.weightage
        this.disabled = null
      }
    })
    // for mat chips
    this.filteredqstnTags = this.qstnTagsCtrl.valueChanges.pipe(
      startWith(null),
      map((qstnTag: string | null) =>
        qstnTag ? this._filter(qstnTag) : this.filteredList
      )
    )
    this.filteredsubqstnTags = this.subqstnTagsCtrl.valueChanges.pipe(
      startWith(null),
      map((qstnTag: string | null) =>
        qstnTag ? this._filterSubTag(qstnTag) : this.subTagfilteredList
      )
    )
  }

  async ngOnInit() {
    // this.firstFormGroup = this.formBuilder.group({
    //   examName: [''],
    //   examDuration: [''],
    //   passMark: [''],
    //   totalMark: [''],
    //   totalNoOfQuestions: [''],
    // })
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      hint: [''],
      difficulty: ['', Validators.required],
      marks: ['', Validators.required],
      negativeMarks: ['', Validators.required],
    })
    this.optionForm = this.formBuilder.group({
      options: this.formBuilder.array([this.addFormgroup()]),
    })
    this.solutionForm = this.formBuilder.group({
      solutions: this.formBuilder.array([this.addFormgroupSolutions()]),
      bestSolutions: this.formBuilder.array([this.addFormgroupBestSolutions()]),
    })
    this.getExamDetails();
    // this.getQuestionDetails();
    this.getAllQuestions();
    this.getAllQuestionTags();
    this.getAllQuestionSubTags();
  }

  getAllQuestions() {
    this.spinner.show();
    this.examService.getAllQuestionsBykey(this.examkey)
    .on('value', (snapshot) => {
      this.spinner.hide();
      this.data1 = snapshot.val();
      if(this.data1.data.questions){
        this.QuestionList = Object.values(this.data1.data.questions).map((item)=>{
          return item
        })
        console.log("this.QuestionList",this.QuestionList)
        this.totalMarksForQuestions = Number(this.QuestionList.reduce((a, {marks}) => a + Number(marks), 0));
      }
    })
  }
  getExamDetails() {
    // function to get all exam details
    this.examService.getExamDetails1(this.categorykey, this.examkey, this.examcategoryKey)
    .then((result) => {
      const objExamres = result.val()
      // get question details
      this.examService
      .getQuestionDetails(this.examkey, this.qstnkey)
      .then((data) => {
        const objQstnres = data.val();
        this.question = objQstnres.question;
        this.examNames = objExamres.examName;
        this.examDuration = objExamres.examDuration;
        this.passMark = objExamres.passMark;
        this.totalMark = objExamres.totalMark;
        this.totalNoOfQuestions = objExamres.totalNoOfQuestions;
        this.categoryName = objExamres.categoryName;
        this.levelName = objExamres.levelName;
        this.marks = '';
        this.negativeMarks = '';
        if (objExamres.same_weightage) {
          this.weightage = objExamres.same_weightage;
          this.marks = objExamres.marks;
          this.negativeMarks = objExamres.negativeMarks;
        } else if(!objExamres.same_weightage) {
          this.weightage = false;
          this.marks = objQstnres.marks ? objQstnres.marks : 1;
          this.negativeMarks = objQstnres.negativeMarks ? objQstnres.negativeMarks : 0;
        }
        this.currentMark = Number(this.marks);
        this.hint = objQstnres.hint;
        this.difficulty = objQstnres.difficulty;
        // this.currentMark = objQstnres.marks;
        this.optionss = objQstnres.options;
        this.bestSolutions = objQstnres.bestSolutions
        this.Solutions = objQstnres.solutions
        this.optionForm.setControl(
          'options',
          this.setReturnItems(this.optionss)
        )
        this.solutionForm.setControl(
          'bestSolutions',
          this.setReturnBestSolution(this.bestSolutions)
        )
        this.solutionForm.setControl(
          'solutions',
          this.setReturnSolutions(this.Solutions)
        )
        this.qstnTags = []
        if (objQstnres.qstnTags) {
          this.qstnTags = objQstnres.qstnTags
        }
        this.subqstnTags = []
        if (objQstnres.subqstnTags) {
          this.subqstnTags = objQstnres.subqstnTags
        }
      })
    })
  }
  addFormgroup() {
    return this.formBuilder.group({
      option: [''],
      rightAnswer: [''],
    })
  }
  get questionform() {
    return this.questionForm.controls
  }
  addSolutions() {
    this.solutionList.push(this.addFormgroupSolutions())
  }

  addFormgroupSolutions() {
    return this.formBuilder.group({
      solution: [''],
    })
  }
  get solutionList() {
    return this.solutionForm.get('solutions') as FormArray
  }
  removeSolutionArrayForms(index) {
    this.solutionList.removeAt(index)
  }
  addBestSolutions() {
    this.bestSolutionList.push(this.addFormgroupBestSolutions())
  }
  addFormgroupBestSolutions() {
    return this.formBuilder.group({
      solution: [''],
    })
  }
  get bestSolutionList() {
    return this.solutionForm.get('bestSolutions') as FormArray
  }
  removeBestSolutionArrayForms(index) {
    this.bestSolutionList.removeAt(index)
  }
  removeArrayForms(index) {
    this.optionsList.removeAt(index)
  }
  getQuestionDetails() {
    // function to get question details based on a particular question key
    
  }
  addOptions() {
    this.optionsList.push(this.addFormgroup())
  }
  setReturnItems(optionsArray: any[]): FormArray {
    const formArray = new FormArray([])
    optionsArray.forEach((optionelement) => {
      formArray.push(
        this.formBuilder.group({
          option: [optionelement.option, [Validators.required]],
          rightAnswer: optionelement.rightAnswer,
        })
      )
    })
    return formArray
  }
  setReturnBestSolution(bestSolutionArray: any[]): FormArray {
    const formArray = new FormArray([])
    if (bestSolutionArray) {
      bestSolutionArray.forEach((optionelement) => {
        formArray.push(
          this.formBuilder.group({
            solution: [optionelement.solution],
          })
        )
      })
    }
    return formArray
  }
  setReturnSolutions(SolutionArray: any[]): FormArray {
    const formArray = new FormArray([])
    if (SolutionArray) {
      SolutionArray.forEach((solutionelement) => {
        formArray.push(
          this.formBuilder.group({
            solution: [solutionelement.solution],
          })
        )
      })
    }
    return formArray
  }
  get optionsList() {
    return <FormArray>this.optionForm.get('options')
  }
  checkRightAnswer(event, i) {
    /* tslint:disable */
    this.optionsList.controls.forEach((arg) => arg.get('rightAnswer').reset())
    ;(<FormArray>this.optionForm.controls['options'])
      .at(i)
      .get('rightAnswer')
      .setValue(true)
  }

  UpdateQuestion() {
    // update questions
    if (this.solutionForm.controls.solutions.valid && this.submitted == true) {
      this.submitted = false;
      this.disableButton = true;
      this.isPublished = false;
      this.options = this.optionForm.value.options;
      this.solutions = this.solutionForm.value.solutions;
      // let i = 1
      let j = 1;
      let k = 1;
      this.solutionForm.value.solutions.forEach((element) => {
        this.solutionArray.push({
          id: j,
          solution: element.solution,
        })
        j++
      })
      this.solutionForm.value.bestSolutions.forEach((element) => {
        this.bestSolutionsArray.push({
          id: k,
          solution: element.solution,
        })
        k++
      })
      const question = this.questionForm.value.question;
      const hint = this.questionForm.value.hint;
      const difficulty = this.questionForm.value.difficulty;
      const marks = this.questionForm.value.marks;
      const negativeMarks = this.questionForm.value.negativeMarks;
      const options = this.optionArray;
      const noOfOptions = this.optionForm.value.options.length;
      const noOfsolutions = this.solutionForm.value.solutions.length;
      const noOfbestSolutions = this.solutionForm.value.bestSolutions.length;
      const solutions = this.solutionArray;
      const bestSolutions = this.bestSolutionsArray;
      const qstnTags = this.qstnTags;
      const subqstnTags = this.subqstnTags;
      this.examService
        .updateQuestion(
          this.examkey,
          this.qstnkey,
          question,
          hint,
          difficulty,
          marks,
          negativeMarks,
          options,
          noOfOptions,
          noOfsolutions,
          noOfbestSolutions,
          solutions,
          bestSolutions,
          qstnTags,
          subqstnTags
        )
        .then(() => {
          this.examService.saveQuestionTags(this.tagsToSave)
          this.examService.saveSubQuestionTags(this.subtagsToSave)
          this.toastr.show(APP_MESSAGE.EXAM.qstn_update, false)
          this.router.navigate(['/manage-exam/view-questions'], {
            queryParams: {
              examkey: this.examkey,
              examinCatkey: this.examcategoryKey,
              categorykey: this.categorykey,
              qstncount: this.totalNoOfQuestions,
              qstPageNo: this.qstPageNo,
              pageNo: this.pageNo, 
              itemsPerPage: this.itemsPerPage,
              weightage: this.weightage,
              qstitemsPerPage: this.qstitemsPerPage
            },
          })
        })
    }
  }

  Goback() {
    this.router.navigate(['/manage-exam/view-questions'], {
      queryParams: {
        examkey: this.examkey,
        examinCatkey: this.examcategoryKey,
        categorykey: this.categorykey,
        qstncount: this.totalNoOfQuestions,
        qstPageNo: this.qstPageNo,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        weightage: this.weightage,
        qstitemsPerPage: this.qstitemsPerPage
      },
    })
  }
  checkTotalMark() {
    const markToCompare = (Number(this.questionForm.value.marks) + this.totalMarksForQuestions) - this.currentMark;
    console.log("markToCompare", markToCompare)
    if (this.totalMark < markToCompare) {
      this.validateQuestionMark = true;
      this.validateQuestionMarkMsg = 'Entered mark should not be greater than total mark';
      this.submitted = true;
    } else {
      const marksQuestions =
        (this.totalMarksForQuestions || 0) - (this.currentMark + Number(this.questionForm.value.marks))
      if (marksQuestions > this.totalMark) {
        this.validateQuestionMark = true;
        this.validateQuestionMarkMsg = 'Total marks is not sufficient for creating additional questions';
        this.submitted = true;
      } else {
        this.validateQuestionMark = false;
      }
    }
  }
  checkNegativeMark() {
    if (
      (Number(this.questionForm.value.negativeMarks) >
      Number(this.questionForm.value.marks)) ||
      (Number(this.questionForm.value.negativeMarks) < 0)
    ) {
      this.negativeValidation = true
      this.submitted = true
    } else {
      this.negativeValidation = false
    }
  }

  // function to check question validations
  checkValidation() {
    //for main tags
    const filteredTags = this.qstnTags.filter(
      (word) => !this.qstnTagsFromDb.includes(word)
    )
    this.tagsToSave = this.qstnTagsFromDb
    this.tagsToSave = this.tagsToSave.concat(filteredTags)
    this.tagsToSave = this.tagsToSave.filter(function (
      item,
      index,
      inputArray
    ) {
      return inputArray.indexOf(item) == index
    })
    //for sub tags
    const filteredSubTags = this.subqstnTags.filter(
      (word) => !this.tagsToSave.includes(word)
    )
    this.subtagsToSave = this.subqstnTagsFromDb
    this.subtagsToSave = this.subtagsToSave.concat(filteredSubTags)
    this.subtagsToSave = this.subtagsToSave.filter(function (
      item,
      index,
      inputArray
    ) {
      return inputArray.indexOf(item) == index
    })
    if (this.questionForm.valid) {
      if (this.validateQuestionMark === true) {
        this.submitted = false
      } else {
        this.submitted = true
      }
    } else {
      this.submitted = false
    }
  }
  //function for option form validation
  // checkOptions(stepper: MatStepper) {
  checkOptions() {
    this.optionArray = []
    this.optValidation = false
    this.submitButton = false
    let i = 1
    this.optionForm.value.options.forEach((element) => {
      this.optionArray.push({
        id: i,
        option: element.option,
        rightAnswer: element.rightAnswer,
      })
      i++
    })
    if (this.optionArray) {
      this.optionArray.forEach((e) => {
        if (e.rightAnswer === true) {
          this.optValidation = true
          this.submitted = true
        }
      })
    }
    if (this.optValidation === false) {
      this.toastr.show('Please choose the Right answer', true)
      this.submitted = false
      this.submitButton = true
    }
    // if (this.optionForm.valid) {
    //   const lstRight = this.optionsList.controls.filter(
    //     (itm) => itm.value.rightAnswer === true
    //   )
    //   if (lstRight.length === 0) {
    //     this.toastr.show('Select at least one option is right answer', true)
    //     this.submitted = true
    //   } else {
    //     this.submitted = false
    //     stepper.next()
    //   }
    // } else {
    //   this.submitted = true
    // }
  }
  //chip functions for sub tag
  addsubQstnTag(event: MatChipInputEvent): void {
    const input = event.input
    const value = event.value

    // Add our qstnTag
    if (this.subqstnTags.length < 1) {
      if ((value || '').trim()) {
        this.subqstnTags.push(value.trim())
      }
    } else {
      this.toastr.show('Only one tag is accepted', true)
    }


    // Reset the input value
    if (input) {
      input.value = ''
    }

    this.subqstnTagsCtrl.setValue(null)
  }
  //chip functions for main
  add(event: MatChipInputEvent): void {
    const input = event.input
    const value = event.value

    // Add our qstnTag
    if (this.qstnTags.length < 1) {
      if ((value || '').trim()) {
        this.qstnTags.push(value.trim())
      }
    } else {
      this.toastr.show('Only one tag is accepted', true)
    }

    // Reset the input value
    if (input) {
      input.value = ''
    }

    this.qstnTagsCtrl.setValue(null)
  }

  remove(qstnTag: string): void {
    const index = this.qstnTags.indexOf(qstnTag)

    if (index >= 0) {
      this.qstnTags.splice(index, 1)
    }
  }
  removeSubTag(subqstnTag: string): void {
    const index = this.subqstnTags.indexOf(subqstnTag)

    if (index >= 0) {
      this.subqstnTags.splice(index, 1)
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.qstnTags.push(event.option.viewValue)
    this.qstnTagInput.nativeElement.value = ''
    this.qstnTagsCtrl.setValue(null)
  }

  selectedSbTags(event: MatAutocompleteSelectedEvent): void {
    this.subqstnTags.push(event.option.viewValue)
    this.subqstnTagInput.nativeElement.value = ''
    this.subqstnTagsCtrl.setValue(null)
  }
  private _filter(value: string): string[] {
    if (this.qstnTags.length < 1) {
      const filterValue = value.toLowerCase()
      const allqstnTags = this.qstnTagsFromDb.filter(
        (qstnTag) => qstnTag.toLowerCase().indexOf(filterValue) === 0
      )
      this.qstnTags.forEach((tag) => {
        this.qstnTagstoShow = this.qstnTagsFromDb.filter((tags) => tags !== tag)
      })
      return allqstnTags
    } else {
      this.toastr.show('Only one tag is accepted', true)
    }
  }
  private _filterSubTag(value: string): string[] {
    if (this.subqstnTags.length < 1) {
      const filterValue = value.toLowerCase()
      const allqstnTags = this.subqstnTagsFromDb.filter(
        (qstnTag) => qstnTag.toLowerCase().indexOf(filterValue) === 0
      )
      this.subqstnTags.forEach((tag) => {
        this.subqstnTagstoShow = this.subqstnTagsFromDb.filter(
          (tags) => tags !== tag
        )
      })
      return allqstnTags
    } else {
      this.toastr.show('Only one tag is accepted', true)
    }
  }
  getAllQuestionTags() {
    this.examService.getAllQstnTags().then((result) => {
      const data = result.val()
      this.qstnTagsFromDb = data.split(',')
      this.qstnTagstoShow = this.qstnTagsFromDb
    })
  }
  getAllQuestionSubTags() {
    this.examService.getAllSubQstnTags().then((result) => {
      const data = result.val()
      this.subqstnTagsFromDb = data.split(',')
      this.subqstnTagstoShow = this.subqstnTagsFromDb
    })
  }
}
