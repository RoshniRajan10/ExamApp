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
import { ToastMessageService, PracticeService } from '@app/core'
import { analyzeAndValidateNgModules } from '@angular/compiler'
declare var $: any
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

@Component({
  selector: 'app-update-practice-questions',
  templateUrl: './update-practice-questions.component.html',
  styleUrls: ['./update-practice-questions.component.scss'],
})
export class UpdatePracticeQuestionsComponent implements OnInit {
  categorykey: any;
  qstnkey: any;
  totalNoOfQuestions: any;
  firstFormGroup: FormGroup;
  questionForm: FormGroup;
  question: any;
  hint: any = '';
  difficulty: any;
  marks: any;
  negativeMarks: any;
  value = 100;
  submitted: boolean;
  options: Options = {
    floor: 0,
    ceil: 10,
  };
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
  practiceKey: any;
  practiceInSubcategorykey: any;
  subCategorykey: any;
  practiceNames: any;
  categoryNames: any;
  subCategoryNames: any;
  totalNoOfQuestion: any;
  practiceInChapterkey: any;
  chapterkeys: any;
  practiceResult: string;
  practiceResults: boolean;
  weightage: any;
  disabled: string;
  pageNo: number;
  qstnPageNo: number;
  itemsPerPage: number;
  qstitemsPerPage: number;
  // mat chips
  @ViewChild('qstnTagInput') qstnTagInput: ElementRef<HTMLInputElement>
  @ViewChild('subqstnTagInput') subqstnTagInput: ElementRef<HTMLInputElement>
  @ViewChild('auto') matAutocomplete: MatAutocomplete
  @ViewChild('autoSub') matAutocomplete1: MatAutocomplete
  visible = true
  selectable = true
  removable = true
  separatorKeysCodes: number[] = [ENTER, COMMA]
  // Main tags
  qstnTagsCtrl = new FormControl()
  filteredqstnTags: Observable<string[]>
  qstnTags: string[] = []
  filteredList: string[]
  filteredTags: string[]
  qstnTagstoShow: any[]
  tagsToSave: any[]
  qstnTagsFromDb: any[]
  // mat chips Main tags end
  // Sub tags
  subqstnTagsCtrl = new FormControl()
  filteredsubqstnTags: Observable<string[]>
  subqstnTags: string[] = []
  subTagfilteredList: string[]
  filteredSubTags: string[]
  subqstnTagstoShow: any[]
  subtagsToSave: any[]
  subqstnTagsFromDb: any[]
  negativeValidation: boolean
  // mat chips end

