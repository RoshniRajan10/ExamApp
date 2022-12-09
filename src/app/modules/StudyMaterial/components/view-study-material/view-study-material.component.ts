import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import {
  ToastMessageService,
  MainTopicService,
  StudyMaterialService,
  AddStudyMaterialModel,
  CommonDeletePublishModal,
} from '@app/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'
import * as firebase from 'firebase'
import { SECTIONS } from '@app/core/utils'
declare var $: any
@Component({
  selector: 'app-view-study-material',
  templateUrl: './view-study-material.component.html',
  styleUrls: ['./view-study-material.component.scss'],
})
export class ViewStudyMaterialComponent implements OnInit {  
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  deleteMessage = APP_MESSAGE.DELETE.delete;
  subcategoryKey: any;
  studymatkey: any;
  studyMaterialID: any;
  data: any;
  studyMaterialList: any[] = [];
  pageSort = 'asc';
  allstudyMaterialItems: any[];
  studyMatkey: any;
  studyMaterialsInSubCategoriesKey: any;
  public data1: any;
  categoryName: any;
  subCategoryName: any;
  studyMaterialName: any;
  isPublished: any;
  PublishedStatus: string;
  isDataLoaded = false;
  chapterKeys: any;
  studyMaterialsInChapterKey: any;
  deleteItem: any;
  //for pagination
  searchStudyMaterial;
  smPageNo: number = 1;
  smitemsPerPage: number = 10;
  pageNo: number;
  itemsPerPage: number;
  pageNoBind: number;
  onSearchChange(searchKey: string): void {
    this.pageNo = 1
  }
  pageMaxSize: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  constructor(
    public formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastMessageService,
    public mainTopicService: MainTopicService,
    public activatedRoute: ActivatedRoute,
    public studyMaterialService: StudyMaterialService,
    private spinner: NgxSpinnerService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.subcategoryKey = params.subcategoryKeys;
      this.studyMaterialID = params.studyMaterialIDs;
      this.studyMaterialsInChapterKey = params.studyMaterialsInChapterKeys;
      this.chapterKeys = params.chapterKey;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      this.smPageNo = params.smPageNo ? params.smPageNo : 1;
      this.smitemsPerPage = params.smitemsPerPage ? parseInt(params.smitemsPerPage) : 10;
    })
  }
  async ngOnInit() {
    this.getStudyMaterial();
    this.getStuMaterialDetails()
  }
  getStudyMaterial() {
    this.spinner.show()
    this.isDataLoaded = true;
    this.studyMaterialService.getAllStudyMaterialBykeyNew(this.studyMaterialID)
    .once('value').then((snapshot)=>{
      this.spinner.hide();
      this.data1 = Object.values(snapshot.val());
      if(this.data1[1]){
        this.studyMaterialList = Object.entries(this.data1[1]).map((element: any)=>{
          return {
            studyMatDatakey: element[0],
            studyMaterialID: this.studyMaterialID,
            createdAt: element[1].createdAt ? element[1].createdAt : "",
            description: element[1].description ? element[1].description : "",
            hasImage: element[1].hasImage ? element[1].hasImage : "",
            hasText: element[1].hasText ? element[1].hasText : "",
            imageLink: element[1].imageLink ? element[1].imageLink : "",
            title: element[1].title ? element[1].title : "",
          }
        });
        this.allstudyMaterialItems = this.studyMaterialList;
      }
    });
  }
  // function to get details from studymaterialsInSubCategories
  getStuMaterialDetails() {
    this.studyMaterialService.getStuMaterialDetails(
      this.chapterKeys,
      this.studyMaterialsInChapterKey
    ).once('value').then((snapshot) => {
      const objStudyMarRes: any =  snapshot.val();
      this.categoryName = objStudyMarRes.categoryName
      this.subCategoryName = objStudyMarRes.subCategoryName
      this.studyMaterialName = objStudyMarRes.studyMaterialName
      this.isPublished = objStudyMarRes.isPublished
      if (this.isPublished === true) {
        this.PublishedStatus = 'Published'
      } else {
        if (this.isPublished === false) {
          this.PublishedStatus = 'Not Published'
        }
      }
    });    
  }
  resetFilter() {
    this.searchStudyMaterial = ''
  }
  // sorting
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.allstudyMaterialItems, this.pageSort)
  }
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.allstudyMaterialItems, this.pageSort)
  }
  sortResult(source, sort) {
    this.allstudyMaterialItems = _.orderBy(
      source,
      [(data) => data?.title?.toLowerCase()],
      sort
    )
  }
  // function to show modal for delete data
  onDeleteStudyMaterial(studyMaterialID, studyMatDatakey) {
    this.studyMaterialID = studyMaterialID
    this.studyMatkey = studyMatDatakey
    $('#showDeleteDialog').modal('show')
  }
  deleteSrusyMaterial(studyMaterialID, studyMatkey) {
    const result = this.studyMaterialService.deleteAllStudyMaterial(
      studyMaterialID,
      studyMatkey
    )
    this.studyMaterialList = []
    this.getStudyMaterial()
    $('#showDeleteDialog').modal('hide')
  }

  // redirect to edit page
  editStudyMaterial(studyMatDatakey, studyMaterialID) {
    this.router.navigate(['/manage-study-material/update'], {
      queryParams: {
        chapterKey: this.chapterKeys,
        studyMaterialsInChapterKeys: this.studyMaterialsInChapterKey,
        studymatKey: studyMaterialID,
        studyMatDatakeys: studyMatDatakey,
        subcategoryKeys: this.subcategoryKey,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        smPageNo: this.smPageNo,
        smitemsPerPage: this.smitemsPerPage
      }
    })
  }
  // redirect to add material page
  AddStudyMaterial() {
    this.router.navigate(['/manage-study-material/add'], {
      queryParams: {
        chapterKey: this.chapterKeys,
        studyMaterialsInChapterKeys: this.studyMaterialsInChapterKey,
        studymatKey: this.studyMaterialID,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        smPageNo: this.smPageNo,
        smitemsPerPage: this.smitemsPerPage
      },
    })
  }
  Back() {
    this.router.navigate(['/study-material'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      }
    });
  }
  // for pagination
  onPageBoundsCorrection(number: number) {
    this.smPageNo = number;
    this.toastr.show("Number exceeded page limit")
  }
  checkPageNumber(event){
    if(event.target.value && event.target.value < 1){
        this.smPageNo = 1;
        this.toastr.show("Page number should not be less than 1");
    } else if(event.target.value === ""){
      this.smPageNo = 1;
    } else {
      this.smPageNo = event.target.value;
    }
  }
}
