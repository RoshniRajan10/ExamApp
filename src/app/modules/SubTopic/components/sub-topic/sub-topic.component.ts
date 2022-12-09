import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { Router } from '@angular/router'
import {
  SubTopicService,
  MainTopicService,
  ToastMessageService,
  SubTopicModel,
  CommonDeletePublishModal,
  StudyMaterialService,
  PracticeService,
  ParentTopicService,
} from '@app/core'
import * as firebase from 'firebase'
declare var $: any
import * as _ from 'lodash'
import { APP_MESSAGE } from '@app/core/config'
import { SECTIONS } from '@app/core/utils'
@Component({
  selector: 'app-sub-topic',
  templateUrl: './sub-topic.component.html',
  styleUrls: ['./sub-topic.component.scss'],
})
export class SubTopicComponent implements OnInit {
  noDataMsg = APP_MESSAGE.COMMON.result_not_found
  SubTopicFormAdd: FormGroup
  SubTopicFormUpdate: FormGroup
  selectedFiles: FileList
  subTopicSearchForm: FormGroup
  MainTopicItems: any[]
  subCategoryList: any[]
  subCategories: any[]
  subTopicList: any[] = []
  subcatKey: any
  categorykey: any
  private basePath = '/subCategoryImages'
  spaceValidate: boolean
  allStudyMaterial: any[] = []
  studyMaterialList: { $key: string; data: any }[]
  allPracticeItems: any[]
  practiceList: any
  isPremium = false
  subcatname: any[]
  subTopics: any[] = []
  MainTopicList: any[]
  MainTopics: any[]
  ext: any
  isPublished: any
  subCategoryName: any
  subCategoryThumb: any
  isDataLoaded = false
  pageSort = 'asc'
  submitted = false
  categoryName: any
  categoryName1: any
  imageUpload: boolean
  result: any[]
  deleteItem: any
  sectionItems: {}
  publishItem: any
  unPublishItem: any
  chapterData: any
  searchFilter = {
    keyword: '',
    mainTopic: { $key: '', categoryName: 'Select main topic' },
    subTopic: { $key: '', subCategory: 'Select sub topic', subcatKey: '' },
    chapter: { $key: '', chapterName: 'Select chapter', chapterkey: '' },
  }
  parentTopicList: any[] = []
  //for pagination
  searchsubTopicTopic: string;
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
    private router: Router,
    private toastr: ToastMessageService,
    public subTopicService: SubTopicService,
    public mainTopicService: MainTopicService,
    private spinner: NgxSpinnerService,
    public studyMaterialService: StudyMaterialService,
    public practiceService: PracticeService,
    public parentTopicService: ParentTopicService
  ) {
    this.setSubTopicForm(true, {
      categoryName: '',
      subCategoryName: '',
      subCategoryThumb: '',
      subCategoryThumbName: '',
      ispremium: '',
      parentKey: '',
    })
    this.setSubTopicForm(false, null)
    this.setsubTopicSearchForm()
  }

  ngOnInit() {
    this.getParentTopicList()
    this.getMainTopicList()
    this.getStudyMaterialList()
    this.getPracticeList()
  }
  // initialize subtopic form
  setSubTopicForm(isUpdate, args) {
    if (isUpdate) {
      this.SubTopicFormUpdate = this.formbuilder.group({
        categoryName: [args.categoryName, Validators.required],
        subCategoryName: [args.subCategoryName, Validators.required],
        subCategoryimage: [args.subCategoryThumb],
        subCategoryThumb: [args.subCategoryThumb],
        subCategoryThumbName: [args.subCategoryThumbName, Validators.required],
        ispremium: [args.isPremium]
      })
    } else {
      this.SubTopicFormAdd = this.formbuilder.group({
        categoryName: ['', Validators.required],
        subCategoryName: ['', Validators.required],
        subCategoryimage: ['', Validators.required],
        subCategoryThumb: ['', Validators.required],
        subCategoryThumbName: ['', Validators.required],
        ispremium: [''],
        parentKey: ['', Validators.required],
      })
    }
  }
  getParentTopicList() {
    this.parentTopicService.getParentTopics().subscribe((list) => {
      const parentTopicList = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      });
      this.parentTopicList = _.orderBy(
        parentTopicList,
        [(data) => data.parentName?.toLowerCase()],
        'asc'
      );
    })
  }

  loadSpinner(isShow: boolean) {
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  // reset filter
  resetFilter() {
    this.searchsubTopicTopic = ''
    this.subTopicList = []
    this.searchFilter.mainTopic.$key = ''
    this.getMainTopicList()
  }
  get subtopicformAdd() {
    return this.SubTopicFormAdd.controls
  }
  get subtopicformUpdate() {
    return this.SubTopicFormUpdate.controls
  }
  // function to get subtopics
  getMainTopicList() {
    this.loadSpinner(true)
    this.mainTopicService.getMainTopics().subscribe((list) => {
      this.loadSpinner(false)
      this.isDataLoaded = true
      this.MainTopicItems = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.MainTopicList = _.orderBy(
        this.MainTopicItems,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
      this.MainTopics = this.MainTopicList
      this.subCategoryList = []
      this.subTopicList = []
      this.subTopics = []
      this.MainTopicItems.forEach((category) => {
        this.subCategories = category.subCategories
        if (this.subCategories) {
          this.subCategoryList.push(this.subCategories)
        }
        if (!this.subCategories) {
        } else {
          Object.entries(category.subCategories).forEach(
            ([subcatkey, value]) => {
              this.subTopics.push({
                parentkey: category.parentKey,
                subcatKey: subcatkey,
                categorykey: category.$key,
                /* tslint:disable */

                subCategory: value['subCategoryName'],
                category: category.categoryName,
                subCategoryThumb: value['subCategoryThumb'],
                subCategoryThumbName: value['subCategoryThumbName'],
                isPublished: value['isPublished'],
                isPremium: value['isPremium'],
              })
            }
          )
        }
      })
      this.subTopicList = this.subTopics
      if (this.searchFilter.mainTopic.$key === '') {
        this.MainTopicList.unshift({
          $key: '',
          categoryName: 'Select main topic',
        })
        this.searchFilter.mainTopic = this.MainTopicList[0]
      } else {
        this.changeCategory()
        this.MainTopicList.unshift({
          $key: this.searchFilter.mainTopic.$key,
          categoryName: this.searchFilter.mainTopic.categoryName,
        })
        this.searchFilter.mainTopic = this.MainTopicList[0]
      }
    })
  }
  // ascending sort
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.subTopicList, this.pageSort)
  }
  // descending sort
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.subTopicList, this.pageSort)
  }
  // sort the list based on subtopic
  sortResult(source, sort) {
    this.subTopicList = _.orderBy(
      source,
      [(data) => data?.subCategory?.toLowerCase()],
      sort
    )
  }
  // function to show update modal popup
  onUpdateSubTopic(subcatKey, categorykey) {
    this.subcatKey = subcatKey
    this.categorykey = categorykey
    $('#showUpdateTopicDialog').modal('show')
    const data = this.subTopicService.getSubTopicByKey(subcatKey, categorykey)
    const data1 = this.subTopicService.getMainTopicByKey(categorykey)
    this.SubTopicFormUpdate.controls.categoryName.setValue(data1.categoryName)
    this.categoryName1 = data1.categoryName
    this.isPublished = data.isPublished
    this.isPremium = data.isPremium
    this.SubTopicFormUpdate.controls.subCategoryName.setValue(
      data.subCategoryName
    )
    this.SubTopicFormUpdate.controls.subCategoryThumb.setValue(
      data.subCategoryThumb
    )
    this.SubTopicFormUpdate.controls.subCategoryThumbName.setValue(
      data.subCategoryThumbName
    )
  }
  // update subtopic
  updateSubopic(subcatKey, categorykey) {
    this.submitted = true;
    if (!this.SubTopicFormUpdate.invalid) {
      const {
        subCategoryName,
        subCategoryThumb,
        subCategoryThumbName,
        categoryName,
      } = this.SubTopicFormUpdate.value
      const isPremium = this.isPremium
      const nameExists = this.subTopicList.filter(subTopics => 
        (subTopics.subCategory === subCategoryName.trim()) &&
        (subTopics.categorykey === categorykey) &&
        (subTopics.subcatKey !== subcatKey)
      )
      if(nameExists.length > 0){
        this.toastr.show(APP_MESSAGE.SUB_TOPIC.sub_topic_exists, true)
      } else {
        this.subTopicService
        .updateSubTopic(
          subcatKey,
          categorykey,
          subCategoryName.trim(),
          categoryName,
          subCategoryThumb,
          subCategoryThumbName,
          isPremium
        )
        .then(() => {
          this.subTopicService.getChapters(
            categorykey,
            subcatKey,
            subCategoryName.trim()
          )
          this.subTopicService.getStudyMaterials(
            categorykey,
            subcatKey,
            subCategoryName.trim(),
            this.allStudyMaterial
          )
          this.subTopicService.getPractices(
            categorykey,
            subcatKey,
            subCategoryName.trim(),
            this.allPracticeItems
          )
          this.toastr.show(APP_MESSAGE.SUB_TOPIC.sub_topic_update, false)
          $('#showUpdateTopicDialog').modal('hide')
          this.submitted = false
          this.SubTopicFormUpdate.reset()
        })
      }
    }
  }
  // function to close modal box
  onDialogClose(modalId) {
    this.submitted = false;
    this.SubTopicFormAdd.patchValue({
      parentKey: "",
      categoryName: "",
      subCategoryName: "",
      subCategoryimage: "",
      subCategoryThumb: "",
      ispremium: ""
    });
    this.SubTopicFormUpdate.reset();
    this.MainTopics = [];
    $('#' + modalId).modal('hide')
  }
  // function to upload subcategory image
  uploadSubCategory(isUdate, event) {
    this.imageUpload = true
    const [file] = event.target.files
    const { name } = file
    const lastDot = name.lastIndexOf('.')
    this.ext = name.substring(lastDot + 1)
    if (this.ext === 'jpg' || this.ext === 'png') {
      const filePath = `${this.basePath}/${file.name}`
      const storageRef = firebase.storage().ref()
      const uploadTask = storageRef.child(filePath).put(file)
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {},
        () => {},
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            if (isUdate) {
              this.SubTopicFormUpdate.controls.subCategoryThumb.setValue(
                downloadURL
              )
              this.SubTopicFormUpdate.controls.subCategoryThumbName.setValue(
                file.name
              )
            } else {
              this.SubTopicFormAdd.controls.subCategoryThumb.setValue(
                downloadURL
              )
              this.SubTopicFormAdd.controls.subCategoryThumbName.setValue(
                file.name
              )
            }
          })
          this.imageUpload = false
        }
      )
    } else {
      this.toastr.show(APP_MESSAGE.SUB_TOPIC.sub_image_format, true);
      return false;
    }
  }
  // function to add subtopic
  addSubopic() {
    this.submitted = true
    if (!this.SubTopicFormAdd.invalid) {
      const {
        categoryName,
        subCategoryName,
        subCategoryThumb,
        subCategoryThumbName,
      } = this.SubTopicFormAdd.value
      const isPremium = this.isPremium;
      const objSubTopic: SubTopicModel = {
        $key: '',
        categoryName,
        subCategoryName: subCategoryName.trim(),
        subCategoryThumb,
        subCategoryThumbName,
        isPremium,
        isPublished: false,
      }
      const nameExists = this.subTopicList.filter(subTopics => 
        (subTopics.subCategory === subCategoryName.trim()) &&
        (subTopics.categorykey === categoryName)
      )
      if(nameExists.length > 0){
        this.toastr.show(APP_MESSAGE.SUB_TOPIC.sub_topic_exists, true)
      } else {
        const objResult = this.subTopicService.manageSubTopic(objSubTopic)
        if (objResult) {
          this.getParentTopicList();
          this.SubTopicFormAdd.reset();
          this.submitted = false;
          this.isPremium = false;
          $('#showAddTopicDialog').modal('hide');
          this.toastr.show(APP_MESSAGE.SUB_TOPIC.sub_topic_create, false)
        } else {
          this.toastr.show(APP_MESSAGE.SUB_TOPIC.error, true)
        }
      }
    }
  }
  // function to show delete topic modal
  onDeleteSubTopic(subcatKey, categorykey, isPublished) {
    const objSubTopic: CommonDeletePublishModal = {
      section: SECTIONS.subTopic,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { subcatKey, categorykey, isPublished },
    }
    this.deleteItem = objSubTopic
    if (isPublished === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.PARENT_TOPIC.publish_topic_not_delete)
    }
  }
  // function to display modal for publish sub topic
  onUpdatePublish(subcatKey, categorykey, isPublished, details) {
    const type = 'SUB_TOPIC'
    const objSubTopic: CommonDeletePublishModal = {
      section: SECTIONS.subTopic,
      displayMessage: APP_MESSAGE.PUBLISH.publish,
      sectionItems: { key: subcatKey, subcatKey, categorykey, details, type },
    }
    this.publishItem = objSubTopic
    $('#modal-update-publish').modal('show')
  }
  // function to display modal for unpublish sub topic
  onUpdatUnPublish(subcatKey, categorykey, isPublished) {
    const objSubTopic: CommonDeletePublishModal = {
      section: SECTIONS.subTopic,
      displayMessage: APP_MESSAGE.UNPUBLISH.unpublish,
      sectionItems: { subcatKey, categorykey, isPublished },
    }
    this.unPublishItem = objSubTopic
    $('#modal-update-unpublish').modal('show')
  }
  validateWhiteSpace() {
    const formId = this.SubTopicFormAdd.value.subCategoryName
    if (formId != undefined || formId != '') {
      var regExp = /^.*(\s|\S)*(\S)+(\s|\S).*/
      var match = formId.match(regExp)
      if (match) {
        this.spaceValidate = false
      } else {
        this.spaceValidate = true
      }
    }
  }
  ///to get study materials
  getStudyMaterialList() {
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
  // function to get all practice list
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
      this.allPracticeItems = []
      this.practiceList.forEach((elements) => {
        Object.entries(elements.data).forEach(([practicekey, value]) => {
          this.allPracticeItems.push({
            /* tslint:disable */
            practicekeys: practicekey,
            practiceId: value['practiceId'],
            practicesInChapterKeys: value['practicesInChapterKey'],
            categoryNames: value['metaData'].categoryName,
            practiceNames: value['metaData'].practiceName,
            subCategoryNames: value['metaData'].subCategoryName,
            categoryKeys: value['metaData'].categorykey,
            isPublished: value['metaData'].isPublished,
            subCategoryKeys: value['metaData'].subCategoryKey,
            chapterName: value['metaData'].chapterName,
            chapterkey: value['metaData'].chapterkey,
            totalNoOfQuestion: value['metaData'].totalNoOfQuestions,
          })
        })
      })
    })
  }
  isPremiumEvent(event) {
    if (event.target.checked === true) {
      this.isPremium = true
    } else {
      this.isPremium = false
    }
  }
  setsubTopicSearchForm() {
    this.subTopicSearchForm = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
      chapterName: [''],
    })
  }
  // function to filter subcategories based on categories
  changeCategory() {
    const categories = this.searchFilter.mainTopic
    if (categories.$key !== '') {
      this.subTopicList = this.subTopics.filter(
        (item) => item.categorykey === categories.$key
      )
      this.pageNo = 1
    }
  }
  // function to filter subcategories based on categories
  filterCategory() {
    // const category = this.studyMaterialForm.value.categoryName
    const parentKey = this.subtopicformAdd.parentKey.value
    this.MainTopics = this.MainTopicList.filter(
      (item) => item.parentKey === parentKey.$key
    )
    // this.MainTopics.unshift({
    //   $key: '',
    //   categoryName: 'Select main topic',
    // })
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
  checkDuplicatedValue(name){

  }
}
