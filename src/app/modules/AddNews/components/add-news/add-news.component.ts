import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import {
  NewsService,
  ToastMessageService,
  NewsModel,
  MainTopicService,
} from '@app/core'
import { Router, ActivatedRoute } from '@angular/router'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.scss'],
})
export class AddNewsComponent implements OnInit {
  categoryList: any[];
  addNewsForm: FormGroup;
  submitted: boolean;
  CatKey: any;
  newsKey: any;
  categoryKey: any;
  categoryName: any;
  categoryNames: any;
  pageNo: number;
  itemsPerPage: number;
  invalidUrl: boolean;

  public myreg = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi
  constructor(
    public newsService: NewsService,
    public mainTopicService: MainTopicService,
    public formbuilder: FormBuilder,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastMessageService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.CatKey = params.CatKey;
      this.newsKey = params.newsKeys;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
    })
    this.setNewsForm()
  }

  ngOnInit(): void {
    this.getCategoryList()
    this.onUpdateNews(this.CatKey, this.newsKey)
  }

  get newsform() {
    return this.addNewsForm.controls
  }
  // Initialize news form
  setNewsForm() {
    this.addNewsForm = this.formbuilder.group({
      categoryKey: [''],
      categoryName: [''],
      createdAt: [''],
      description: [''],
      newsName: [''],
      newsLink: ['', Validators.pattern(this.myreg)],
    })
  }
  // function to get all categories
  getCategoryList() {
    this.mainTopicService.getMainTopics().subscribe((list) => {
      const categoryList = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      });
      this.categoryList = _.orderBy(
        categoryList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
    })
  }
  // function to add news
  addNews() {
    const { valid, invalid } = this.addNewsForm
    this.submitted = true
    if (valid) {
      const createdAt = new Date().getTime()
      const { description, newsName, newsLink } = this.addNewsForm.value
      const objNews: NewsModel = {
        $key: '',
        categoryKey: this.addNewsForm.value.categoryKey.$key,
        categoryName: this.addNewsForm.value.categoryKey.categoryName,
        description,
        newsName,
        newsLink,
        createdAt,
      }

      const objResult = this.newsService.manageNews(objNews)
      if (objResult) {
        this.submitted = false;
        this.addNewsForm.reset();
        this.toastr.show(APP_MESSAGE.NEWS.news_create, false)
        this.router.navigate(['/News'], {
          queryParams: {
            pageNo: this.pageNo,
            itemsPerPage: this.itemsPerPage
          }
        });
      } 
      // else {
      //   this.toastr.show(APP_MESSAGE.COMMON.some_went_wrong)
      // }
    }
  }
  // function to get news details based on newskey
  newsDetails(CatKey, newsKey) {
    return this.newsService.getNewsDetailss(CatKey, newsKey)
  }
  // function to get category details based on category key
  categoryDetails(categoryKey) {
    return this.newsService.getCategoryDetails(categoryKey)
  }
  // function to set values for edit
  onUpdateNews(CatKey, newsKey) {
    if (this.CatKey) {
      this.newsService.getNewsDetailss(CatKey, newsKey)
      .on('value', (snapshot) => {
        const data = snapshot.val();
        const {
          description,
          newsName,
          newsLink,
          categoryKey,
          categoryName,
        } = data
        this.categoryNames = categoryName
        this.addNewsForm.controls.description.setValue(description)
        this.addNewsForm.controls.newsName.setValue(newsName)
        this.addNewsForm.controls.newsLink.setValue(newsLink)
      })
    }
  }
  // function to update news
  updateNews() {
    this.submitted = true
    const { valid, invalid } = this.addNewsForm
    if (valid) {
      const {
        description,
        newsName,
        newsLink,
        categoryName,
      } = this.addNewsForm.value
      const categoryKey = this.CatKey
      this.categoryNames = categoryName
      this.newsService
        .updateNews(
          this.CatKey,
          this.newsKey,
          categoryName,
          description,
          newsName,
          newsLink,
          categoryKey
        )
        .then(() => {
          this.submitted = false
          this.toastr.show(APP_MESSAGE.NEWS.news_update, false)
          this.router.navigate(['/News'], {
            queryParams: {
              pageNo: this.pageNo,
              itemsPerPage: this.itemsPerPage
            }
          });
          this.addNewsForm.reset()
        })
    }
  }
  gotoList() {
    this.router.navigate(['/News'], {
      queryParams: {
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage
      }
    });
  }
  clearAll() {
    this.addNewsForm.reset()
  }
  urlValidation(event){
    console.log("event",event.target.value)
    let res = event.target.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res === null){
      this.invalidUrl = true;
    } else {
      this.invalidUrl = false
    }
  }
}
