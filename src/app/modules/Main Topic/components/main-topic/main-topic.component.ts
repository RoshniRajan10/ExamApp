import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import {
  ParentTopicService,
  ToastMessageService,
  MainTopicModel,
  MainTopicService,
  CommonDeletePublishModal,
  StudyMaterialService,
  PracticeService,
} from '@app/core'
declare var $: any
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'
import { SECTIONS } from '@app/core/utils'

@Component({
  selector: 'app-main-topic',
  templateUrl: './main-topic.component.html',
  styleUrls: ['./main-topic.component.scss'],
})
export class MainTopicComponent implements OnInit {
  noDataMsg = APP_MESSAGE.COMMON.result_not_found
  mainTopicSearchForm: FormGroup
  MainTopicFormAdd: FormGroup
  MainTopicFormUpdate: FormGroup
  MainTopicList = []
  parentTopicList = []
  isPremium = false
  examList: any[]
  practiceList: any[]
  AllPracticeList: any[]
  studyMaterialList: any[]
  allStudyMaterial: any[]
  maintopics: any[]
  parentKey: string
  categoryName: string
  mainTopicItems = []
  parentName: any
  submitted = false
  selectedId: any
  data: any
  categoryName1: any
  mainTopicElement: any[] = []
  isDataLoaded = false
  pageSort = 'asc'
  optionValue = 'Select Parent Topic'
  deleteItem: any
  publishItem: any
  unPublishItem: any
  parentTopicName1: any
  spaceValidate: boolean
  searchFilter = {
    keyword: '',
    parentTopic: { $key: '', parentName: 'Select Parent Topic' },
  }
  //for pagination
  mainTopicSearch;
  pageNo: number = 1;
  pageNoBind: number;
  parentTopics: any[]
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
    public parentTopicService: ParentTopicService,
    private spinner: NgxSpinnerService,
    public mainTopicService: MainTopicService,
    public practiceService: PracticeService,
    public studyMaterialService: StudyMaterialService
  ) {
    this.setForm(false, null)
    this.setForm(true, { categoryName: '', parentKey: '', ispremium: '' })
    this.setmainTopicSearchForm()
  }
  // intialize main topic form
  setForm(isUpdate, args) {
    if (isUpdate) {
      this.MainTopicFormUpdate = this.formbuilder.group({
        categoryName: [isUpdate ? args.categoryName : '', Validators.required],
        parentKey: [isUpdate ? args.parentKey : '', Validators.required],
        ispremium: [args.isPremium],
      })
    } else {
      this.MainTopicFormAdd = this.formbuilder.group({
        categoryName: ['', Validators.required],
        parentKey: ['', Validators.required],
        ispremium: [''],
      })
    }
  }
  ngOnInit() {
    this.getMainTopicList()
    this.getParentTopicList()
    this.getAllExamList()
    this.getPracticeList()
    this.getStudyMaterialList()
  }

  resetFilter() {
    this.mainTopicSearch = ''
    this.searchFilter.parentTopic = this.parentTopicList[0]
    this.getMainTopicList()
  }
  // function to get all parent topics
  getParentTopicList() {
    this.parentTopicService.getParentTopics().subscribe((list) => {
      const parentTopicList = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      })
      this.parentTopicList = _.orderBy(
        parentTopicList,
        [(data) => data.parentName?.toLowerCase()],
        'asc'
      );
      this.parentTopics = _.orderBy(
        parentTopicList,
        [(data) => data.parentName?.toLowerCase()],
        'asc'
      );
      this.parentTopicList.unshift({
        $key: '',
        parentName: 'Select Parent Topic',
      })
      this.searchFilter.parentTopic = this.parentTopicList[0]
    })
  }
  // function to get all main topics
  getMainTopicList() {
    this.loadSpinner(true)
    this.mainTopicService.getMainTopics().subscribe((list) => {
      this.loadSpinner(false)
      this.isDataLoaded = true
      this.maintopics = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      if(this.searchFilter.parentTopic.$key !== "") {
        this.changeParentTopic();
        // this.MainTopicList = this.maintopics.filter(
        //   item => item.parentKey === this.searchFilter.parentTopic.$key
        // );
      } else {
        this.sortResult(this.maintopics, this.pageSort)
      }
    })
  }
  loadSpinner(isShow: boolean) {
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  onPageSortAsc() {
    // ascending sort
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.MainTopicList, this.pageSort)
  }
  onPageSortDesc() {
    // descending sort
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.MainTopicList, this.pageSort)
  }
  sortResult(source, sort) {
    this.MainTopicList = _.orderBy(
      source,
      [(data) => data.categoryName?.toLowerCase()],
      sort
    )
  }
  // function to close modal box
  onDialogClose(modalId) {
    this.submitted = false
    $('#' + modalId).modal('hide')
  }
  // function to get main topic details based on a specific category key
  mainTopicDetails($key) {
    return this.mainTopicService.getMainTopicDetails($key)
  }
  // function to get parent topic details based on a specific parent key
  parentTopicDetails($key) {
    return this.parentTopicService.getParentTopicDetails($key)
  }
  // function to add main topic
  addMainTopic() {
    this.setDropDownValid(this.MainTopicFormAdd.controls)
    this.submitted = true
    if (!this.MainTopicFormAdd.invalid) {
      if (this.isTopicNameExists(false, '')) {
        const { categoryName } = this.MainTopicFormAdd.value
        const isPremium = this.isPremium
        const objMainTopic: MainTopicModel = {
          $key: '',
          categoryName,
          parentKey: this.MainTopicFormAdd.value.parentKey.$key,
          parentName: this.MainTopicFormAdd.value.parentKey.parentName,
          isPremium,
          isPublished: false,
        }
        const objResult = this.mainTopicService.manageMainTopic(objMainTopic)
        if (objResult) {
          this.submitted = false;
          this.isPremium = false;
          this.setForm(false, null)
          this.toastr.show(APP_MESSAGE.MAIN_TOPIC.main_topic_create, false)
          $('#showAddMainTopicDialog').modal('hide')
        }
      }
    }
  }

  setDropDownValid(controls) {
    const { parentKey } = controls
    if (parentKey.value === 'Select Parent Topic') {
      parentKey.value = ''
      parentKey.status = 'INVALID'
      parentKey.errors = { required: true }
    }
  }

  get maintopicformAdd() {
    return this.MainTopicFormAdd.controls
  }
  get maintopicformUpdate() {
    return this.MainTopicFormUpdate.controls
  }
  // function to check whether same main topic exist or not
  isTopicNameExists(isUpdate, $key) {
    const frm = isUpdate ? this.MainTopicFormUpdate : this.MainTopicFormAdd
    const { categoryName, parentKey } = frm.value
    const parentKeyId = isUpdate ? parentKey : parentKey.$key

    const mainTopics = this.MainTopicList.filter(
      (item) =>
        item.categoryName &&
        item.categoryName.toLowerCase().replace(/\s/g, '') ===
          categoryName.toLowerCase().replace(/\s/g, '') &&
        item.parentKey === parentKeyId
    )

    if (mainTopics.length === 0) {
      return true
    }
    let retVal = true
    if (!isUpdate) {
      retVal = false
    } else {
      if (mainTopics.filter((itm) => itm.$key !== $key).length > 0) {
        retVal = false
      }
    }
    if (!retVal) {
      this.toastr.show(APP_MESSAGE.MAIN_TOPIC.main_topic_exists)
    }
    return retVal
  }

  validateWhiteSpace() {
    const videoID = this.MainTopicFormAdd.value.categoryName
    if (videoID != undefined || videoID != '') {
      const regExp = /^.*(\s|\S)*(\S)+(\s|\S).*/
      const match = videoID.match(regExp)
      if (match) {
        // Do anything for being valid
        // if need to change the url to embed url then use below line
        this.spaceValidate = false
      } else {
        this.spaceValidate = true
        // Do anything for not being valid
      }
    }
  }
  validateWhiteSpaceUpdate() {
    const videoID = this.MainTopicFormUpdate.value.categoryName
    if (videoID != undefined || videoID != '') {
      const regExp = /^.*(\s|\S)*(\S)+(\s|\S).*/
      const match = videoID.match(regExp)
      if (match) {
        this.spaceValidate = false
      } else {
        this.spaceValidate = true
      }
    }
  }

  // function to show delete topic modal
  onDeleteMainTopic($key, isPublished) {
    const id = $key
    const objMainTopic: CommonDeletePublishModal = {
      section: SECTIONS.mainTopic,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { id, isPublished },
    }
    this.deleteItem = objMainTopic
    if (isPublished === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.PARENT_TOPIC.publish_topic_not_delete)
    }
  }
  // function to display modal for unpublish main topic
  onUpdatePublish($key, isPublished, details) {
    const type = 'MAIN_TOPIC'
    const id = $key
    const objMainTopic: CommonDeletePublishModal = {
      section: SECTIONS.mainTopic,
      displayMessage: APP_MESSAGE.PUBLISH.publish,
      sectionItems: { id, key: id, isPublished, details, type },
    }
    this.publishItem = objMainTopic
    $('#modal-update-publish').modal('show')
  }
  // function to display modal for unpublish main topic
  onUpdateUnpublish($key, isPublished) {
    const id = $key
    const objMainTopic: CommonDeletePublishModal = {
      section: SECTIONS.mainTopic,
      displayMessage: APP_MESSAGE.UNPUBLISH.unpublish,
      sectionItems: { id, isPublished },
    }
    this.unPublishItem = objMainTopic
    $('#modal-update-unpublish').modal('show')
  }
  // function to show update modal popup
  onUpdateMainTopic($key) {
    this.selectedId = $key
    const { categoryName, parentKey, isPremium } = this.mainTopicDetails($key)
    this.data = this.parentTopicDetails(parentKey)
    this.isPremium = isPremium
    this.setForm(true, { categoryName, parentKey, isPremium })
    $('#showUpdateTopicicDialog').modal('show')
  }
  // function to update main topic
  updateMainTopic($key) {
    this.submitted = true
    if (!this.isPremium) {
      this.isPremium = false
    }
    if (!this.MainTopicFormUpdate.invalid) {
      if (this.isTopicNameExists(true, $key)) {
        const { categoryName, parentKey } = this.MainTopicFormUpdate.value
        const { isPublished } = this.mainTopicDetails($key)
        const { parentName } = this.parentTopicDetails(parentKey)
        const objMainTopic: MainTopicModel = {
          $key,
          categoryName,
          parentKey,
          parentName,
          isPremium: this.isPremium,
          isPublished: false,
        }
        this.mainTopicService.manageMainTopic(objMainTopic).then(() => {
          const examlist = this.examList.filter(
            (exam) => exam['categorykey'] == $key
          )
          const practiceList = this.AllPracticeList.filter(
            (practice) => practice['categoryKey'] == $key
          )
          const studyMaterials = this.allStudyMaterial.filter(
            (sm) => sm['categorykey'] == $key
          )
          this.mainTopicService.getExams($key, categoryName, examlist)
          this.mainTopicService.getPractices($key, categoryName, practiceList)
          this.mainTopicService.getStudyMaterials(
            $key,
            categoryName,
            studyMaterials
          )
          this.submitted = false
          $('#showUpdateTopicicDialog').modal('hide')
          this.toastr.show(APP_MESSAGE.MAIN_TOPIC.main_topic_update, false)
        })
      }
    }
  }
  isPremiumEvent(event) {
    if (event.target.checked === true) {
      this.isPremium = true
    } else {
      this.isPremium = false
    }
  }
  getAllExamList() {
    this.examList = []
    let data
    this.mainTopicService.getAllPublishedCategories().then((list) => {
      list.once('value', (snapshot) => {
        let data
        const exams = []
        data = snapshot.val()
        Object.entries(data).forEach(([datakey, datavalue]) => {
          exams.push({
            $key: datakey,
            // tslint:disable-next-line: no-string-literal
            categoryName: datavalue['categoryName'],
            // tslint:disable-next-line: no-string-literal
            examsInCategory: datavalue['examsInCategory'],
          })
        })
        exams.forEach((category, value) => {
          if (category.examsInCategory) {
            Object.entries(category.examsInCategory).forEach(
              ([examkey, examvalue]) => {
                this.examList.push({
                  examkeys: examkey,
                  examsInCategoryKey: examvalue['examsInCategoryKey'],
                  examsId: examvalue['examsId'],
                  categorykey: examvalue['metaData'].categoryKey,
                  categoryName: examvalue['metaData'].categoryName,
                  examDuration: examvalue['metaData'].examDuration,
                  examInstruction: examvalue['metaData'].examInstruction,
                  examName: examvalue['metaData'].examName,
                  isPublished: examvalue['metaData'].isPublished,
                  levelName: examvalue['metaData'].levelName,
                  levelkey: examvalue['metaData'].levelkey,
                  passMark: examvalue['metaData'].passMark,
                  totalMark: examvalue['metaData'].totalMark,
                  totalNoOfQuestions: examvalue['metaData'].totalNoOfQuestions,
                  same_weightage: examvalue['metaData'].same_weightage,
                  marks: examvalue['metaData'].marks,
                  negativeMarks: examvalue['metaData'].negativeMarks,
                  isPremium: examvalue['metaData'].isPremium,
                })
              }
            )
          }
        })
      })
    })
  }
  getPracticeList() {
    this.loadSpinner(true)
    this.practiceService.getExamList().subscribe((list) => {
      this.isDataLoaded = true
      this.loadSpinner(false)
      this.practiceList = list.map((item) => {
        const itemList = {
          $key: item.key,
          data: item.payload.val(),
        }
        return itemList
      })
      this.AllPracticeList = []
      this.practiceList.forEach((elements) => {
        Object.entries(elements.data).forEach(([practicekey, value]) => {
          this.AllPracticeList.push({
            /* tslint:disable */
            practicekeys: practicekey,
            practiceId: value['practiceId'],
            practicesInChapterKeys: value['practicesInChapterKey'],
            categoryNames: value['metaData'].categoryName,
            practiceNames: value['metaData'].practiceName,
            subCategoryNames: value['metaData'].subCategoryName,
            categoryKey: value['metaData'].categorykey,
            isPublished: value['metaData'].isPublished,
            subCategoryKeys: value['metaData'].subCategoryKey,
            chapterName: value['metaData'].chapterName,
            chapterkey: value['metaData'].chapterkey,
            totalNoOfQuestion: value['metaData'].totalNoOfQuestions,
            same_weightage: value['metaData'].same_weightage,
            marks: value['metaData'].marks,
            negativeMarks: value['metaData'].negativeMarks,
            isPremium: value['metaData'].isPremium,
          })
        })
      })
    })
  }
  ///to get study materials
  getStudyMaterialList() {
    this.allStudyMaterial = []
    this.studyMaterialService.getAllStudyMaterialList().subscribe((list) => {
      this.isDataLoaded = true
      this.studyMaterialList = list.map((item) => {
        const itemList = {
          $key: item.key,
          data: item.payload.val(),
        }
        return itemList
      })
      this.studyMaterialList.forEach((chapter) => {
        Object.entries(chapter.data).forEach(([studymatkey, studymatvalue]) => {
          this.allStudyMaterial.push({
            /* tslint:disable */
            chapterKey: chapter.$key,
            chapterName: studymatvalue['metaData'].chapterName,
            categoryName: studymatvalue['metaData'].categoryName,
            categorykey: studymatvalue['metaData'].categorykey,
            description: studymatvalue['metaData'].description,
            isPublished: studymatvalue['metaData'].isPublished,
            studyMaterialName: studymatvalue['metaData'].studyMaterialName,
            subCategoryKey: studymatvalue['metaData'].subCategoryKey,
            subCategoryName: studymatvalue['metaData'].subCategoryName,
            studyMaterialsInChapterKey:
              studymatvalue['studyMaterialsInChapterKey'],
            studyMaterialID: studymatvalue['studyMaterialID'],
          })
        })
      })
    })
  }
  setmainTopicSearchForm() {
    this.mainTopicSearchForm = this.formbuilder.group({
      parentTopicName: [''],
    })
  }
  changeParentTopic() {
    const parentTopics = this.searchFilter.parentTopic;
    // if (parentTopics.$key !== '') {
      this.MainTopicList = this.maintopics.filter(
        (item) => item.parentKey === parentTopics.$key
      )
      this.pageNo = 1
    // }
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
