import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import {
  MonthService,
  ToastMessageService,
  MonthModel,
  CommonDeletePublishModal,
} from '@app/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'
import { SECTIONS } from '@app/core/utils'
declare var $: any

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
})
export class MonthComponent implements OnInit {
  noDataMsg = APP_MESSAGE.COMMON.result_not_found
  monthForm: FormGroup
  monthList: any[];
  submitted = false;
  monthItems: any;
  monthName: any;
  pageSort = 'asc';
  selectedId: any;
  isDataLoaded = false;
  isPublished: any;
  monthname: any;
  deleteItem: any;
  publishItem: any;
  unPublishItem: any;
  //for pagination
  searchMonth: any;
  pageNo: number = 1;
  pageNoBind: number;
  onSearchChange(searchKey: string): void {
    this.pageNo = 1
  }
  pageMaxSize: number = 10;
  itemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  constructor(
    public formbuilder: FormBuilder,
    private toastr: ToastMessageService,
    public monthService: MonthService,
    private spinner: NgxSpinnerService
  ) {
    this.setMonthForm()
  }

  ngOnInit(): void {
    this.getMonthList()
  }
  // function to initialize month form
  setMonthForm() {
    this.monthForm = this.formbuilder.group({
      monthname: ['', Validators.required],
    })
  }
  loadSpinner(isShow: boolean) {
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  // function to get all main topics
  getMonthList() {
    this.loadSpinner(true)
    this.monthService.getMonths().subscribe((list) => {
      this.isDataLoaded = true
      this.loadSpinner(false)
      const itemList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.monthList = itemList.filter((item => item.monthname !== " "));
      this.monthList = _.orderBy(
        this.monthList,
        [(data) => data.monthname?.toLowerCase()],
        'asc'
      );
    })
  }
  // sorting
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.monthList, this.pageSort)
  }
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.monthList, this.pageSort)
  }
  sortResult(source, sort) {
    this.monthList = _.orderBy(
      source,
      [(data) => data?.monthname?.toLowerCase()],
      sort
    )
  }
  get monthform() {
    return this.monthForm.controls
  }
  // function to add months
  addMonth() {
    this.submitted = true;
    if (this.isMonthExists('add','')) {
      let { monthname } = this.monthForm.value
      monthname = monthname.trim();
      if(monthname !== ''){
        const objMonth: MonthModel = {
          $key: '',
          monthname: monthname.charAt(0).toUpperCase() + monthname.slice(1).toLowerCase(),
          isPublished: false,
        }
        const objResult = this.monthService.manageMonth(objMonth)
        if (objMonth && this.monthForm.valid) {
          this.submitted = false
          this.toastr.show(APP_MESSAGE.MONTH.month_create, false)
          $('#showAddMonthDialog').modal('hide')
          this.monthForm.reset()
        }
      } else {
        this.toastr.show("Please enter a valid input", true)
      }
    }
  }

  resetFilter() {
    this.searchMonth = ''
  }
  // function to check whether same month exist or not
  isMonthExists(action, key) {
    const {
      valid,
      invalid,
      value: { monthname },
    } = this.monthForm;
    if(action === 'add') {
      this.monthItems = this.monthList.filter(
      (item) =>
        item.monthname.toLowerCase().replace(/\s/g, '') ===
        monthname.toLowerCase().replace(/\s/g, '')
      );
    } else if(action === 'edit') {
      if(monthname.trim() !== '') {
        this.monthItems = this.monthList.filter(
        (item) =>
          item.monthname.toLowerCase().replace(/\s/g, '') === monthname.toLowerCase().replace(/\s/g, '')
          &&
          item.$key !== key
        );
      } else {
        this.toastr.show("Please enter a valid input", true);
        return false;
      }
    }
    this.monthItems.forEach((element) => {
      this.monthName = element.monthname
    })
    if (this.monthName !== undefined) {
      if (
        this.monthForm.valid && monthname.toLowerCase().replace(/\s/g, '') === this.monthName.toLowerCase().replace(/\s/g, '')
      ) {
        this.toastr.show(APP_MESSAGE.MONTH.month_already_exist)
        return false
      }
      if (invalid) {
        return
      }
      return true
    }
    return true
  }
  onDialogClose(modalId) {
    this.submitted = false
    $('#' + modalId).modal('hide')
    this.monthForm.reset()
  }
  // function to show modal for delete month
  onDeleteMonth($key, isPublished) {
    const id = $key
    const objMonth: CommonDeletePublishModal = {
      section: SECTIONS.month,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { id, isPublished },
    }
    this.deleteItem = objMonth

    if (isPublished === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.MONTH.month_cant_delete)
    }
  }
  // function to show modal for update month
  onUpdateMonth($key, monthname, isPublished) {
    this.selectedId = $key;
    this.monthname = monthname;
    this.isPublished = false;
    $('#showUpdateMonthDialog').modal('show')
    this.monthForm.controls.monthname.setValue(monthname)
  }
  // function to update month
  updateMonth($key, isPublished) {
    this.submitted = true
    if (this.isMonthExists('edit',$key)) {
      let { monthname } = this.monthForm.value;
      monthname = monthname.trim();
      this.monthService
      .manageMonth({ 
        $key, 
        monthname: monthname.charAt(0).toUpperCase() + monthname.slice(1).toLowerCase(), 
        isPublished })
      .then(() => {
        $('#showUpdateMonthDialog').modal('hide')
        this.toastr.show(APP_MESSAGE.MONTH.month_update, false)
        this.submitted = false
        this.monthForm.reset()
      })
    }
  }
  // function to display modal for publish month
  onUpdatePublish($key, isPublished, details) {
    const type = 'MONTH'
    const id = $key
    const objMonth: CommonDeletePublishModal = {
      section: SECTIONS.month,
      displayMessage: APP_MESSAGE.PUBLISH.publish,
      sectionItems: { id, key: id, isPublished, details, type },
    }
    this.publishItem = objMonth
    $('#modal-update-publish').modal('show')
  }
  cancelPublish() {
    $('#modal-update-publish').modal('hide')
  }
  // function to display modal for unpublish month
  onUpdateUnpublish($key, isPublished) {
    const id = $key
    const objMonth: CommonDeletePublishModal = {
      section: SECTIONS.month,
      displayMessage: APP_MESSAGE.UNPUBLISH.unpublish,
      sectionItems: { id, isPublished },
    }
    this.unPublishItem = objMonth
    $('#modal-update-unpublish').modal('show')
  }
  // for pagination
  onPageBoundsCorrection(number: number) {
    this.pageNo = number;
    this.toastr.show("Number exceeded page limit")
  }
  checkPageNumber(event){
    if(event.target.value && event.target.value < 1){
        this.pageNo = 1;
        this.toastr.show("Page number should not be less than 1");
    } else if(event.target.value === ""){
      this.pageNo = 1;
    } else {
      this.pageNo = event.target.value;
    }
  }
}
