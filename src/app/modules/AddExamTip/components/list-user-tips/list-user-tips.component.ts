import { Component, OnInit } from '@angular/core'
import {
  UserTipService,
  MainTopicService,
  CommonDeletePublishModal,
  ToastMessageService,
} from '@app/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any
import * as _ from 'lodash'
import { APP_MESSAGE } from '@app/core/config'
import { SECTIONS } from '@app/core/utils'
@Component({
  selector: 'app-list-user-tips',
  templateUrl: './list-user-tips.component.html',
  styleUrls: ['./list-user-tips.component.scss'],
})
export class ListUserTipsComponent implements OnInit {
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  userTipList: any[];
  categorykey: any;
  MainTopicList: any[];
  addExamTipForm: any;
  alluserTipList: any[];
  isDataLoaded = false;
  userTipItems: any[] = [];
  categoryKey: any;
  userTipKey: any;
  pageSort = 'asc';
  deleteItem: any;
  //for pagination;
  serachExamTip: any;
  pageNo: number = 1;
  pageNoBind: number;
  onSearchChange(searchKey: string): void {
    this.pageNo = 1;
  }
  pageMaxSize: number = 10;
  itemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  constructor(
    public userTipService: UserTipService,
    public mainTopicService: MainTopicService,
    public formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastMessageService,
    public activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage ? parseInt(params.itemsPerPage) : 10;
    });
    this.setExamTipformForm()
  }

  ngOnInit(): void {
    this.getUserTipList()
    this.getMainTopicList()
  }
  // function to get all exam tips
  getUserTipList() {
    this.userTipService.getUserTips().subscribe((list) => {
      this.isDataLoaded = true
      this.userTipList = list.map((item) => {
        return {
          $key: item.key,
          data: item.payload.val(),
        }
      })
      this.userTipItems = []
      this.userTipList.forEach((category) => {
        Object.entries(category.data).forEach(([usertipkey, value]) => {
          const eachUserTipList = {
            categoryKey: category.$key,
            userTipKey: usertipkey,
            /* tslint:disable */
            examTipName: value['examTipName'],
            examTipDescription: value['examTipDescription'],
            isPublished: value['isPublished'],
          }
          this.userTipItems.push(eachUserTipList)
        })
      })

      this.alluserTipList = this.userTipItems
    })
    this.sortResult(this.alluserTipList, this.pageSort)
  }

  setExamTipformForm() {
    this.addExamTipForm = this.formbuilder.group({
      categoryName: [''],
    })
  }
  // ascending and descending sorting
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.alluserTipList, this.pageSort)
  }
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.alluserTipList, this.pageSort)
  }
  sortResult(source, sort) {
    this.alluserTipList = _.orderBy(
      source,
      [(data) => data?.examTipName?.toLowerCase()],
      sort
    )
  }
  // function to get all categories
  getMainTopicList() {
    this.mainTopicService.getMainTopics().subscribe((list) => {
      const MainTopicList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      });
      this.MainTopicList = _.orderBy(
        MainTopicList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
    })
  }

  resetFilter() {
    this.serachExamTip = '';
    this.getMainTopicList();
    this.getUserTipList()
  }
  // function to list all exam tips based on a category
  changeCategory() {
    const categoryName = this.addExamTipForm.value
    this.alluserTipList = this.userTipItems.filter(
      (item) => item.categoryKey === categoryName.categoryName.$key
    )
  }

  addExamTips() {
    this.router.navigate(['/add-exam-tips/manage'], {
      queryParams: { pageNo: this.pageNo, itemsPerPage: this.itemsPerPage },
    })
  }
  // function to show modal for delete exam tip
  onDeleteExamTip(categoryKey, userTipKey) {
    const objExamTip: CommonDeletePublishModal = {
      section: SECTIONS.examTip,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { categoryKey, userTipKey },
    }
    this.deleteItem = objExamTip
    $('#showDeleteDialog').modal('show')
  }
  // redirect to edit exam tip
  onUpdatexamTip(categoryKey, userTipKey) {
    this.router.navigate(['/add-exam-tips/manage'], {
      queryParams: { 
        CatKey: categoryKey, 
        usertipKey: userTipKey, 
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage 
      }
    })
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
