import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import {
  CurrentAffairService,
  ToastMessageService,
  PushNotificationService,
  CommonDeletePublishModal,
} from '@app/core'
import { APP_MESSAGE } from '@app/core/config'
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any
import * as _ from 'lodash'
import { SECTIONS } from '@app/core/utils'
@Component({
  selector: 'app-list-current-affair',
  templateUrl: './list-current-affair.component.html',
  styleUrls: ['./list-current-affair.component.scss'],
})
export class ListCurrentAffairComponent implements OnInit {
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  notificationForm: FormGroup;
  currentAffairList: any[];
  monthList: any[];
  currentAffairForm: any;
  monthItems: any[];
  selectedId: any;
  allCurrentAffairItems: any[] = [];
  pageSort = 'asc';
  isDataLoaded = false;
  msgtitle: boolean;
  Result: any;
  notification_count = 0;
  deleteItem: any;
  searchFilter = { monthName: { $key: '', monthname: 'Select month' } };
  selectedMonth: { $key: string; monthname: string };
  submitted = false;
  //for pagination
  searchEvent: any;
  pageNo: number = 1;
  pageNoBind: number;
  publishWarningMsg: string
  onSearchChange(searchKey: string): void {
    this.pageNo = 1
  }
  pageMaxSize: number = 10;
  itemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  checked = false;
  constructor(
    public formbuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastMessageService,
    public currentAffiarService: CurrentAffairService,
    private spinner: NgxSpinnerService,
    public pushNotificationService: PushNotificationService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage ? parseInt(params.itemsPerPage) : 10;
    });
    this.allCurrentAffairItems = []
    this.setcurrentAffairForm()
    this.setNotificationForm()
  }

  ngOnInit(): void {
    this.getCurrentAffairsList()
    this.getMonthList()
  }

  setcurrentAffairForm() {
    this.currentAffairForm = this.formbuilder.group({
      monthname: [''],
    })
  }
  loadSpinner(isShow: boolean) {
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  // function to get all current affairs
  getCurrentAffairsList() {
    var regex = /<img.*?src='(.*?)'/;
    this.loadSpinner(true);
    this.currentAffiarService.getCurrentAffairs().subscribe((list) => {
      this.isDataLoaded = true
      this.loadSpinner(false);
      this.currentAffairList = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      })
      if (this.searchFilter.monthName.$key === '') {
        this.allCurrentAffairItems = this.currentAffairList
      } else {
        this.changeMonth()
      }
    })
    this.sortResult(this.allCurrentAffairItems, this.pageSort)
  }
  // function to get all months
  getMonthList() {
    this.currentAffiarService.getMonth().subscribe((list) => {
      const monthList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.monthList = monthList.filter((item => item.monthname !== " "));
      this.monthList = _.orderBy(
        this.monthList,
        [(data) => data.monthname?.toLowerCase()],
        'asc'
      );
      this.monthList.unshift({ $key: '', monthname: 'Select month' })
      this.searchFilter.monthName = this.monthList[0]
    })
  }
  resetFilter() {
    this.searchEvent = ''
    this.getCurrentAffairsList()
    this.searchFilter.monthName = this.monthList[0]
  }
  // function to get all current affairs based on a particular month
  changeMonth() {
    // const { monthname } = this.currentAffairForm.value
    const { monthName } = this.searchFilter
    if (monthName && monthName.$key) {
      this.allCurrentAffairItems = this.currentAffairList.filter(
        (item) => item.month === monthName.$key
      )
    } else {
      this.getCurrentAffairsList()
    }

    // console.log("month change")
    // console.log(this.allCurrentAffairItems);
    // this.selectedMonth = this.searchFilter.monthName
  }

  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.allCurrentAffairItems, this.pageSort)
  }
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.allCurrentAffairItems, this.pageSort)
  }
  sortResult(source, sort) {
    this.allCurrentAffairItems = _.orderBy(
      source,
      [(data) => data?.title?.toLowerCase()],
      sort
    )
  }

  addCurrentAffairs() {
    this.router.navigate(['/add-current-affairs/manage'], {
      queryParams: {
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage
      }
    });
  }
  // function to show modal for edit month
  onUpdateCurrentAffair(id) {
    this.router.navigate(['/add-current-affairs/manage'], {
      queryParams: { 
        currentAffairKey: id,
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage
      }
    });
  }
  // function to get particular current affair details by key
  currentAffairDetails($key) {
    return this.currentAffiarService.getCurrentAffairDetails($key)
  }
  // function to show modal for delete month
  onDeleteCurrentAffair($key, isPublished) {
    const id = $key
    const objCurrentAffair: CommonDeletePublishModal = {
      section: SECTIONS.currentAffair,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { id, isPublished },
    }
    this.deleteItem = objCurrentAffair
    if (isPublished === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.CURRENT_AFFAIRS.current_affairs_not_delete)
    }
  }

  // function to display modal for publish current affair
  onUpdatePublish($key) {
    this.selectedId = $key;
    this.publishWarningMsg = APP_MESSAGE.PUBLISH.publish;
    $('#modal-update-publish').modal('show');
    // this.currentAffiarService.getCurrentAffairDetails($key)
    // .on('value', (snapshot) => {
    //   const { isPublished } = snapshot.val();
    //   $('#modal-update-publish').modal('show')
    // });
  }

  cancelPublish() {
    this.notificationForm.reset();
    this.checked = false;
    this.msgtitle = false;
    $('#modal-update-publish').modal('hide')
  }
  // function to initialize notification form
  setNotificationForm() {
    this.notificationForm = this.formbuilder.group({
      noti_check: [''],
      notificationtitle: [''],
      notificationmessage: ['']
    })
  }
  get notificationform() {
    return this.notificationForm.controls
  }
  checkNotification(event) {
    if (event.target.checked === true) {
      this.notificationForm.controls.notificationtitle.setValidators([Validators.required]);
      this.msgtitle = true;
      this.checked = true;
    } else {
      this.msgtitle = false;
      this.checked = false;
    }
  }
  // function to update unpublished status into publish
  updatePublish($key) {
    this.submitted = true
    this.currentAffiarService.getCurrentAffairDetails($key)
    .once('value', (snapshot) => {
      const {
        date,
        description,
        month,
        title,
        notification_count,
      } = snapshot.val();
      const months = month
      const data = {
        ref_id: $key,
        month: months,
        type: '1',
      }
      let notTitle = "";
      let notMessage = "";
      if(this.notificationForm.value.notificationtitle !== null){
        notTitle = this.notificationForm.value.notificationtitle.trim();
      }
      if(this.notificationForm.value.notificationmessage !== null){
        notMessage = this.notificationForm.value.notificationmessage.trim();
      }
      const notificationtitle = notTitle;
      const notificationmessage = notMessage;
      if ( this.msgtitle === true && (notificationtitle === '' || notificationmessage === '') ) {
        this.toastr.show('Title and Message fields can not be empty, notification is not send',true)
        this.submitted = false
      } else if (this.msgtitle === true && (notificationtitle !== '' || notificationmessage !== '')) {
        const currentAffairDetails = this.currentAffairDetails($key)
        const result = this.pushNotificationService.sendNotification(
          notificationtitle,
          notificationmessage,
          { key: $key, type: 'CURRENT_AFFAIR', details: currentAffairDetails },
          ''
        )
        this.toastr.show(APP_MESSAGE.NOTIFICATION.notification_send, false);
        this.currentAffiarService
          .manageCurrentAffair({
            $key,
            date,
            description,
            month,
            title,
            isPublished: true,
            linkAvailable: false,
          })
          .then(() => {
            this.notificationForm.reset();
            this.checked = false;
            this.msgtitle = false;
            $('#modal-update-publish').modal('hide')
            this.toastr.show(
              APP_MESSAGE.CURRENT_AFFAIRS.current_affairs_published,
              false
            )
          });
      } else {
        this.currentAffiarService
        .manageCurrentAffair({
          $key,
          date,
          description,
          month,
          title,
          isPublished: true,
          linkAvailable: false,
        })
        .then(() => {
          $('#modal-update-publish').modal('hide')
          this.toastr.show(
            APP_MESSAGE.CURRENT_AFFAIRS.current_affairs_published,
            false
          )
        });
      }
      this.submitted = false;
    });
  }
  // function to display modal for unpublish current affair
  onUpdateUnpublish($key) {
    this.selectedId = $key
    this.publishWarningMsg = APP_MESSAGE.UNPUBLISH.unpublish;
    $('#modal-update-unpublish').modal('show')
  }
  // function to update published status into unpublish
  updateUnPublish($key) {
    this.currentAffiarService.getCurrentAffairDetails($key)
    .once('value', (snapshot) => {
      const { date, description, month, title } = snapshot.val();
      this.currentAffiarService
      .manageCurrentAffair({
        $key,
        date,
        description,
        month,
        title,
        isPublished: false,
        linkAvailable: false,
      })
      .then(() => {
        $('#modal-update-unpublish').modal('hide')
        this.toastr.show(
          APP_MESSAGE.CURRENT_AFFAIRS.current_affairs_unpublished,
          false
        );
      })
    });
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
