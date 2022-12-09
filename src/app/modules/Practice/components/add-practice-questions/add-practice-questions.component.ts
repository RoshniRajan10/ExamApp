import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Options } from 'ng5-slider'
import { APP_MESSAGE } from '@app/core/config'
import { ToastMessageService, PracticeService } from '@app/core'
declare var $: any
import { Router } from '@angular/router'
import * as firebase from 'firebase'
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
import { NgxSpinnerService } from 'ngx-spinner'
import * as _ from 'lodash'

@Component({
  selector: 'app-add-practice-questions',
  templateUrl: './add-practice-questions.component.html',
  styleUrls: ['./add-practice-questions.component.scss'],
})
export class AddPracticeQuestionsComponent implements OnInit {
  value = 100;
  options: Options = {
    floor: 0,
    ceil: 10,
  };
  isLinear = false;
  firstFormGroup: FormGroup;
  questionForm: FormGroup;
  isEditable = false;
  categorykey: any;
  examkey: any;
  examNames: any;
  examDuration: any;
  passMark: any;
  totalMark: any;
  totalNoOfQuestions: any;
  submitted: boolean;
  optionForm: FormGroup;
  solutionForm: FormGroup;
  solutionForm1: FormGroup;
  solutionArray: any[] = [];
  isPublished: boolean;
  examcategoryKey: any;
  optionArray: any[] = [];
  solutions: any;
  bestSolutionsArray: any[] = [];
  categoryName: any;
  levelName: any;
  qstncount: any;
  questionBankForm: FormGroup;
  qstnId: any;
  QuestionList: any[] = [];
  QuestionBankItems: any[] = [];
  Question: any;
  categoryList: any[] = [];
  Question_hint: any = '';
  optionss: any;
  Options: any[] = [];
  optionsValues: any[] = [];
  solutionValues: any[] = [];
  bestSolutionValues: any[] = [];
  public data1: any;
  AllQuestionList: any[] = [];
  QuestionBankList: any[] = [];
  public options1: any;
  public options2: any;
  public options3: any;
  public options4: any;
  public options5: any;
  public solution1: any;
  public solution2: any;
  public solution3: any;
  public solution4: any;
  public solution5: any;
  public bestsolution1: any;
  public bestsolution2: any;
  public bestsolution3: any;
  QuestionBankItemsByKey: any[] = [];
  allQuestionBankList: any[] = [];
  QIDs: any;
  Questions: any;
  Quest_Hints: any;
  questionitems: any[] = [];
  rightAnswers: any;
  answerIndex: number;
  answerIndex1: number;
  answerIndexs: number;
  categoryForm: FormGroup;
  subCategoryKey: any;
  practiceKey: any;
  practiceInSubcategoryKey: any;
  practiceNames: any;
  categoryNames: any;
  subCategoryNames: any;
  // totalNoOfQuestion: any;
  chapterkeys: any;
  practiceInChapterKey: any;
  chapterkey: any;
  chapterKeys: any;
  questionList: any[];
  weightage: boolean;
  disabled: string;
  marks: any;
  negativeMarks: any;
  //mat chips
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
  //mat chips Main tags end
  // Sub tags
  subqstnTagsCtrl = new FormControl();
  filteredsubqstnTags: Observable<string[]>;
  subqstnTags: string[] = [];
  subTagfilteredList: string[];
  filteredSubTags: string[];
  subqstnTagstoShow: any[];
  subtagsToSave: any[];
  subqstnTagsFromDb: any[];
  //mat chips Main tags end
  //chips end
  selectRandomQuestions = false;
  examData: any = {};
  
  qstPageNo: number;
  pageNo: number;
  pageNoBind: number;
  itemsPerPage: number;
  qstitemsPerPage: number;
  qstnPageNo: number;
  qbPageNo: number = 1;
  qbItemsPerPage: number = 5;
  itemsPerPageValues = [5,10,20,50,100];
  pageMaxSize: number = 10;
  questionBankAddButton = true;
  totalMarksForQuestions: number;
  negativeValidation: boolean;
  difficulty: number;
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public practiceService: PracticeService,
    public toastr: ToastMessageService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.setexamLevelForm()
    this.QuestionBankItemsByKey = []
    this.activatedRoute.queryParams.subscribe((params) => {
      this.chapterKeys = params.chapterkeys;
      this.practiceKey = params.practiceKeys;
      this.practiceInChapterKey = params.practiceInChapterKeys;
      this.qstnPageNo = params.qstnPageNo;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      this.qstitemsPerPage = params.qstitemsPerPage;
      if (params.weightage == 'true') {
        this.weightage = true
        this.disabled = 'true'
      }
      if (params.weightage == 'false') {
        this.weightage = false
        this.disabled = null
      }
    })
    //for mat chips
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

