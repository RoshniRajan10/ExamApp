import { Component, OnInit } from '@angular/core';
import { APP_MESSAGE } from '@app/core/config';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SECTIONS } from '@app/core/utils';
import { Router } from '@angular/router';
import {
  ContentReviewService,
  ToastMessageService,
  PushNotificationService,
  CommonDeletePublishModal,
} from '@app/core';

declare var $: any;
import * as _ from 'lodash';
import { Console } from 'console';
@Component({
  selector: 'app-content-review',
  templateUrl: './content-review.component.html',
  styleUrls: ['./content-review.component.scss']
})
export class ContentReviewComponent implements OnInit {

  commentForm: FormGroup;
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  isDataLoaded: boolean;
  isPublished: any;
  contentReviews: any[];
  pageSort: any;
  allContentReviews: any[];
  contentReviewsScratch: any[];
  submitted: boolean;
  selectedId: any;
  comments: any;
  commentStatus: any;
  deleteItem: any;
  comment: any = '';
  module: any;
  rev_type: any;
  contentReviewFormAD: FormGroup;
 //for pagination
 searchReviews: any;
 pageNo: number = 1;
 pageNoBind: number;
 onSearchChange(searchKey: string): void {
   this.pageNo = 1
 }
 pageMaxSize: number = 10;
 itemsPerPage: number = 10;
 itemsPerPageValues = [5,10,20,50,100];
 //for pagination end
  errorDetails: any;
  constructor(
    public formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastMessageService,
    public contentReviewService: ContentReviewService,
    private spinner: NgxSpinnerService,
    public pushNotificationService: PushNotificationService
  ) {
    this.setCommentForm();
    this.setuserFormAD();
  }
  
  
  ngOnInit() {
    this.getContentReviewsList()
  }
  // function to initialize month form
  setCommentForm() {
    this.commentForm = this.formbuilder.group({
      comments: ['', Validators.required],
    })
  }
  get commentform() {
    return this.commentForm.controls
  }
  // function to get all current affairs
  getContentReviewsList() {
    this.spinner.show()
    this.contentReviewService.getContentReviews().subscribe((list) => {
      this.isDataLoaded = true
      const data = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        this.spinner.hide()
        return itemList
      });
      const reviews = data.map((review)=>{
        const items = {
          [review.$key]:{
            UserErrorReported: review.UserErrorReported,
            UserReported: review.UserReported
          }
        }
        return items
      })
      this.contentReviewsScratch = [];
      reviews.forEach((moduleLevel)=>{
        Object.entries(moduleLevel).forEach(([moduleName, value]) => {
          let Module;
          let examnode = false;
          let practiceNode = false;
          if(moduleName === 'exams'){Module = 'Exam'; examnode = true}
          if(moduleName === 'practices'){Module = 'Practice'; practiceNode = true}
          Object.entries(value).forEach(([revType, revTypevalue])=>{
            if(revType == 'UserErrorReported'){
                Object.entries(revTypevalue).forEach(([revKey, revValue])=>{
                  // console.log(revValue)
                  Object.entries(revValue).forEach(([key2, metaDataNode])=>{
                    if(typeof metaDataNode.metaData !== 'undefined'){
                      this.contentReviewsScratch.push({
                        subCategoryName:metaDataNode.metaData.subCategoryName,
                        mainTopic:metaDataNode.metaData.categoryName,
                        examName:metaDataNode.metaData.examName,
                        practiceName:metaDataNode.metaData.practiceName,
                        module: moduleName,
                        modulename: Module,
                        reviewType: revType,
                        reviewKey: revKey,
                        reviews: revValue,
                        optionChose: revValue['optionChose'],
                        errorDescription: revValue['errorDescription'],
                        examnode:  examnode,
                        practiceNode:  practiceNode
                      })
                    }
                  });
                });
              }
            });
          });
        });
      this.filterContent()
    })
    this.sortResult(this.allContentReviews, this.pageSort)
  }
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.allContentReviews, this.pageSort)
  }
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.allContentReviews, this.pageSort)
  }
  sortResult(source, sort) {
    this.allContentReviews = _.orderBy(
      source,
      [(data) => data?.optionChose?.toLowerCase()],
      sort
    )
  }
  // function to add comments
  addComments() {
    this.submitted = true;
    const { comments } = this.commentForm.value
    const objComment = {
      comments,
      status: false,
    }
    console.log(objComment);
    const objResult = this.contentReviewService.addComments(objComment)
    if (objComment && this.commentForm.valid) {
      this.submitted = false
      this.toastr.show(APP_MESSAGE.MONTH.month_create, false)
      $('#reviewCommentAdd').modal('hide')
      this.commentForm.reset()
    }
  }
  // function to show modal for update comments
  onUpdateComment(module, revType, reviewKey) {
    this.selectedId = reviewKey
    this.module = module
    this.rev_type = revType
    $('#reviewCommentUpdate').modal('show')
    const reviews = this.allContentReviews.filter(node => node.reviewKey == reviewKey)
    let comments;
    if(reviews[0].reviews.comments) {comments = reviews[0].reviews.comments} else {comments = ''}
    this.commentForm.controls.comments.setValue(comments)
  }
  // function to update Comments
  updateComment(selectedId,module,rev_type) {
    this.submitted = true
    const { comments } = this.commentForm.value
    if(comments !== ''){
      this.contentReviewService.updateComment(selectedId,module,rev_type,comments)
      this.toastr.show(APP_MESSAGE.CONTENT_REVIEWS.comment_add, false);
      $('#reviewCommentUpdate').modal('hide');
      this.submitted = false;
      this.commentForm.reset();
    } else {
      return false;
    }
    
  }
  onDialogClose(modalId) {
    this.submitted = false
    $('#' + modalId).modal('hide')
    this.commentForm.reset()
  }
  resetFilter() {
    this.searchReviews = ''
  }
  setuserFormAD() {
    this.contentReviewFormAD = this.formbuilder.group({
      contentStatus: [''],
    })
  }
  filterContent(){
    
    const selection =  this.contentReviewFormAD.value.contentStatus;
    if(selection === ""){
      this.allContentReviews = this.contentReviewsScratch;
    } else if(selection === "1"){
      this.pageNo = 1;
      this.allContentReviews = this.contentReviewsScratch.filter(status => status.reviews.status == true)
    } else if(selection === "2"){
      this.allContentReviews = this.contentReviewsScratch.filter(
        status => (status.reviews.status == false)||(!status.reviews.status)
      )
      this.pageNo = 1;
    }
  }

  // function to show modal for update comments
  onDetailedView(data) {
    this.errorDetails = data;
    $('#errorDetailedView').modal('show')
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
