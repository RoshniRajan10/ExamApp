import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
declare var $: any
import { Router } from '@angular/router'
import { APP_MESSAGE } from '@app/core/config'
import { ToastMessageService, ExamService } from '@app/core'
import { Select2OptionData } from 'ng-select2'
import { Options } from 'select2'

@Component({
  selector: 'app-select-random-questions-by-tag',
  templateUrl: './select-random-questions-by-tag.component.html',
  styleUrls: ['./select-random-questions-by-tag.component.scss'],
})
export class SelectRandomQuestionsByTagComponent implements OnInit {
  @Output() randomQuestionEmitter = new EventEmitter<boolean>()
  @Input() examData: any
  tagPoolForm: FormGroup
  // for select 2 tags
  // for main tags
  public data: Array<Select2OptionData>
  public options: Options
  public ngSelectValue: string[]
  selectedCourse: any
  //end select 2
  selectRandomQuestions: boolean
  submitted: boolean
  // for main tags end
  // for sub tags
  public subtagdata: Array<Select2OptionData>
  public subtagoptions: Options
  public ngSelectValuesubtag: string[]
  selectedSubTag: any
  //end select 2
  // for sub tags end
  qstnTagsFromDb: any[]
  qstnTagstoShow: any[]
  subqstnTagsFromDb: any[]
  subqstnTagstoShow: any[]
  // tags end
  //for question bank
  public options1: any
  public options2: any
  public options3: any
  public options4: any
  public options5: any
  public solution1: any
  public solution2: any
  public solution3: any
  public solution4: any
  public solution5: any
  public bestsolution1: any
  public bestsolution2: any
  public bestsolution3: any
  QuestionBankItemsByKey: any[] = []
  allQuestionBankList: any[] = []
  QIDs: any
  Questions: any
  Quest_Hints: any
  questionitems: any[] = []
  rightAnswers: any
  answerIndex: number
  answerIndex1: number
  answerIndexs: number
  categoryForm: any
  loader: boolean
  questionMarks = 0
  totalMarksForQuestions: number
  validateQuestionMark: boolean
  validateQuestionMarkMsg: string
  negativeValidation: boolean
  Options: any[] = []
  optionsValues: any[] = []
  solutionValues: any[] = []
  bestSolutionValues: any[] = []
  public data1: any
  AllQuestionList: any[] = []
  QuestionBankList: any[] = []
  eachQuestionMarks: any[] = []
  qstnTags: string[] = []
  bestSolutionsArray: any[] = []
  optionArray: any[] = []
  solutionArray: any[] = []
  subqstnTags: string[]
  constructor(
    public formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastMessageService,
    public examService: ExamService
  ) {
    this.settagPoolForm()
  }

  ngOnInit(): void {
    this.getAllQuestionTags();
    this.getAllSubQuestionTags();
    this.options = {
      multiple: true,
      closeOnSelect: false,
    }
    this.subtagoptions = {
      multiple: true,
      closeOnSelect: false,
    }
  }
  cancel() {
    this.selectRandomQuestions = false
    this.randomQuestionEmitter.emit(this.selectRandomQuestions)
    $('#showRandomQuestionModel').modal('hide')
  }
  settagPoolForm() {
    this.tagPoolForm = this.formbuilder.group({
      tags: ['', Validators.required],
      subtags: [''],
      noOfQuestions: [''],
    })
  }
  getAllQuestionTags() {
    this.examService.getAllQstnTags().then((result) => {
      const data = result.val()
      this.qstnTagsFromDb = data.split(',')
      this.qstnTagstoShow = this.qstnTagsFromDb
    })
  }
  getAllSubQuestionTags() {
    this.examService.getAllSubQstnTags().then((result) => {
      const data = result.val()
      this.subqstnTagsFromDb = data.split(',')
      this.subqstnTagstoShow = this.subqstnTagsFromDb
    })
  }
  addQuestionsByTag() {
    this.submitted = true
    const tags = this.tagPoolForm.value.tags;
    const subtags = this.tagPoolForm.value.subtags
    const numberOfQuestionToAdd = this.tagPoolForm.value.noOfQuestions
    const QuestionBankList = this.examData.QuestionBankList
    let numberOfQuestions
    let QuestionBankListArray = Object.values(QuestionBankList)
    let qstnInTagPool = [];
    //filer the data by question tags
    QuestionBankListArray = QuestionBankListArray.filter(
      (item) => (item['qstnTags'] && item['subqstnTags'])
    );
    let filteredQuestionBank = QuestionBankListArray
    if(subtags === ''){
      console.log("1")
      tags.forEach((tag) => {
        filteredQuestionBank.forEach((fqb_data) => {
          if(fqb_data['qstnTags'].includes(tag)) {
            qstnInTagPool.push(fqb_data)
          }
        })
      })
    } else {
      console.log("2")
      tags.forEach((tag) => {
        subtags.forEach(subtag => {
          filteredQuestionBank.forEach((fqb_data) => {
            if((fqb_data['qstnTags'].includes(tag)) && (fqb_data['subqstnTags'].includes(subtag))) {
              qstnInTagPool.push(fqb_data)
            }
          })
        });
      })
    }
    // to filter the duplication
    qstnInTagPool = qstnInTagPool.filter(function (item, index, inputArray) {
      return inputArray.indexOf(item) === index
    })
    console.log("qstnInTagPool.length")
    console.log(qstnInTagPool.length)
    console.log("this.examData")
    console.log(this.examData)
    const existingQstCount = this.examData.QuestionList.length
    numberOfQuestions = numberOfQuestionToAdd
    if (numberOfQuestionToAdd === '') {
      numberOfQuestions = this.examData.totalNoOfQuestions - existingQstCount
    }
    if (qstnInTagPool.length === 0) {
      this.toastr.show('No questions with the given tags', true)
      this.submitted = false
    } 
    if (this.examData.totalNoOfQuestions < existingQstCount + parseInt(numberOfQuestions)) {
      this.toastr.show(
        'Number of questions exceeds the allowed number of questions',
        true
      )
      this.submitted = false
    }
    if (this.submitted) {
      const randomQuestions = this.getRandom(qstnInTagPool, numberOfQuestions)
      const qstnCountlength = randomQuestions.length
      const totalCountOfQuestions = qstnCountlength + this.examData.QuestionList.length
      randomQuestions.forEach((element) => {
        this.Questions = element.Question
        this.Quest_Hints = element.Quest_Hint
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
          difficulty: 5,
          marks: 1,
          negativeMarks: 0,
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
        const objResultExam = this.examService.addQuestions(
          params,
          this.examData.examkey
        )
        this.router.navigate(['/manage-exam/view-questions'], {
          queryParams: {
            examkey: this.examData.examkey,
            examinCatkey: this.examData.examcategoryKey,
            categorykey: this.examData.categorykey,
            qstncount: this.examData.totalNoOfQuestions,
            weightage: this.examData.weightage,
          },
        })
      })
    }
  }
  getRandom(arr, n) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len)
    if (n > len) {
      n = len;
    }
    while (n--) {
      var x = Math.floor(Math.random() * len)
      result[n] = arr[x in taken ? taken[x] : x]
      taken[x] = --len in taken ? taken[len] : len
    }
    return result
  }
}
