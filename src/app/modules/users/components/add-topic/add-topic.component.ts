import { Component, Input, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import {
  MainTopicService,
  ToastMessageService,
  AllUserService,
} from '@app/core'
declare var $: any
import { APP_MESSAGE } from '@app/core/config'
import { Select2OptionData } from 'ng-select2'
import { Options } from 'select2'
import { NgxSpinnerService } from 'ngx-spinner'

@Component({
  selector: 'app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss'],
})
export class AddTopicComponent implements OnInit {
  @Input() user: any
  public data: Array<Select2OptionData>
  public options: Options
  public ngSelectValue: string[]
  // @Output() newItemEvent = new EventEmitter<string>();

  CourseFormAdd: FormGroup
  isDataLoaded: boolean
  courseList: any[]
  submitted: boolean
  selectedCourse: any
  mainCategory: any[]
  userDetails: any
  courseObj: {}
  courses: any
  record: boolean
  constructor(
    public formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastMessageService,
    public mainTopicService: MainTopicService,
    public allUserService: AllUserService,
    private spinner: NgxSpinnerService
  ) {
    this.setCourseForm(true, {
      courseName: '',
    })
    this.setCourseForm(false, null)
  }

  ngOnInit(): void {
    this.getMainTopicList()
    this.options = {
      multiple: true,
      closeOnSelect: false,
    }
  }
  loadSpinner(isShow: boolean) {
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  getMainTopicList() {
    this.mainTopicService.getMainTopics().subscribe((list) => {
      this.isDataLoaded = true
      const result = list.map((item) => {
        return {
          $key: item.key,
          // categoryName: item
          ...item.payload.val(),
        }
      })
      const courseList = result.map((item) => {
        return {
          id: item.$key,
          text: item.categoryName,
        }
      })
      this.data = courseList
    })
  }
  // initialize subtopic form
  setCourseForm(isUpdate, args) {
    if (isUpdate) {
      this.CourseFormAdd = this.formbuilder.group({
        courseName: [args.courseName, Validators.required],
      })
    } else {
      this.CourseFormAdd = this.formbuilder.group({
        courseName: ['', Validators.required],
      })
    }
  }
  get subtopicformAdd() {
    return this.CourseFormAdd.controls
  }
  addCourse(userid) {
    this.submitted = true
    let topics: any = []
    let topicsFromDb: any = []
    let pushedArray: any = []
    let action
    const status = 'active'
    topics = this.CourseFormAdd.value.courseName
    if (this.submitted) {
      const userkey = userid
      this.getCourses(userkey)
      if (this.userDetails.courses) {
        action = 'update'
        let date: any
        let topicsFromDbObjVals: any
        let topicsFromDbObjKeys: any
        pushedArray = []
        topicsFromDb = this.userDetails.courses
        topicsFromDbObjKeys = Object.keys(this.userDetails.courses)
        topicsFromDbObjVals = Object.values(this.userDetails.courses)
        topics.forEach((te) => {
          date = Date.now()
          if (topicsFromDbObjKeys.includes(te)) {
            topicsFromDbObjVals.forEach((tfov) => {
              if (tfov.id == te) {
                if ('created_at' in tfov) {
                  date = tfov.created_at
                }
                const courseData = tfov
                courseData.created_at = date
                pushedArray.push(courseData)
              }
            })
          } else {
            const vals = {
              created_at: date,
              id: te,
              status: status,
            }
            pushedArray.push(vals)
          }
        })
      } else {
        action = 'add'
      }
      const addFunction = async () => {
        if (action === 'add') {
          const date = Date.now()
          this.allUserService.saveCourse(topics, userkey, status, date)
        }
        if (action === 'update') {
          this.allUserService.updateCourse(pushedArray, userkey, status)
        }
      }
      addFunction().then(() => {
        this.CourseFormAdd.reset()
        this.submitted = false
        $('#addCourse').modal('hide')
        this.toastr.show(APP_MESSAGE.USER.user_course, false)
      })
    } else {
      this.toastr.show('Something went wrong !!!')
    }
  }

  getCourses(userKey) {
    const userData = async () => {
      this.spinner.show()
      this.userDetails = this.allUserService.getUserById(userKey)
      await this.sleep(5000)
    }
    userData().then(() => {
      this.spinner.hide()
      try {
        const courseList = Object.keys(this.userDetails.courses).map((item) => {
          return {
            id: item,
          }
        })
        this.courses = courseList
      } catch (error) {
        this.record = false
        this.courses = APP_MESSAGE.COMMON.data_not_found
      }
    })
  }
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  onDialogClose(modalId) {
    this.submitted = false;
    this.user = [];
    this.CourseFormAdd.reset();
    $('#' + modalId).modal('hide')
  }
}