  ngOnInit() {
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
    this.getPracticeDetails();
    this.getAllQuestions();
    this.getAllCategories();
    this.getAllQuestionTags();
    this.getAllQuestionSubTags();
    this.getAllQuestionBankItems();
  }
  get questionform() {
    return this.questionForm.controls
  }
  get optionform() {
    return this.optionForm.controls
  }
  get solutionform() {
    return this.solutionForm.controls
  }
  getPracticeDetails() {
    this.practiceService.getPracticeDetail(
      this.chapterKeys,
      this.practiceKey,
      this.practiceInChapterKey
    )
    .on('value', (snapshot) => {
      const objPracticeres = snapshot.val();
      this.practiceNames = objPracticeres.practiceName
      this.categoryNames = objPracticeres.categoryName
      this.subCategoryNames = objPracticeres.subCategoryName
      this.totalNoOfQuestions = objPracticeres.totalNoOfQuestions
      this.marks = ''
      this.negativeMarks = ''
      if (objPracticeres.same_weightage) {
        this.weightage = objPracticeres.same_weightage
        this.marks = objPracticeres.marks
        this.negativeMarks = objPracticeres.negativeMarks
      }      
    });
    const ref = this
    this.practiceService
    .getQuestionsByPractice(this.practiceKey)
    .then((data) => {
      data.on('value', (snapshot) => {
        const { data: { questions = {} } = {} } = snapshot.val()
        ref.questionList = questions
      })
    })
  }
  getAllQuestions() {
    this.spinner.show();
    this.practiceService.getAllQuestionsBykey(this.practiceKey)
    .then((snapshot) => {
      this.spinner.hide();
      this.data1 = snapshot.val();
      if(this.data1.data.questions){
        this.QuestionList = Object.values(this.data1.data.questions).map((item)=>{
          return item
        })
        this.totalMarksForQuestions = Number(this.QuestionList.reduce((a, {marks}) => a + marks, 0));
      }
    })
  }
  addOptions() {
    this.optionsList.push(this.addFormgroup())
  }
  addFormgroup() {
    return this.formBuilder.group({
      option: ['', Validators.required],
      rightAnswer: [''],
    })
  }
  get optionsList() {
    return <FormArray>this.optionForm.get('options')
  }
  removeArrayForms(index) {
    this.optionsList.removeAt(index)
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

  getAllQuestionBankItems() {
    this.QuestionBankList = []
    this.practiceService.getAllQuestionList().subscribe((list) => {
      this.AllQuestionList = list.map((item) => {
        // this.isDataLoaded = true
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      })
      this.AllQuestionList.forEach((question) => {
        /* tslint:disable */
        const options = question['Options']
        const bestsolutions = question['Best_Solutions']
        const solutions = question['Solutions']
        const Right_Answers = question.Right_Answer.toString()
        if(question.Question && question.Question !== ""){
          this.QuestionBankList.push({
            questionKey: question.$key,
            qid: question.QID,
            Question: question.Question,
            Right_Answer: Right_Answers,
            Quest_Hint: question.Quest_Hint,
            categoryKeys: question.categoryKey,
            Option1: options['Option1'],
            Option2: options['Option2'],
            Option3: options['Option3'],
            Option4: options['Option4'],
            Option5: options['Option5'],
            Solution1: solutions['Solution1'],
            Solution2: solutions['Solution2'],
            Solution3: solutions['Solution3'],
            Solution4: solutions['Solution4'],
            Solution5: solutions['Solution5'],
            Best_Solutions1: bestsolutions['Best_Solution1'],
            Best_Solutions2: bestsolutions['Best_Solution2'],
            Best_Solutions3: bestsolutions['Best_Solution3'],
            qstnTags: question.qstnTags,
            subqstnTags: question.subqstnTags
          });
        }
      });
      this.allQuestionBankList = this.QuestionBankList
    })
  }
  resetFilter() {
    this.categoryForm.setValue({categoryName: ""});
    this.getAllQuestionBankItems();
  }
  onGetAllQuestionBankItems() {
    this.getAllQuestionBankItems();
    $('#showQuestionModal').modal('show')
  }
  getQuestionByKey(items, e, indx) {
    if (e.target.checked === true) {
      this.questionitems.push(items);
      const totalCountOfQuestions = this.questionitems.length + this.QuestionList.length;
      if (totalCountOfQuestions > this.totalNoOfQuestions) {
        // console.log("totalCountOfQuestions",totalCountOfQuestions)
        this.toastr.show('The questions exceeds the limit allowed', true);
        this.questionBankAddButton = true;
      } else {
        this.questionBankAddButton = false;
      }
    } else {
      this.questionitems.splice(indx, 1);
      const totalCountOfQuestions = this.questionitems.length + this.QuestionList.length;
      // console.log("totalCountOfQuestions 1",totalCountOfQuestions)
      if (totalCountOfQuestions > this.totalNoOfQuestions) {
        this.questionBankAddButton = true;
      } else {
        this.questionBankAddButton = false;
      }
    }
  }
  setexamLevelForm() {
    this.categoryForm = this.formBuilder.group({
      categoryName: [''],
    })
  }

  getAllCategories() {
    this.practiceService.getAllPublishedCategories().subscribe((list) => {
      const categoryList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.categoryList = _.orderBy(
        categoryList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
    })
  }
  changeCategory() {
    const { categoryName } = this.categoryForm.value
    this.allQuestionBankList = this.QuestionBankList.filter(
      (item) => item.categoryKeys === categoryName.$key
    )
  }
  checkedOrNot(questionKey) {
    const data = this.questionitems.filter(
      (item) => item.questionKey === questionKey
    )
    if (data.length > 0) {
      return true
    } else {
      return false
    }
  }

  addMultipleQuestionToExam() {
    // function to add multiple question from question bank
    const qstnCountlength = this.questionitems.length
    if (qstnCountlength > 0) {
      this.questionitems.forEach((element) => {
        this.Questions = element.Question;
        this.Quest_Hints = element.Quest_Hint;
        this.marks = element.marks ? element.marks : 1;
        this.difficulty = element.difficulty ? element.difficulty : 0;
        this.negativeMarks = element.negativeMarks ? element.negativeMarks : 0;
        if (element.qstnTags) {
          this.qstnTags = element.qstnTags
        }
        if (element.subqstnTags) {
          this.subqstnTags = element.subqstnTags
        }
        if (element.Option1 !== '') {
          if (element.Right_Answer === '1') {
            this.options1 = {
              option: element.Option1,
              rightAnswer: true,
            }
          } else {
            this.options1 = {
              option: element.Option1,
              rightAnswer: false,
            }
          }
        }
        if (element.Option2 !== '') {
          if (element.Right_Answer === '2') {
            this.options2 = {
              option: element.Option2,
              rightAnswer: true,
            }
          } else {
            this.options2 = {
              option: element.Option2,
              rightAnswer: false,
            }
          }
        }
        if (element.Option3 !== '') {
          if (element.Right_Answer === '3') {
            this.options3 = {
              option: element.Option3,
              rightAnswer: true,
            }
          } else {
            this.options3 = {
              option: element.Option3,
              rightAnswer: false,
            }
          }
        }

        if (element.Option4 !== '') {
          if (element.Right_Answer === '4') {
            this.options4 = {
              option: element.Option4,
              rightAnswer: true,
            }
          } else {
            this.options4 = {
              option: element.Option4,
              rightAnswer: false,
            }
          }
        }

        if (element.Option5 !== '') {
          if (element.Right_Answer === '5') {
            this.options5 = {
              option: element.Option5,
              rightAnswer: true,
            }
          } else {
            this.options5 = {
              option: element.Option5,
              rightAnswer: false,
            }
          }
        }
        if (element.solution1 !== '') {
          this.solution1 = {
            solution: element.Solution1,
          }
        }
        if (element.solution2 !== '') {
          this.solution2 = {
            solution: element.Solution2,
          }
        }
        if (element.solution3 !== '') {
          this.solution3 = {
            solution: element.Solution3,
          }
        }
        if (element.solution4 !== '') {
          this.solution4 = {
            solution: element.Solution4,
          }
        }
        if (element.solution5 !== '') {
          this.solution5 = {
            solution: element.Solution5,
          }
        }
        if (element.bestsolution1 !== '') {
          this.bestsolution1 = {
            solution: element.Best_Solutions1,
          }
        }
        if (element.bestsolution2 !== '') {
          this.bestsolution2 = {
            solution: element.Best_Solutions2,
          }
        }
        if (element.bestsolution3 !== '') {
          this.bestsolution3 = {
            solution: element.Best_Solutions3,
          }
        }
        if (element.Option1 !== '') {
          this.optionsValues = [this.options1]
        }
        if (element.Option1 !== '' && element.Option2 !== '') {
          this.optionsValues = [this.options1, this.options2]
        }
        if (
          element.Option1 !== '' &&
          element.Option2 !== '' &&
          element.Option3 !== ''
        ) {
          this.optionsValues = [this.options1, this.options2, this.options3]
        }
        if (
          element.Option1 !== '' &&
          element.Option2 !== '' &&
          element.Option3 !== '' &&
          element.Option4 !== ''
        ) {
          this.optionsValues = [
            this.options1,
            this.options2,
            this.options3,
            this.options4,
          ]
        }
        if (
          element.Option1 !== '' &&
          element.Option2 !== '' &&
          element.Option3 !== '' &&
          element.Option5 !== ''
        ) {
          this.optionsValues = [
            this.options1,
            this.options2,
            this.options3,
            this.options4,
            this.options5,
          ]
        }
        if (element.solution1 !== undefined) {
          this.solutionValues = [this.solution1]
        }
        if (
          element.solution1 !== undefined &&
          element.solution2 !== undefined
        ) {
          this.solutionValues = [this.solution1, this.solution2]
        }
        if (
          element.solution1 !== undefined &&
          element.solution2 !== undefined &&
          element.solution3 !== undefined
        ) {
          this.solutionValues = [this.solution1, this.solution2, this.solution3]
        }
        if (
          element.solution1 !== undefined &&
          element.solution2 !== undefined &&
          element.solution3 !== undefined &&
          element.solution4 !== undefined
        ) {
          this.solutionValues = [
            this.solution1,
            this.solution2,
            this.solution3,
            this.solution4,
          ]
        }
        if (
          element.solution1 !== undefined &&
          element.solution2 !== undefined &&
          element.solution3 !== undefined &&
          element.solution4 !== undefined &&
          element.solution5 !== undefined
        ) {
          this.solutionValues = [
            this.solution1,
            this.solution2,
            this.solution3,
            this.solution4,
            this.solution5,
          ]
        }
        if (element.bestsolution1 !== undefined) {
          this.bestSolutionValues = [this.bestsolution1]
        }
        if (
          element.bestsolution1 !== undefined &&
          element.bestsolution2 !== undefined
        ) {
          this.bestSolutionValues = [this.bestsolution1, this.bestsolution2]
        }
        if (
          element.bestsolution1 !== undefined &&
          element.bestsolution2 !== undefined &&
          element.bestsolution3 !== undefined
        ) {
          this.bestSolutionValues = [
            this.bestsolution1,
            this.bestsolution2,
            this.bestsolution3,
          ]
        }
        this.bestSolutionsArray = []
        this.optionArray = []
        this.solutionArray = []
        let i = 1
        let j = 1
        let k = 1
        this.answerIndexs = this.optionsValues.findIndex(
          (obj) => obj.rightAnswer === true
        )
        this.optionsValues.forEach((elements) => {
          this.optionArray.push({
            id: i,
            option: elements.option,
            rightAnswer: elements.rightAnswer,
          })
          i++
        })
        this.solutionValues.forEach((elements) => {
          this.solutionArray.push({
            id: j,
            solution: elements.solution,
          })
          j++
        })
        this.bestSolutionValues.forEach((elements) => {
          this.bestSolutionsArray.push({
            id: k,
            solution: elements.solution,
          })
          k++
        })

        const params = {
          question: this.Questions,
          hint: this.Quest_Hints,
          difficulty: this.difficulty,
          marks: this.marks,
          negativeMarks: this.negativeMarks,
          options: this.optionArray,
          solutions: this.solutionArray,
          bestSolutions: this.bestSolutionsArray,
          noOfOptions: this.optionsValues.length,
          noOfsolutions: this.solutionValues.length,
          noOfbestSolutions: this.bestSolutionValues.length,
          answerIndex: this.answerIndexs,
          qstnTags: this.qstnTags,
          subqstnTags: this.subqstnTags
        }
        const objResultExam = this.practiceService.addQuestions(
          params,
          this.practiceKey
        )
        this.router.navigate(['/list-questions/view'], {
          queryParams: {
            practicekeys: this.practiceKey,
            practiceInChapterKeys: this.practiceInChapterKey,
            chapterkey: this.chapterKeys,
            qstnPageNo: this.qstnPageNo,
            pageNo: this.pageNo, 
            itemsPerPage: this.itemsPerPage,
            qstitemsPerPage: this.qstitemsPerPage
          },
          //  window.location.reload()
        })
      })
    }
  }

  cancel() {
    this.allQuestionBankList = []
    this.questionitems = []
    $('#showQuestionModal').modal('hide')
  }

  checkRightAnswer(event, i) {
    // tslint:disable-next-line
    this.optionsList.controls.forEach((arg) => arg.get('rightAnswer').reset())
    // tslint:disable-next-line: no-string-literal
    ;(<FormArray>this.optionForm.controls['options'])
      .at(i)
      .get('rightAnswer')
      .setValue(true)
  }

  saveQuestion() {
    this.submitted = true
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
    this.answerIndexs = this.optionArray.findIndex(
      (obj) => obj.rightAnswer === true
    )
    if (this.solutionForm.controls.solutions.valid) {
      this.qstnTags = this.qstnTags.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index
      })
      const params = {
        question: this.questionForm.value.question,
        hint: this.questionForm.value.hint,
        difficulty: this.questionForm.value.difficulty,
        marks: this.questionForm.value.marks,
        negativeMarks: this.questionForm.value.negativeMarks,
        options: this.optionArray,
        noOfOptions: this.optionForm.value.options.length,
        noOfsolutions: this.solutionForm.value.solutions.length,
        noOfbestSolutions: this.solutionForm.value.bestSolutions.length,
        solutions: this.solutionArray,
        bestSolutions: this.bestSolutionsArray,
        answerIndex: this.answerIndexs,
        qstnTags: this.qstnTags,
        subqstnTags: this.subqstnTags,
      }
      const objResultExam = this.practiceService.addQuestions(
        params,
        this.practiceKey
      )
      this.practiceService.saveQuestionTags(this.tagsToSave)
      this.practiceService.saveSubQuestionTags(this.subtagsToSave)
      this.toastr.show(APP_MESSAGE.EXAM.qstn_create, false)
      this.submitted = false
      this.router.navigate(['/list-questions/view'], {
        queryParams: {
          practicekeys: this.practiceKey,
          practiceInChapterKeys: this.practiceInChapterKey,
          chapterkey: this.chapterKeys,
          weightage: this.weightage,
          qstnPageNo: this.qstnPageNo,
          pageNo: this.pageNo, 
          itemsPerPage: this.itemsPerPage,
          qstitemsPerPage: this.qstitemsPerPage
        },
      })
    }
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
    });
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
    });

    if (this.questionForm.valid) {
      this.submitted = false
    } else {
      this.submitted = true
    }
  }
  // function to check option validations
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
  getRandomQuestions() {
    $('#showRandomQuestionModel').modal('show')
    this.selectRandomQuestions = true
    // function to get exam details based on a particular exam
    this.examData = {
      examNames: this.practiceNames,
      totalNoOfQuestions: this.totalNoOfQuestions,
      categoryName: this.categoryNames,
      subCategoryNames: this.subCategoryNames,
      marks: this.marks,
      negativeMarks: this.negativeMarks,
      weightage: this.weightage,
      QuestionBankList: this.QuestionBankList,
      QuestionList: this.QuestionList,
      categorykey: this.categorykey,
      examkey: this.examkey,
      examcategoryKey: this.examcategoryKey,
    }
  }
  randomQuestionEmitted(event) {
    this.selectRandomQuestions = event
  }
  goBack() {
    const queryParams = {
      examkey: this.examkey,
      examinCatkey: this.examcategoryKey,
      categorykey: this.categorykey,
      qstncount: this.totalNoOfQuestions,
      weightage: this.weightage,
      qstnPageNo: this.qstnPageNo,
      pageNo: this.pageNo, 
      itemsPerPage: this.itemsPerPage,
      qstitemsPerPage: this.qstitemsPerPage
    }
    this.router.navigate(['/list-questions/view'], {
      queryParams: {
        practicekeys: this.practiceKey,
        practiceInChapterKeys: this.practiceInChapterKey,
        chapterkey: this.chapterKeys,
        qstncount: this.totalNoOfQuestions,
        weightage: this.weightage,
        qstnPageNo: this.qstnPageNo,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        qstitemsPerPage: this.qstitemsPerPage
      }
    })
  }
  // for pagination
  onPageBoundsCorrection(number: number) {
    this.qbPageNo = number;
    this.toastr.show("Number exceeded page limit")
  }
  checkPageNumber(event){
    if(event.target.value && event.target.value < 1){
        this.qbPageNo = 1;
        this.toastr.show("Page number should not be less than 1");
    } else if(event.target.value === ""){
      this.qbPageNo = 1;
    } else {
      this.qbPageNo = event.target.value;
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
