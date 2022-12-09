import { Component, OnInit } from '@angular/core'
import {
  AllUserService,
  UserModel,
  MainTopicService,
  CommonDeletePublishModal,
  ToastMessageService,
} from '@app/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { APP_MESSAGE } from '@app/core/config'
declare var $: any
import * as _ from 'lodash'
import { SECTIONS } from '@app/core/utils'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  deleteItem: any
  allUserList: any[] = []
  userItems: any[] = []
  addCourseItems = {
    id: '',
    courses: [],
    userDetails: [],
  }
  courses: any[]
  record = true
  userDetailsLoading = true
  userDetails: any
  noCourse: string
  courseArray: string[]
  userFormAD: FormGroup
  users: any[]
  restoreItem: CommonDeletePublishModal
  userStatus: any
  mobileForSC: any
  nickNameForSC: any
  mobileno: any
  userkeys: any
  isPrimeUsers: any
  isActives: boolean
  noDataMsg: any
  //for pagination
  searchUser;
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
    public allUserService: AllUserService,
    public formbuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    private mainTopicService: MainTopicService,
    private toastr: ToastMessageService
  ) {
    this.setuserFormAD()
  }

  ngOnInit() {
    this.noDataMsg = APP_MESSAGE.COMMON.result_not_found
    this.getAllUsers()
  }
  loadSpinner(isShow: boolean) {
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  resetFilter() {
    this.searchUser = ''
  }
  // function to get all users
  getAllUsers() {
    this.loadSpinner(true)
    this.allUserService.getAllUsers().subscribe((list) => {
      const usrList = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      })
      console.log("usrList",usrList)
      this.users = usrList.filter((item) => item && item.userDetails)
      console.log("this.users",this.users)
      if (this.userStatus !== '') {
        this.filterUser()
      } else {
        this.allUserList = this.users
      }
      this.loadSpinner(false)
    })
  }
  // function to show modal for activate and deactivate prime
  changePrimeStatus(userkey, mobile, isPrimeUser) {
    this.userkeys = userkey
    this.mobileno = mobile
    this.isPrimeUsers = isPrimeUser
    $('#showPrimeDialog').modal('show')
  }
  // function to activate prime
  activatePrime(userkeys, isPrimeUsers) {
    this.allUserService.updatePrimeStatus(userkeys, isPrimeUsers).then(() => {
      this.ngOnInit()
      $('#showPrimeDialog').modal('hide')
    })
  } // function to deactivate prime
  deActivatePrime(userkeys, isPrimeUsers) {
    this.allUserService
      .updateUserPrimeStatus(userkeys, isPrimeUsers)
      .then(() => {
        this.ngOnInit()
        $('#showPrimeDialog').modal('hide')
      })
  }
  // function to show modal for activate user
  changeActiveStatus(userkey, mobile, isActive) {
    this.userkeys = userkey
    this.mobileno = mobile
    this.isActives = isActive
    $('#showActivateDialog').modal('show')
  }
  // function to activate user
  activateActiveStatus(userkeys, isActives) {
    this.allUserService.updateActiveStatus(userkeys, isActives).then(() => {
      this.ngOnInit()
      $('#showActivateDialog').modal('hide')
    })
  }
  // function to deactivate user
  deActivateActiveStatus(userkeys, isActives) {
    this.allUserService.updateDeActiveStatus(userkeys, isActives).then(() => {
      this.ngOnInit()
      $('#showActivateDialog').modal('hide')
    })
  }
  // function to show modal for activate user
  addCourse(userkey, details) {
    this.spinner.show()
    this.userData(userkey, '10000').then(() => {
      this.spinner.hide()
      try {
        const coursesFunction = async () => {
          if (typeof this.userDetails.courses !== 'undefined') {
            this.courseArray = []
            this.courseArray = Object.keys(this.userDetails.courses)
            await this.allUserService.sleep('2000')
          } else {
            this.courseArray = []
          }
        }
        coursesFunction().then(() => {
          const objAddCourse: UserModel = {
            id: userkey,
            courses: this.courseArray,
            userDetails: details,
          }
          this.addCourseItems = objAddCourse
        })
      } catch (error) {
        console.log(error)
      }
      $('#addCourse').modal('show')
    })
  }
  getCourses(userKey, mobile, nickName) {
    this.record = true
    this.mobileForSC = mobile
    this.nickNameForSC = nickName
    this.userData(userKey, '10000').then(() => {
      try {
        this.courses = this.getCourseNames(this.userDetails.courses)
        if (this.courses.length < 1) {
          this.record = false
          this.noCourse = APP_MESSAGE.COMMON.data_not_found
        }
      } catch (error) {
        this.record = false
        this.noCourse = APP_MESSAGE.COMMON.data_not_found
      }
    })
    $('#showCourses').modal('show')
  }
  onDialogClose(modalId) {
    this.record = false
    this.courseArray = []
    this.courses = []
    $('#' + modalId).modal('hide')
  }
  getCourseNames(courses) {
    const courseList = Object.keys(courses).map((item) => {
      return {
        id: item,
      }
    })
    const courseNames = []
    courseList.forEach((item) => {
      const courseDetails = this.mainTopicService.getMainTopicDetails(item.id)
      courseNames.push(courseDetails)
    })
    return courseNames
  }
  async userData(userkey, time) {
    this.userDetails = this.allUserService.getUserById(userkey)
  }
  setuserFormAD() {
    this.userFormAD = this.formbuilder.group({
      userStatus: [''],
    })
  }
  filterUser() {
    this.userStatus = this.userFormAD.value.userStatus
    if (this.userStatus === '') {
      this.allUserList = this.users
      this.pageNo = 1
    } else if (this.userStatus === '1') {
      this.allUserList = this.users.filter((status) => status.isActive === true)
      this.pageNo = 1
    } else if (this.userStatus === '2') {
      this.allUserList = this.users.filter(
        (status) => status.isActive === false
      )
      this.pageNo = 1
    } else if (this.userStatus === '3') {
      this.allUserList = this.users.filter((status) => status.userState === 0)
      this.pageNo = 1
    }
  }
  // function to show modal for delete month
  onDeleteUser($key, isActive) {
    const id = $key
    const objMonth: CommonDeletePublishModal = {
      section: SECTIONS.user,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { id },
    }
    this.deleteItem = objMonth
    if (isActive === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.USER.user_cant_delete)
    }
  }
  // function to show modal for delete month
  onRestoreUser($key) {
    const id = $key
    const objMonth: CommonDeletePublishModal = {
      section: SECTIONS.user,
      displayMessage: APP_MESSAGE.RESTORE.restore,
      sectionItems: { id },
    }
    this.restoreItem = objMonth
    $('#showRestoreDialog').modal('show')
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
