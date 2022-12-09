import { Component, OnInit } from '@angular/core'
import {
  ToastMessageService,
  MainTopicService,
  UploadExcelService,
  ExamService,
} from '@app/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup } from '@angular/forms'
import * as _ from 'lodash'
import { APP_MESSAGE } from '@app/core/config'
import * as firebase from 'firebase'
import * as XLSX from 'xlsx'
import { NgxSpinnerService } from 'ngx-spinner'
declare var $: any
@Component({
  selector: 'app-add-excel-file',
  templateUrl: './add-excel-file.component.html',
  styleUrls: ['./add-excel-file.component.scss'],
})
export class AddExcelFileComponent implements OnInit {
  excelForm: FormGroup;
  MainTopicList: any[];
  subCategoryList: any[];
  subCategories: any;
  json: string;
  loading: boolean;
  length: any;
  datUsed: any;
  questionsExist: boolean;
  questionAdded: boolean;
  categoryName: any;
  categoryKey: any;
  selectedCategoryKey: any;
  excelData: unknown[];
  BestSolution1: any;
  BestSolution2: any;
  BestSolution3: any;
  Option1: any;
  Option2: any;
  Option3: any;
  Option4: any;
  Option5: any;
  QID: any;
  QuestHint: any;
  Question: any;
  RightAnswer: any;
  Solution1: any;
  Solution3: any;
  Solution2: any;
  Solution4: any;
  Solution5: any;
  categorykey: any;
  categorykeys: any;
  catKey: any;
  filename: File;
  objQuestionres: any;
  QuestionList: any;
  QuestionBankItems: any[] = [];
  items: any[];
  questionUploaded: boolean;
  files: any[] = [];
  RightAnswers: any;
  loader: boolean;
  qstnTagsArray: any[];
  subqstnTagsArray: any[];
  qstnTagstoShow: any[] = [];
  qstnTagsFromDb: any[];
  subqstnTagsFromDb: any[];
  subqstnTagstoShow: any[] = [];
  marks: number;
  negativeMarks: number;
  difficulty: any
  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastMessageService,
    public mainTopicService: MainTopicService,
    public formbuilder: FormBuilder,
    public uploadExcelService: UploadExcelService,
    public examService: ExamService,
    private spinner: NgxSpinnerService,
  ) {
    this.json = ''
    this.questionUploaded = false
    this.questionAdded = false
    this.setExcelForm()
  }

  ngOnInit(): void {
    this.getMainTopicList();
    this.getAllQuestionTags();
    this.getAllQuestionSubTags();
  }
  setExcelForm() {
    this.excelForm = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
    })
  }
  // function to get all categories
  getMainTopicList() {
    this.mainTopicService.getMainTopics().subscribe((list) => {
      const MainTopicList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      });
      this.MainTopicList = _.orderBy(
        MainTopicList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
    })
  }
  // function to add questions into question bank
  AddQuestion(excelData) {
    console.log('excel data',excelData)
    this.categoryName = this.excelForm.value.categoryName.categoryName
    this.categorykey = this.excelForm.value.categoryName.$key
    if (excelData) {
      excelData.forEach((elements) => {
        this.BestSolution1 = this.FilterData(elements.Best_Solution1);
        this.BestSolution2 = this.FilterData(elements.Best_Solution2);
        this.BestSolution3 = this.FilterData(elements.Best_Solution3);
        this.Option1 = this.FilterData(elements.Option1);
        this.Option2 = this.FilterData(elements.Option2);
        this.Option3 = this.FilterData(elements.Option3);
        this.Option4 = this.FilterData(elements.Option4);
        this.Option5 = this.FilterData(elements.Option5);
        this.QID = this.FilterData(elements.QID);
        this.QuestHint = this.FilterData(elements.Quest_Hint);
        this.Question = this.FilterData(elements.Question);
        this.QID = this.FilterData(elements.QID);
        this.RightAnswers = this.FilterData(elements.Right_Answer);
        this.RightAnswer = this.RightAnswers.toString();
        this.Solution1 = this.FilterData(elements.Solution1);
        this.Solution2 = this.FilterData(elements.Solution2);
        this.Solution3 = this.FilterData(elements.Solution3);
        this.Solution4 = this.FilterData(elements.Solution4);
        this.Solution5 = this.FilterData(elements.Solution5);
        this.marks = this.FilterData(elements.marks);
        this.negativeMarks = this.FilterData(elements.negativeMarks);
        this.difficulty = this.FilterData(elements.difficulty);
        this.qstnTagsArray = []
        if (this.FilterData(elements.Question_tag_main) !== '') {
          this.qstnTagsArray = this.FilterData(elements.Question_tag_main).split(
            ','
          )
        }
        this.subqstnTagsArray = []
        if (this.FilterData(elements.Question_tag_sub) !== '') {
          this.subqstnTagsArray = this.FilterData(elements.Question_tag_sub).split(
            ','
          )
        }
        if((this.qstnTagsArray.length > 1) || (this.subqstnTagsArray.length > 1)){
          this.toastr.show(
            'Only one tag is accepted for both main and sub tag fields, Upload failed',
            true
          )
        } else {
          const params = {
            QID: this.QID,
            Question: this.Question,
            QuestHint: this.QuestHint,
            Option1: this.Option1,
            Option2: this.Option2,
            Option3: this.Option3,
            Option4: this.Option4,
            Option5: this.Option5,
            RightAnswer: this.RightAnswer,
            Solution1: this.Solution1,
            Solution2: this.Solution2,
            Solution3: this.Solution3,
            Solution4: this.Solution4,
            Solution5: this.Solution5,
            BestSolution1: this.BestSolution1,
            BestSolution2:this.BestSolution2,
            BestSolution3: this.BestSolution3,
            categorykey: this.categorykey,
            categoryName: this.categoryName,
            qstnTagsArray: this.qstnTagsArray,
            subqstnTagsArray: this.subqstnTagsArray,
            marks: this.marks,
            negativeMarks: this.negativeMarks,
            difficulty: this.difficulty
          }
          const objResultExam = this.uploadExcelService.addExcelFile(params)
          if(objResultExam){
            this.toastr.show(APP_MESSAGE.UPLOAD_Excel.excel_upload, false)
            this.questionAdded = false
            this.questionUploaded = false
          } else {
            this.toastr.show(
              'Uploading failed. Check the excel file data in correct format',
              true
            )
            this.questionAdded = false
            this.questionUploaded = false
          }
          
        }
      })
    } else {
      this.toastr.show(
        'Uploading failed. Check the excel file data in correct format',
        true
      )
      this.questionAdded = false
      this.questionUploaded = false
    }
  }
  // function to insert null('') value if any one of the filed in the excel data empty
  FilterData(value) {
    if (value === '' || value === undefined) {
      const datas = ''
      return datas
    } else {
      return value
    }
  }
  // function to read excel data when we drop the excel file
  onFileDropped(evt) {
    const target: DataTransfer = <DataTransfer>evt.target
    this.filename = target.files[0]
    if (target.files.length !== 1) {
      // throw new Error('Cannot use multiple files')
      this.toastr.show('Cannot upload multiple file', true)
      return
    }
    const ext = this.filename.name.split('.').pop().toLowerCase()
    if (ext !== 'xlsx' && ext !== 'xls') {
      this.toastr.show('Select an excel file to upload', true)
      return
    }
    const reader: FileReader = new FileReader()
    reader.onload = (e: any) => {
      const bstr: string = e.target.result
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' })
      const wsname: string = wb.SheetNames[0]
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]
      this.excelData = XLSX.utils.sheet_to_json(ws, { header: 2 })
    }
    reader.readAsBinaryString(target.files[0])
    this.questionAdded = true
  }
  // function to read excel data when we browse the excel file
  fileBrowseHandler(evt) {
    const target: DataTransfer = <DataTransfer>evt.target
    this.filename = target.files[0]
    if (target.files.length !== 1) {
      this.toastr.show('Cannot upload multiple file', true)
      return
    }
    const ext = this.filename.name.split('.').pop().toLowerCase()
    if (ext !== 'xlsx' && ext !== 'xls') {
      this.toastr.show('Select an excel file to upload', true)
      return
    }

    const reader: FileReader = new FileReader()
    reader.onload = (e: any) => {
      const bstr: string = e.target.result
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' })
      const wsname: string = wb.SheetNames[0]
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]
      this.excelData = XLSX.utils.sheet_to_json(ws, { header: 2 })
    }
    reader.readAsBinaryString(target.files[0])
    this.questionUploaded = true
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes'
    }
    const k = 1024
    const dm = decimals <= 0 ? 0 : decimals || 2
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  // function to get questions from question bank based on category
  changeCategory() {
    this.spinner.show();
    this.QuestionBankItems = []
    this.categoryName = this.excelForm.value.categoryName
    this.categoryKey = this.excelForm.value.categoryName.categoryKey
    this.catKey = this.excelForm.value.categoryName.$key
    this.uploadExcelService.getDataFromQuestionBank(this.catKey)
    .on('value', (snapshot) => {
      this.spinner.hide();
      this.QuestionList = snapshot.val();
      this.QuestionBankItems = []
      if (this.QuestionList) {
        /* tslint:disable */
        Object.entries(this.QuestionList).forEach(([key, value]) => {
          const options = value['Options']
          const bestsolutions = value['Best_Solutions']
          const solutions = value['Solutions']
          this.QuestionBankItems = []
          this.QuestionBankItems.push({
            QID: value['QID'],
            Question: value['Question'],
            Quest_Hint: value['Quest_Hint'],
            Option1: options['Option1'],
            Option2: options['Option2'],
            Option3: options['Option3'],
            Option4: options['Option4'],
            Option5: options['Option5'],
            Right_Answer: value['Right_Answer'],
            Solution1: solutions['Solution1'],
            Solution2: solutions['Solution2'],
            Solution3: solutions['Solution3'],
            Solution4: solutions['Solution4'],
            Solution5: solutions['Solution5'],
            Best_Solutions1: bestsolutions['Best_Solution1'],
            Best_Solutions2: bestsolutions['Best_Solution2'],
            Best_Solutions3: bestsolutions['Best_Solution3'],
            marks: value['marks'],
            negativeMarks: value['negativeMarks'],
            difficulty: value['difficulty']
          })
          this.items = this.QuestionBankItems
        })
      }
    })
  }
  // function to export questions into excel file
  exportTOExcel(items) {
    this.loader = true
    this.QuestionBankItems = []
    this.items = []
    if (this.QuestionList === undefined || this.QuestionList === null) {
      this.loader = false
      this.QuestionBankItems = []
      this.toastr.show(APP_MESSAGE.UPLOAD_Excel.excel_download)
    } else {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items)
      const wb: XLSX.WorkBook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
      XLSX.writeFile(wb, 'Exported List.xlsx')
      this.loader = false
      this.QuestionBankItems = []
    }
  }
  downloadTemplate(){
    const data = this.formatToCSVOrExcel();
    // let maintags: any[] = this.subqstnTagstoShow.map((items)=>{
    //   return {
    //     Main_tags: items.Main_tag,
    //     Sub_tag: items.Sub_tag
    //   }
    // })
    const maintags = this.qstnTagstoShow;
    const subtags = this.subqstnTagstoShow;
    this.exportAsExcelFile(data, maintags, subtags)
  }
  formatToCSVOrExcel() {
    const data = [{
      QID: "",
      Question: "",
      Quest_Hint: "",
      Option1: "",
      Option2: "",
      Option3: "",
      Option4: "",
      Option5: "",
      Right_Answer: "",	
      Solution1: "",
      Solution2: "",
      Solution3: "",
      Solution4: "",
      Solution5: "",
      Best_Solutions1: "",	
      Best_Solutions2: "",
      Best_Solutions3: "",
      Question_tag_main: "",
      Question_tag_sub: "",
      marks: "",
      negativeMarks: "",
      difficulty: ""
    }];
    return data;
  }
  exportAsExcelFile(json: any[], maintags: any[], subtags: any[]): void {
    const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json)
    const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(maintags)
    const ws3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(subtags)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws1, 'Sheet1')
    XLSX.utils.book_append_sheet(wb, ws2, 'Sheet2')
    XLSX.utils.book_append_sheet(wb, ws3, 'Sheet3')
    XLSX.writeFile(
      wb,
      `${'Sample_Template'}.xlsx`
    )
  }
  getAllQuestionTags() {
    this.examService.getAllQstnTags().then((result) => {
      const data = result.val();
      const qstnTagsFromDb = data.split(',');
      this.qstnTagstoShow = qstnTagsFromDb.map((items)=>{
        return {
          Main_tag: items
        }
      });
    });
  }
  getAllQuestionSubTags() {
    this.examService.getAllSubQstnTags().then((result) => {
      const data = result.val()
      this.subqstnTagsFromDb = data.split(',');
      this.subqstnTagstoShow = this.subqstnTagsFromDb.map((items)=>{
        return {
          Sub_tag: items
        }
      });
    });
  }
}