  constructor(
    public activatedRoute: ActivatedRoute,
    public practiceService: PracticeService,
    private formBuilder: FormBuilder,
    private router: Router,
    public toastr: ToastMessageService
  ) {
    this.practiceResults = false
    this.activatedRoute.queryParams.subscribe((params) => {
      this.practiceKey = params.practiceKey;
      this.practiceInChapterkey = params.practiceInChapterkey;
      this.chapterkeys = params.chapterkey;
      this.qstnkey = params.qstnkey;
      this.qstnPageNo = params.qstnPageNo;
      this.itemsPerPage = params.itemsPerPage;
      this.qstitemsPerPage = params.qstitemsPerPage;
      if (params.weightage == 'true') {
        this.weightage = params.weightage;
        this.disabled = 'true';
      }
      if (params.weightage == 'false') {
        this.weightage = params.weightage;
        this.disabled = null;
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

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      examName: [''],
      examDuration: [''],
      passMark: [''],
      totalMark: [''],
      totalNoOfQuestions: [''],
    })
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      hint: [''],
      difficulty: ['', Validators.required],
      marks: [''],
      negativeMarks: [''],
    })
    this.optionForm = this.formBuilder.group({
      options: this.formBuilder.array([this.addFormgroup()]),
    })
    this.solutionForm = this.formBuilder.group({
      solutions: this.formBuilder.array([this.addFormgroupSolutions()]),
      bestSolutions: this.formBuilder.array([this.addFormgroupBestSolutions()]),
    })
    this.getPracticeDetails()
    // this.getQuestionDetails()
    this.getAllQuestionTags()
    this.getAllQuestionSubTags()
  }
  getPracticeDetails() {
    this.practiceService.getPracticeDetail(
      this.chapterkeys,
      this.practiceKey,
      this.practiceInChapterkey
    )
    .on('value', (snapshot) => {
      const objPracticeres = snapshot.val(); 
      // get question details
      this.practiceService.getQuestionDetails(
        this.practiceKey,
        this.qstnkey
      )
      .on('value', (snapshot) => {
        const objQstnres = snapshot.val();
        this.practiceNames = objPracticeres.practiceName
        this.categoryNames = objPracticeres.categoryName
        this.subCategoryNames = objPracticeres.subCategoryName
        this.totalNoOfQuestion = objPracticeres.totalNoOfQuestions
        this.isPublished = objPracticeres.isPublished
        this.marks = ''
        this.negativeMarks = ''
        if (objPracticeres.same_weightage) {
          this.weightage = objPracticeres.same_weightage
          this.marks = objPracticeres.marks
          this.negativeMarks = objPracticeres.negativeMarks
        } else if(!objPracticeres.same_weightage) {
          this.weightage = false;
          this.marks = objQstnres.marks ? objQstnres.marks : 1;
          this.negativeMarks = objQstnres.negativeMarks ? objQstnres.negativeMarks : 0;
        }        
        this.question = objQstnres.question
        this.hint = objQstnres.hint
        this.difficulty = objQstnres.difficulty
        this.optionss = objQstnres.options
        this.bestSolutions = objQstnres.bestSolutions
        this.Solutions = objQstnres.solutions
        this.optionForm.setControl('options', this.setReturnItems(this.optionss))
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
      });
    });
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
    this.practiceService.getQuestionDetails(
      this.practiceKey,
      this.qstnkey
    )
    .on('value', (snapshot) => {
      const objQstnres = snapshot.val();
      this.question = objQstnres.question
      this.hint = objQstnres.hint
      this.difficulty = objQstnres.difficulty
      this.marks = objQstnres.marks
      this.negativeMarks = objQstnres.negativeMarks
      this.optionss = objQstnres.options
      this.bestSolutions = objQstnres.bestSolutions
      this.Solutions = objQstnres.solutions
      this.optionForm.setControl('options', this.setReturnItems(this.optionss))
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
  // function to update practice questions
  UpdateQuestion() {
    this.isPublished = false
    this.options = this.optionForm.value.options
    this.solutions = this.solutionForm.value.solutions
    let i = 1
    let j = 1
    let k = 1
    this.optionForm.value.options.forEach((element) => {
      this.optionArray.push({
        id: i,
        option: element.option,
        rightAnswer: element.rightAnswer,
      })
      i++
    })
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

    // //filter for duplicated values in tags
    // this.qstnTags = this.qstnTags.filter(function (item, index, inputArray) {
    //   return inputArray.indexOf(item) == index
    // })
    const question = this.questionForm.value.question
    const hint = this.questionForm.value.hint
    const difficulty = this.questionForm.value.difficulty
    const marks = this.questionForm.value.marks
    const negativeMarks = this.questionForm.value.negativeMarks
    const options = this.optionArray
    const noOfOptions = this.optionForm.value.options.length
    const noOfsolutions = this.solutionForm.value.solutions.length
    const noOfbestSolutions = this.solutionForm.value.bestSolutions.length
    const solutions = this.solutionArray
    const bestSolutions = this.bestSolutionsArray
    const qstnTags = this.qstnTags
    const subqstnTags = this.subqstnTags

    if (this.solutionForm.controls.solutions.valid) {
      this.practiceService
        .updateQuestion(
          this.practiceKey,
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
          this.practiceResults = true
          this.practiceService.saveQuestionTags(this.tagsToSave)
          this.toastr.show(APP_MESSAGE.PRACTICE.qstn_update, false)
          this.submitted = false
          this.router.navigate(['/list-questions/view'], {
            queryParams: {
              practicekeys: this.practiceKey,
              practiceInChapterKeys: this.practiceInChapterkey,
              chapterkey: this.chapterkeys,
              weightage: this.weightage,
              qstnPageNo: this.qstnPageNo,
              pageNo: this.pageNo, 
              itemsPerPage: this.itemsPerPage,
              qstitemsPerPage: this.qstitemsPerPage
            },
          })
        })
    }
  }
  Goback() {
    this.router.navigate(['/list-questions/view'], {
      queryParams: {
        practicekeys: this.practiceKey,
        practiceInChapterKeys: this.practiceInChapterkey,
        chapterkey: this.chapterkeys,
        weightage: this.weightage,
        qstnPageNo: this.qstnPageNo,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        qstitemsPerPage: this.qstitemsPerPage
      },
    })
  }

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
      this.submitted = false
    } else {
      this.submitted = true
    }
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
    this.practiceService.getAllQstnTags().then((result) => {
      const data = result.val()
      this.qstnTagsFromDb = data.split(',')
      this.qstnTagstoShow = this.qstnTagsFromDb
    })
  }
  getAllQuestionSubTags() {
    this.practiceService.getAllSubQstnTags().then((result) => {
      const data = result.val()
      this.subqstnTagsFromDb = data.split(',')
      this.subqstnTagstoShow = this.subqstnTagsFromDb
    })
  }
  checkOptionValidation(stepper: MatStepper) {
    if (this.optionForm.valid) {
      const lstRight = this.optionsList.controls.filter(
        (itm) => itm.value.rightAnswer === true
      )
      if (lstRight.length === 0) {
        this.toastr.show('Select at least one option is right answer', true)
        this.submitted = true
      } else {
        this.submitted = false
        stepper.next()
      }
    } else {
      this.submitted = true
    }
  }
  checkNegativeMark() {
    if (
      Number(this.questionForm.value.negativeMarks) >
      Number(this.questionForm.value.marks)
    ) {
      this.negativeValidation = true
      this.submitted = true
    } else {
      this.negativeValidation = false
    }
  }
}
