import { Component, OnInit } from '@angular/core'
import {
  NewsService,
  MainTopicService,
  ToastMessageService,
  CommonDeletePublishModal,
} from '@app/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any
import * as _ from 'lodash'
import { APP_MESSAGE } from '@app/core/config'
import { SECTIONS } from '@app/core/utils'

@Component({
  selector: 'app-list-news',
  templateUrl: './list-news.component.html',
  styleUrls: ['./list-news.component.scss'],
})
export class ListNewsComponent implements OnInit {
  newsForm: FormGroup
  noDataMsg = APP_MESSAGE.COMMON.result_not_found
  NewsList: any[]
  serachExamTip: any
  MainTopicList: any[]
  allNewsList: any[]
  NewsItems: any[] = []
  userTipKey: any
  categoryKey: any
  isDataLoaded = false
  pageSort = 'asc'
  newsKey: any
  deleteItem: any
  //for pagination
  searchNews;
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
    public newsService: NewsService,
    public mainTopicService: MainTopicService,
    public formbuilder: FormBuilder,
    public router: Router,
    public toastr: ToastMessageService,
    public activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage ? parseInt(params.itemsPerPage) : 10;
    });
    this.setNewsForm()
  }

  ngOnInit(): void {
    this.getNewsList()
    this.getMainTopicList()
  }
  // function to get all news list
  getNewsList() {
    this.newsService.getNews().subscribe((list) => {
      this.isDataLoaded = true
      this.NewsList = list.map((item) => {
        return {
          $key: item.key,
          data: item.payload.val(),
        }
      })
      this.NewsItems = []
      this.NewsList.forEach((category) => {
        /* tslint:disable */
        Object.entries(category.data).forEach(([newskey, value]) => {
          const eachUserTipList = {
            categoryKey: category.$key,
            newsKeys: newskey,
            newsName: value['newsName'],
            description: value['description'],
            isPublished: value['isPublished'],
          }
          this.NewsItems.push(eachUserTipList)
        })
      })
      this.allNewsList = this.NewsItems
    })
  }

  setNewsForm() {
    this.newsForm = this.formbuilder.group({
      categoryName: [''],
    })
  }
  // ascending and descending sort
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.allNewsList, this.pageSort)
  }
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.allNewsList, this.pageSort)
  }
  sortResult(source, sort) {
    this.allNewsList = _.orderBy(
      source,
      [(data) => data?.newsName?.toLowerCase()],
      sort
    )
  }
  // function to get all main topics
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
      this.MainTopicList.unshift({
        $key: '',
        categoryName: 'Select Main Topic',
      });
    })
  }
  // function to list all news based on main topic
  changeCategory() {
    const categoryName = this.newsForm.value
    this.allNewsList = this.NewsItems.filter(
      (item) => item.categoryKey === categoryName.categoryName.$key
    )
  }

  resetFilter() {
    this.searchNews = '';
    this.getMainTopicList();
    this.NewsItems = []
    this.getNewsList()
  }
  // function to show modal for delete news
  onDeleteNews(categoryKey, newsKeys) {
    const objNews: CommonDeletePublishModal = {
      section: SECTIONS.news,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { categoryKey, newsKeys },
    }
    this.deleteItem = objNews
    $('#showDeleteDialog').modal('show')
  }

  addNews() {
    this.router.navigate(['/add-news'], {
      queryParams: { pageNo: this.pageNo, itemsPerPage: this.itemsPerPage },
    });
  }
  // redirect to edit news
  onUpdateNews(categoryKey, newsKey) {
    this.router.navigate(['/add-news'], {
      queryParams: { 
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage, 
        CatKey: categoryKey, 
        newsKeys: newsKey 
      }
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
