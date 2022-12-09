import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { APP_MESSAGE } from '@app/core/config'
import { ExamService, ToastMessageService } from '@app/core'
import { MatStepper } from '@angular/material/stepper'
declare var $: any
import { Router } from '@angular/router'
import * as firebase from 'firebase'
//for mat chips
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete'
import { MatChipInputEvent } from '@angular/material/chips'
import { Observable } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { NgxSpinnerService } from 'ngx-spinner'
import * as _ from 'lodash'
import { values } from 'lodash';
import {  Options } from 'ng5-slider'
@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
})
export class AddQuestionComponent implements OnInit {

  difficulty: number = 0;
  Options: Options = {
    floor: 0,
    ceil: 10,
  };

  firstFormGroup: FormGroup;
  questionForm: FormGroup;
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
  Question_hint: any;
  optionss: any;
  options: any[] = [];
  optionsValues: any[] = [];
  solutionValues: any[] = [];
  bestSolutionValues: any[] = [];
  public data1: any;
  AllQuestionList: any[] = [];
  QuestionBankList: any[] = [];
  eachQuestionMarks: any[] = [];
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
  loader: boolean;
  questionMarks = 0;
  totalMarksForQuestions: number;
  validateQuestionMark: boolean;
  validateQuestionMarkMsg: string;
  negativeValidation: boolean;
  questionCategory: any;
  weightage: boolean;
  marks: any;
  negativeMarks: string;
  disabled: any = null;
  searchQuestion: string;
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
  tagsToSave: any[];
  qstnTagstoShow: any[];
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
  examData: any = {};
  hint: any = '';
  selectRandomQuestions = false;
  //for pagination of question bank
  qstPageNo: number;
  pageNo: number;
  pageNoBind: number;
  itemsPerPage: number;
  qstitemsPerPage: number;
  qbPageNo: number = 1;
  qbItemsPerPage: number = 5;
  itemsPerPageValues = [5,10,20,50,100];
  pageMaxSize: number = 10;
  //for pagination end
  questionBankAddButton = true;
  // difficulty: number=0;
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public examService: ExamService,
    public toastr: ToastMessageService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    this.checkedOrNot(this.Questions)
    this.validateQuestionMark = false
    this.setexamLevelForm()
    this.QuestionBankItemsByKey = []
    this.activatedRoute.queryParams.subscribe((params) => {
      this.categorykey = params.categorykey
      this.examkey = params.examkey
      this.examcategoryKey = params.examcategoryKey
      this.qstncount = params.qstncounts
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      this.qstPageNo = params.qstPageNo;
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
    );
    this.filteredsubqstnTags = this.subqstnTagsCtrl.valueChanges.pipe(
      startWith(null),
      map((qstnTag: string | null) =>
        qstnTag ? this._filterSubTag(qstnTag) : this.subTagfilteredList
      )
    );
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
    this.questionBankForm = this.formBuilder.group({
      questionId: [''],
    })
    this.optionForm = this.formBuilder.group({
      options: this.formBuilder.array([this.addFormgroup()]),
    })
    this.solutionForm = this.formBuilder.group({
      solutions: this.formBuilder.array([this.addFormgroupSolutions()]),
      bestSolutions: this.formBuilder.array([this.addFormgroupBestSolutions()]),
    })
    this.getExamDetails();
    this.getAllQuestions();
    this.getAllCategories();
    this.getAllQuestionBankItems();
    this.getAllQuestionTags();
    this.getAllQuestionSubTags();
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
        this.totalMarksForQuestions = Number(this.QuestionList.reduce((a, {marks}) => a + Number(marks), 0));
      }
    })
  }

  checkTotalMark() {
    const markToCompare = Number(this.questionForm.value.marks) + this.totalMarksForQuestions;
    // console.log("Number(this.questionForm.value.marks",Number(this.questionForm.value.marks))
    // console.log("this.totalMarksForQuestions",this.totalMarksForQuestions)
    // console.log("markToCompare",markToCompare)
    // console.log("this.totalMark",this.totalMark)
    // const marks = this.questionForm.value.marks ? this.questionForm.value.marks : this.marks;
    if (this.totalMark < markToCompare) {
      this.validateQuestionMark = true
      this.validateQuestionMarkMsg = 'Marks should not be greater than total mark'
      this.submitted = true
    } else {
      const questionCount = this.QuestionList.length + 1
      const marksQuestions =
        (this.totalMarksForQuestions || 0) +
        parseInt(this.questionForm.value.marks, 10)
      if (marksQuestions > this.totalMark) {
        this.validateQuestionMark = true
        this.validateQuestionMarkMsg =
          'Total marks is not sufficient for creating additional questions'
        this.submitted = true
      } else {
        if (
          questionCount < this.totalNoOfQuestions &&
          this.totalMark <= marksQuestions
        ) {
          this.validateQuestionMark = true
          this.validateQuestionMarkMsg =
            'Total marks is not sufficient for creating additional questions'
          this.submitted = true
        } else {
          this.validateQuestionMark = false
          this.questionForm.value.marks = this.questionForm.value.marks
        }
      }

      /* const enteredMark =  Number(this.updateExamForm.value.totalMark);
         if(questionCount < this.updateExamForm.value.totalNoOfQuestions &&  questionsMark >= enteredMark){
          this.toastr.show("Total marks is not sufficient for creating additional questions", true);
          return false;
         }*/
    }
  }

  getExamDetails() {
    this.examService.getExamDetails(
      this.categorykey,
      this.examkey,
      this.examcategoryKey
    ).on('value', (snapshot) => {
      const objExamres = snapshot.val()
      this.examNames = objExamres.examName
      this.examDuration = objExamres.examDuration
      this.passMark = objExamres.passMark
      this.totalMark = objExamres.totalMark
      this.totalNoOfQuestions = objExamres.totalNoOfQuestions
      this.categoryName = objExamres.categoryName
      this.levelName = objExamres.levelName
      this.marks = ''
      this.negativeMarks = ''
      if (objExamres.same_weightage) {
        this.weightage = objExamres.same_weightage
        this.marks = objExamres.marks
        this.negativeMarks = objExamres.negativeMarks
      }
    })
  }
  addOptions() {
    // function to push optionList items
    this.optionsList.push(this.addFormgroup())
  }
  addFormgroup() {
    // intialize option form array
    return this.formBuilder.group({
      option: ['', Validators.required],
      rightAnswer: [''],
    })
  }
  get optionsList() {
    // function to get optionList Items
    return <FormArray>this.optionForm.get('options')
  }
  removeArrayForms(index) {
    // function to remove formarray
    this.optionsList.removeAt(index)
  }

  addSolutions() {
    // function to push solutionList items
    this.solutionList.push(this.addFormgroupSolutions())
  }

  addFormgroupSolutions() {
    // intialize solution form array
    return this.formBuilder.group({
      solution: [''],
    })
  }
  get solutionList() {
    // function to get solutionList Items
    return this.solutionForm.get('solutions') as FormArray
  }
  removeSolutionArrayForms(index) {
    // function to remove solution formarray
    this.solutionList.removeAt(index)
  }
  addBestSolutions() {
    // function to push bestSolutionList items
    this.bestSolutionList.push(this.addFormgroupBestSolutions())
  }
  addFormgroupBestSolutions() {
    // intialize best solution form array
    return this.formBuilder.group({
      solution: [''],
    })
  }
  get bestSolutionList() {
    // function to get best solutionList Items
    return this.solutionForm.get('bestSolutions') as FormArray
  }
  removeBestSolutionArrayForms(index) {
    // function to remove best solution formarray
    this.bestSolutionList.removeAt(index)
  }
  getDataFromQuestionBank(qstnId) {
    return firebase
      .database()
      .ref('questionbank')
      .orderByChild('QID')
      .equalTo(qstnId)
  }
  getQuestionsById() {
    // function to get questions details based on question Id
    this.loader = true
    this.qstnId = this.questionBankForm.value.questionId
    this.getDataFromQuestionBank(this.qstnId)
    .on('value', (snapshot) => {
      this.QuestionList = snapshot.val();
      if (this.QuestionList === undefined || this.QuestionList === null) {
        this.toastr.show(APP_MESSAGE.UPLOAD_Excel.get_excel_data)
        this.loader = false
        this.QuestionBankItems = []
        this.questionForm.reset()
      } else {
        // setTimeout(() => {
        this.QuestionBankItems = []
        Object.entries(this.QuestionList).forEach(([key, value]) => {
          /* tslint:disable */
          const options = value['Options']
          const bestsolutions = value['Best_Solutions']
          const solutions = value['Solutions']
          this.QuestionBankItems.push({
            QID: value['QID'],
            Right_Answer: value['Right_Answer'],
            Question: value['Question'],
            Quest_Hint: value['Quest_Hint'],
            options: value['Options'],
            Option1: options['Option1'],
            Option2: options['Option2'],
            Option3: options['Option3'],
            Option4: options['Option4'],
            Option5: options['Option5'],
            bestsolutions: value['Best_Solutions'],
            Solution1: solutions['Solution1'],
            Solution2: solutions['Solution2'],
            Solution3: solutions['Solution3'],
            Solution4: solutions['Solution4'],
            Solution5: solutions['Solution5'],
            Best_Solutions1: bestsolutions['Best_Solution1'],
            Best_Solutions2: bestsolutions['Best_Solution2'],
            Best_Solutions3: bestsolutions['Best_Solution3'],
            solutions: value['Solutions'],
            qstnTags: value['qstnTags'],
            subqstnTags: value['subqstnTags'],
            marks: value['marks'] ? value['marks'] : 1,
            negativeMarks: value['negativeMarks'] ? value['negativeMarks'] : 0,
            difficulty: value['difficulty'] ? value['difficulty'] : 0
          })
          this.loader = false
          if (
            this.QuestionBankItems[0].Option1 !== '' &&
            this.QuestionBankItems[0].Right_Answer === '1'
          ) {
            this.options1 = {
              option: this.QuestionBankItems[0].Option1,
              rightAnswer: true,
            }
          } else {
            this.options1 = {
              option: this.QuestionBankItems[0].Option1,
              rightAnswer: false,
            }
          }
          if (
            this.QuestionBankItems[0].Option2 !== '' &&
            this.QuestionBankItems[0].Right_Answer === '2'
          ) {
            this.options2 = {
              option: this.QuestionBankItems[0].Option2,
              rightAnswer: true,
            }
          } else {
            this.options2 = {
              option: this.QuestionBankItems[0].Option2,
              rightAnswer: false,
            }
          }
          if (
            this.QuestionBankItems[0].Option3 !== '' &&
            this.QuestionBankItems[0].Right_Answer === '3'
          ) {
            this.options3 = {
              option: this.QuestionBankItems[0].Option3,
              rightAnswer: true,
            }
          } else {
            this.options3 = {
              option: this.QuestionBankItems[0].Option3,
              rightAnswer: false,
            }
          }
          if (
            this.QuestionBankItems[0].Option4 !== '' &&
            this.QuestionBankItems[0].Right_Answer === '4'
          ) {
            this.options4 = {
              option: this.QuestionBankItems[0].Option4,
              rightAnswer: true,
            }
          } else {
            this.options4 = {
              option: this.QuestionBankItems[0].Option4,
              rightAnswer: false,
            }
          }
          if (
            this.QuestionBankItems[0].Option5 !== '' &&
            this.QuestionBankItems[0].Right_Answer === '5'
          ) {
            this.options5 = {
              option: this.QuestionBankItems[0].Option5,
              rightAnswer: true,
            }
          } else {
            this.options5 = {
              option: this.QuestionBankItems[0].Option5,
              rightAnswer: false,
            }
          }

          this.solution1 = {
            solution: this.QuestionBankItems[0].Solution1,
          }
          this.solution2 = {
            solution: this.QuestionBankItems[0].Solution2,
          }
          this.solution3 = {
            solution: this.QuestionBankItems[0].Solution3,
          }
          this.solution4 = {
            solution: this.QuestionBankItems[0].Solution4,
          }
          this.solution5 = {
            solution: this.QuestionBankItems[0].Solution5,
          }

          this.bestsolution1 = {
            solution: this.QuestionBankItems[0].Best_Solutions1,
          }
          this.bestsolution2 = {
            solution: this.QuestionBankItems[0].Best_Solutions2,
          }
          this.bestsolution3 = {
            solution: this.QuestionBankItems[0].Best_Solutions3,
          }
          this.Question = this.QuestionBankItems[0].Question;
          this.marks = this.QuestionBankItems[0].marks;
          this.negativeMarks = this.QuestionBankItems[0].negativeMarks;
          this.difficulty = this.QuestionBankItems[0].difficulty;
          this.Question_hint = this.QuestionBankItems[0].Quest_Hint;
          if (this.options5.option === '') {
            this.optionsValues = [
              this.options1,
              this.options2,
              this.options3,
              this.options4,
            ]
          } else if (
            this.options1.option !== '' &&
            this.options2.option !== '' &&
            this.options3.option !== '' &&
            this.options4.option !== '' &&
            this.options5.option !== ''
          ) {
            this.optionsValues = [
              this.options1,
              this.options2,
              this.options3,
              this.options4,
              this.options5,
            ]
          } else if (
            this.options1.option !== '' &&
            this.options2.option !== '' &&
            this.options3.option === '' &&
            this.options4.option === '' &&
            this.options5.option === ''
          ) {
            this.optionsValues = [this.options1, this.options2]
          } else if (
            this.options1.option !== '' &&
            this.options2.option !== '' &&
            this.options3.option !== '' &&
            this.options4.option === '' &&
            this.options5.option === ''
          ) {
            this.optionsValues = [this.options1, this.options2, this.options3]
          } else if (
            this.options1.option !== '' &&
            this.options2.option !== '' &&
            this.options3.option !== '' &&
            this.options4.option !== '' &&
            this.options5.option === ''
          ) {
            this.optionsValues = [
              this.options1,
              this.options2,
              this.options3,
              this.options4,
            ]
          }
          if (
            this.solution1.solution !== '' &&
            this.solution2.solution === '' &&
            this.solution3.solution === '' &&
            this.solution4.solution === '' &&
            this.solution5.solution === ''
          ) {
            this.solutionValues = [this.solution1]
          } else if (
            this.solution1.solution !== '' &&
            this.solution2.solution !== '' &&
            this.solution3.solution === '' &&
            this.solution4.solution === '' &&
            this.solution5.solution === ''
          ) {
            this.solutionValues = [this.solution1, this.solution2]
          } else if (
            this.solution1.solution !== '' &&
            this.solution2.solution !== '' &&
            this.solution3.solution !== '' &&
            this.solution4.solution === '' &&
            this.solution5.solution === ''
          ) {
            this.solutionValues = [
              this.solution1,
              this.solution2,
              this.solution3,
            ]
          } else if (
            this.solution1.solution !== '' &&
            this.solution2.solution !== '' &&
            this.solution3.solution !== '' &&
            this.solution4.solution !== '' &&
            this.solution5.solution === ''
          ) {
            this.solutionValues = [
              this.solution1,
              this.solution2,
              this.solution3,
              this.solution4,
            ]
          } else if (
            this.solution1.solution !== '' &&
            this.solution2.solution !== '' &&
            this.solution3.solution !== '' &&
            this.solution4.solution !== '' &&
            this.solution5.solution !== ''
          ) {
            this.solutionValues = [
              this.solution1,
              this.solution2,
              this.solution3,
              this.solution4,
              this.solution5,
            ]
          }
          if (
            this.bestsolution1.solution !== '' &&
            this.bestsolution2.solution === '' &&
            this.bestsolution3.solution === ''
          ) {
            this.bestSolutionValues = [this.bestsolution1]
          } else if (
            this.bestsolution1.solution !== '' &&
            this.bestsolution2.solution !== '' &&
            this.bestsolution3.solution === ''
          ) {
            this.bestSolutionValues = [this.bestsolution1, this.bestsolution2]
          } else if (
            this.bestsolution1.solution !== '' &&
            this.bestsolution2.solution !== '' &&
            this.bestsolution3.solution !== ''
          ) {
            this.bestSolutionValues = [
              this.bestsolution1,
              this.bestsolution2,
              this.bestsolution3,
            ]
          } else if (
            this.bestsolution1.solution === '' &&
            this.bestsolution2.solution === '' &&
            this.bestsolution3.solution === ''
          ) {
            this.bestSolutionValues = []
          }
          this.optionss = this.QuestionBankItems[0].options
          this.optionForm.setControl(
            'options',
            this.setReturnItems(this.optionsValues)
          )
          this.solutionForm.setControl(
            'solutions',
            this.setReturnSolutions(this.solutionValues)
          )
          this.solutionForm.setControl(
            'bestSolutions',
            this.setReturnBestSolution(this.bestSolutionValues)
          )
        })
      }
    })
  }
  setReturnItems(optionsArray: any[]): FormArray {
    const formArray = new FormArray([])
    optionsArray.forEach((optionelement) => {
      formArray.push(
        this.formBuilder.group({
          option: [optionelement.option, [Validators.required]],
          rightAnswer: [optionelement.rightAnswer, [Validators.required]],
        })
      )
    })
    return formArray
  }
  setReturnSolutions(SolutionArray: any[]): FormArray {
    const formArray = new FormArray([])
    SolutionArray.forEach((solutionelement) => {
      formArray.push(
        this.formBuilder.group({
          solution: [solutionelement.solution, [Validators.required]],
        })
      )
    })
    return formArray
  }
  setReturnBestSolution(bestSolutionArray: any[]): FormArray {
    const formArray = new FormArray([])
    bestSolutionArray.forEach((optionelement) => {
      formArray.push(
        this.formBuilder.group({
          solution: [optionelement.solution, [Validators.required]],
        })
      )
    })
    return formArray
  }
  getAllQuestionBankItems() {
    // function to get all questions from question bank
    this.QuestionBankList = []
    this.examService.getAllQuestionList().subscribe((list) => {
      this.AllQuestionList = list.map((item) => {
        // this.isDataLoaded = true
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      /* tslint:disable */
      this.AllQuestionList.forEach((question) => {
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
            subqstnTags: question.subqstnTags,
            marks: question.marks ? question.marks : 1,
            negativeMarks: question.negativeMarks ? question.negativeMarks : 0,
            difficulty: question.difficulty ? question.difficulty : 0
          });
        }
      }); 
      this.allQuestionBankList = this.QuestionBankList
    })
  }
  onGetAllQuestionBankItems() {
    this.getAllQuestionBankItems();
    $('#showQuestionModal').modal('show')
  }
  getQuestionByKey(items, e, indx) {
    if (e.target.checked === true) {
      this.questionitems.push(items)
      const totalCountOfQuestions = this.questionitems.length + this.QuestionList.length
      if (totalCountOfQuestions > this.totalNoOfQuestions) {
        this.toastr.show('The questions exceeds the limit allowed', true);
        this.questionBankAddButton = true;
      } else {
        this.questionBankAddButton = false;
      }
    } else {
      this.questionitems.splice(indx, 1)
      const totalCountOfQuestions = this.questionitems.length + this.QuestionList.length;
      if (totalCountOfQuestions > this.totalNoOfQuestions) {
        this.questionBankAddButton = true;
      } else {
        this.questionBankAddButton = false;
      }
    }
  }
  setexamLevelForm() {
    // initialize exam level form
    this.categoryForm = this.formBuilder.group({
      categoryName: [''],
    })
  }

  getAllCategories() {
    // function to get all published categories
    this.examService.getAllPublishedCategories().then((list) => {
      list.on('value', (snapshot) => {
        const data = snapshot.val()
        Object.entries(data).forEach(([datakey, datavalue]) => {
          this.categoryList.push({
            $key: datakey,
            // tslint:disable-next-line: no-string-literal
            categoryName: datavalue['categoryName'],
          })
        });
        this.categoryList = _.orderBy(
          this.categoryList,
          [(data) => data.categoryName?.toLowerCase()],
          'asc'
        );
        this.categoryList.unshift({ $key: '', categoryName: 'Select main topic' })
        this.questionCategory = this.categoryList[0]
      })
    })
  }
  resetFilter() {
    this.searchQuestion = '';
    this.categoryForm.value.categoryName = '';
    this.questionCategory = this.categoryList[0];
    this.getAllQuestionBankItems();
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
        this.marks = element.marks ? element.marks : 1;
        this.difficulty = element.difficulty ? element.difficulty : 0;
        this.negativeMarks = element.negativeMarks ? element.negativeMarks : 0;
        this.Quest_Hints = element.Quest_Hint
        if (element.qstnTags) {
          this.qstnTags = element.qstnTags
        }
        if (element.qstnTags) {
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
        this.examService.addQuestions(params, this.examkey)
        .then(()=>{
          this.searchQuestion = '';
          this.categoryForm.value.categoryName = '';
          this.questionCategory = this.categoryList[0];
          this.router.navigate(['/manage-exam/view-questions'], {
            queryParams: {
              examkey: this.examkey,
              examinCatkey: this.examcategoryKey,
              categorykey: this.categorykey,
              qstncount: this.totalNoOfQuestions,
              weightage: this.weightage,
              qstPageNo: this.qstPageNo,
              pageNo: this.pageNo, 
              itemsPerPage: this.itemsPerPage,
              qstitemsPerPage: this.qstitemsPerPage
            }
          });
        });
      });
    }
  }

  cancel() {
    this.allQuestionBankList = []
    this.questionitems = []
    this.searchQuestion = '';
    this.categoryForm.value.categoryName = '';
    this.questionCategory = this.categoryList[0];
    $('#showQuestionModal').modal('hide')
  }
  // function to check one right answer
  checkRightAnswer(event, i) {
    /* tslint:disable */
    this.optionsList.controls.forEach((arg) => arg.get('rightAnswer').reset())
    ;(<FormArray>this.optionForm.controls['options'])
      .at(i)
      .get('rightAnswer')
      .setValue(true)
  }

  saveQuestion() {
    // function to add questions

    this.isPublished = false
    this.submitted = true
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
      //filter for duplicated values in main tags
      // this.qstnTags = this.qstnTags.filter( function( item, index, inputArray ) {
      //   return inputArray.indexOf(item) == index;
      // });
      //filter for duplicated values in main tags
      // this.subqstnTags = this.subqstnTags.filter(function (
      //   item,
      //   index,
      //   inputArray
      // ) {
      //   return inputArray.indexOf(item) == index
      // })
      if (this.questionForm.value.hint === 'undefined') {
        this.hint = this.questionForm.value.hint
      }
      const params = {
        question: this.questionForm.value.question,
        hint: this.hint,
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
      const objResultExam = this.examService.addQuestions(params, this.examkey)
      this.examService.saveQuestionTags(this.tagsToSave)
      this.examService.saveSubQuestionTags(this.subtagsToSave)
      this.toastr.show(APP_MESSAGE.EXAM.qstn_create, false)
      this.submitted = false
      this.router.navigate(['/manage-exam/view-questions'], {
        queryParams: {
          examkey: this.examkey,
          examinCatkey: this.examcategoryKey,
          categorykey: this.categorykey,
          qstncount: this.totalNoOfQuestions,
          weightage: this.weightage,
          qstPageNo: this.qstPageNo,
          pageNo: this.pageNo, 
          itemsPerPage: this.itemsPerPage,
          qstitemsPerPage: this.qstitemsPerPage
        },
      })
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
      if (this.validateQuestionMark === false) {
        this.submitted = false
      } else {
        this.submitted = true
      }
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
  goBack() {
    this.router.navigate(['/manage-exam/view-questions'], {
      queryParams: {
        examkey: this.examkey,
        examinCatkey: this.examcategoryKey,
        categorykey: this.categorykey,
        qstncount: this.totalNoOfQuestions,
        weightage: this.weightage,
        qstPageNo: this.qstPageNo,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        qstitemsPerPage: this.qstitemsPerPage
      },
    })
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
  getRandomQuestions() {
    $('#showRandomQuestionModel').modal('show')
    this.selectRandomQuestions = true
    // function to get exam details based on a particular exam
    this.examData = {
      examNames: this.examNames,
      examDuration: this.examDuration,
      passMark: this.passMark,
      totalMark: this.totalMark,
      totalNoOfQuestions: this.totalNoOfQuestions,
      categoryName: this.categoryName,
      levelName: this.levelName,
      difficulty: this.difficulty,
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
}