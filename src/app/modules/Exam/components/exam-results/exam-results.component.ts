import { DataSource } from '@angular/cdk/collections'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ExamService, ToastMessageService } from '@app/core'
import * as firebase from 'firebase'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss'],
})
export class ExamResultsComponent implements OnInit {
  examParams: any
  examDetails: any = null
  examResults: any = []
  isLoaded = false
  // for pagination
  pageNo: number;
  resPageNo: number = 1;
  pageNoBind: number;
  publishWarning: string
  pageMaxSize: number = 10;
  itemsPerPage: number;
  resItemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    public toastr: ToastMessageService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.examParams = params;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
    })
  }
  ngOnInit(): void {
    this.loadExamResults()
  }

  loadExamResults(): void {
    // Load Exam Details
    const ref = this
    this.getExamDetails({})
    this.examService.getExamDetails_v2(this.examParams).then((data) => {
      data.once('value', (snapshot) => {
        const refata = snapshot.val()
        ref.getExamDetails(refata)
      })
    })
  }

  getExamDetails(data) {
    if (data) {
      // Get Exam results;
      this.examDetails = data
      this.getExamResults()
    } else {
      // Toaster message
      this.toastr.show('Requested exam details not found', true)
      // Redirect to Exam page
      this.router.navigate(['/exam'], {
        queryParams: {
          pageNo: this.pageNo, 
          itemsPerPage: this.itemsPerPage
        }
      })
    }
  }
  getExamResults() {
    const ref = this
    this.examService.getExamResults(this.examParams.examkey).then((data) => {
      data.once('value', (snapshot) => {
        const datasource = snapshot.val()
        ref.formatExamResults(datasource)
      })
    })
  }

  formatExamResults(datasource) {
    const results: any = datasource ? Object.values(datasource) : []
    this.examResults = results.sort((a, b) =>
      a.totalMarksScored < b.totalMarksScored ? 1 : -1
    )
    this.isLoaded = true
  }

  goToBack(): void {
    this.router.navigate(['/exam'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      }
    })
  }
  downloadExamResults() {
    const data = this.formatToCSVOrExcel()
    this.exportAsExcelFile(data)
  }
  formatToCSVOrExcel() {
    const data = this.examResults.map((itm) => {
      return {
        Name: itm.userName,
        Mobile: ' ' + this.getString(itm.mobNumber, true) + ' ',
        'Total Marks': this.getString(itm.totalMarksofExam),
        Scored: this.getString(itm.totalMarksScored),
        'Total Questions': this.getString(itm.totalQuestions),
        Attended: this.getString(itm.totalAttended),
        'Right Answers': this.getString(itm.totalRightAnswers),
        'Wrong Answers': this.getString(itm.totalWrongAnswers),
        'Skipped Questions': this.getString(itm.totalSkiped),
        Result: itm.passed ? 'Passed' : 'Failed',
      }
    })
    return data
  }
  getString(elem, isText = false) {
    return (elem || (isText ? '' : '0')).toString()
  }
  exportAsExcelFile(json: any[]): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(
      wb,
      `${this.examDetails.categoryName}_${this.examDetails.examName}.xlsx`
    )
  }
  exportAsCSV(data) {
    const replacer = (key, value) => (value === null ? '' : value) // specify how you want to handle null values here
    const header = Object.keys(data[0])
    const csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    )
    csv.unshift(header.join(','))
    const csvArray = csv.join('\r\n')

    const a = document.createElement('a')
    const blob = new Blob([csvArray], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)

    a.href = url
    a.download = `${this.examDetails.categoryName}_${this.examDetails.examName}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
  }


  onPageBoundsCorrection(number: number) {
    this.resPageNo = number;
    this.toastr.show("Number exceeded page limit")
  }
  checkPageNumber(event){
    if(event.target.value && event.target.value < 1){
        this.resPageNo = 1;
        this.toastr.show("Page number should not be less than 1");
    } else if(event.target.value === ""){
      this.resPageNo = 1;
    } else {
      this.resPageNo = event.target.value;
    }
  }
}
