import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner'
import { PaginationInstance } from 'ngx-pagination'
import {
  ParentTopicService,
  ToastMessageService,
  ParentTopicModel,
  CommonDeletePublishModal,
} from '@app/core'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'
declare var $: any
import { SECTIONS } from '@app/core/utils'
@Component({
  selector: 'app-parent-topic',
  templateUrl: './parent-topic.component.html',
  styleUrls: ['./parent-topic.component.scss'],
})
export class ParentTopicComponent implements OnInit {
  parentForm: FormGroup;
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  deleteItems: CommonDeletePublishModal;
  parentTopicList = [];
  parentTopicName: string;
  parentTopicItems: any[];
  submitted = false;
  isDataLoaded = false;
  pageSort = 'asc';
  deleteItem: any;
  publishItem: any;
  Id: any;
  unPublishItem: any;
  test: string;
  spaceValidate: boolean;
  isPremium = false;
  //for pagination
  searchParentTopic;
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
    public parentTopicService: ParentTopicService,
    private spinner: NgxSpinnerService
  ) {
    this.setParentForm()
  }

  ngOnInit() {
    this.getParentTopicList()
  }
  // Initialize parent form
  setParentForm() {
    this.parentForm = this.formbuilder.group({
      parentName: ['', Validators.required],
      ispremium: [''],
    })
  }
  validateWhiteSpace() {
    const videoID = this.parentForm.value.parentName
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
  loadSpinner(isShow: boolean) {
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  get parentform() {
    return this.parentForm.controls
  }
  // function to get all parent topics
  getParentTopicList() {
    this.loadSpinner(true)
    this.parentTopicService.getParentTopics().subscribe((list) => {
      this.loadSpinner(false)
      this.isDataLoaded = true
      const result = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      })
      this.sortResult(result, this.pageSort)
    })
  }
  // function to add parent topic
  addParentTopic() {
    this.submitted = true
    const parentTopic = this.parentForm.value.parentName
    const parentName = (parentTopic || '').trim()
    const isPremium = this.isPremium
    if (!parentName) {
      return
    }
    if (this.isTopicNameExists('')) {
      const objParentTopic: ParentTopicModel = {
        $key: '',
        parentName,
        isPremium,
        isPublished: false,
      }
      const objResult = this.parentTopicService.manageParentTopic(
        objParentTopic
      )
      if (objResult) {
        this.submitted = false
        this.toastr.show(APP_MESSAGE.PARENT_TOPIC.parent_topic_create, false)
        $('#showAddTopicDialog').modal('hide')
        this.parentForm.reset()
      } else {
        this.toastr.show(APP_MESSAGE.COMMON.some_went_wrong)
      }
    }
  }

  // function to check whether same parent topic exist or not
  isTopicNameExists(key = '') {
    const {
      valid,
      invalid,
      value: { parentName },
    } = this.parentForm

    // this.parentTopicItems
    const topicItems = this.parentTopicList.filter(
      (item) =>
        item.parentName.toLowerCase().replace(/\s/g, '') ===
        parentName.toLowerCase().replace(/\s/g, '')
    )

    if (topicItems.length === 0) {
      return true
    }

    let isNotExists = false
    if (key) {
      if (topicItems.filter((itm) => itm.$key !== key).length === 0) {
        isNotExists = true
      }
    }

    if (!isNotExists) {
      this.toastr.show(APP_MESSAGE.PARENT_TOPIC.parent_topic_exists)
    }
    return isNotExists
  }

  // function to close modal box
  onDialogClose(modalId) {
    this.submitted = false
    $('#' + modalId).modal('hide')
  }
  // function to reset filter
  resetFilter() {
    this.searchParentTopic = ''
  }
  // ascending sort
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.parentTopicList, this.pageSort)
  }
  // descending sort
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.parentTopicList, this.pageSort)
  }

  sortResult(source, sort) {
    this.parentTopicList = _.orderBy(
      source,
      [(data) => data?.parentName?.toLowerCase()],
      sort
    )
  }
  // function to get parent topic details based on a specific parent key
  parentTopicDetails($key) {
    return this.parentTopicService.getParentTopicDetails($key)
  }
  // function to show update modal popup
  onUpdateParentTopic($key) {
    this.Id = $key
    const { parentName } = this.parentTopicDetails($key)
    const { isPremium } = this.parentTopicDetails($key)
    this.parentForm.controls.parentName.setValue(parentName)
    this.isPremium = isPremium
    $('#showUpdateTopicDialog').modal('show')
  }
  // function to update parent topic
  updateParentTopic($key) {
    this.submitted = true
    if (this.parentForm.valid) {
      if (this.isTopicNameExists($key)) {
        const parentName = this.parentForm.value.parentName
        const { isPublished } = this.parentTopicDetails($key)
        const objParentTopic: ParentTopicModel = {
          $key,
          parentName,
          isPremium: this.isPremium,
          isPublished: false,
        }
        this.parentTopicService.manageParentTopic(objParentTopic).then(() => {
          this.parentForm.reset()
          $('#showUpdateTopicDialog').modal('hide')
          this.submitted = false

          this.toastr.show(APP_MESSAGE.PARENT_TOPIC.parent_topic_update, false)
        })
      }
    }
  }
  // function to show delete topic modal
  onDeleteTopic($key, isPublished) {
    const id = $key
    const objParentTopic: CommonDeletePublishModal = {
      section: SECTIONS.parentTopic,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { id, isPublished },
    }
    this.deleteItem = objParentTopic;
    if (isPublished === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.PARENT_TOPIC.publish_topic_not_delete)
    }
  }
  // function to display modal for publish parent topic
  onUpdatePublish($key, isPublished, details) {
    const type = 'PARENT_TOPIC'
    const id = $key
    const objParentTopic: CommonDeletePublishModal = {
      section: SECTIONS.parentTopic,
      displayMessage: APP_MESSAGE.PUBLISH.publish,
      sectionItems: { id, key: id, isPublished, details, type },
    }
    this.publishItem = objParentTopic
    $('#modal-update-publish').modal('show')
  }
  // function to display modal for unpublish parent topic
  onUpdateUnpublish($key, isPublished) {
    const id = $key
    const objParentTopic: CommonDeletePublishModal = {
      section: SECTIONS.parentTopic,
      displayMessage: APP_MESSAGE.UNPUBLISH.unpublish,
      sectionItems: { id, isPublished },
    }
    this.unPublishItem = objParentTopic
    $('#modal-update-unpublish').modal('show')
  }
  isPremiumEvent(event) {
    if (event.target.checked === true) {
      this.isPremium = true
    } else {
      this.isPremium = false
    }
  }
  // for pagination
  onPageBoundsCorrection(number: number) {
    console.log("number",number)
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
