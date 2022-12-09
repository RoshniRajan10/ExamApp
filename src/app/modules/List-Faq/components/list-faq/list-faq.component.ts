import { Component, OnInit } from '@angular/core'
import {
  CommonDeletePublishModal,
  FaqService,
  MainTopicService,
  ToastMessageService,
} from '@app/core'
import { FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any
import * as _ from 'lodash'
import { APP_MESSAGE } from '@app/core/config'
import { SECTIONS } from '@app/core/utils'
import { NgxSpinnerService } from 'ngx-spinner'
@Component({
  selector: 'app-list-faq',
  templateUrl: './list-faq.component.html',
  styleUrls: ['./list-faq.component.scss'],
})
export class ListFaqComponent implements OnInit {
  faqList: any[];
  categorykey: any;
  MainTopicList: any[];
  addExamTipForm: any;
  allFaqList: any[];
  subCatname: any[] = [];
  searchFaqForm: any;
  subCategoryList = [];
  subCategories: any;
  MainTopicItems1: any[] = [];
  faqItems: any[] = [];
  subcatKey: any;
  faqKey: any;
  isPublished: boolean;
  pageSort = 'asc';
  //for pagination
  pageNo: number = 1;
  pageNoBind: number;
  pageMaxSize: number = 10;
  itemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  isDataLoaded = false;
  result: any[];
  publishItem: any;
  unPublishItem: any;
  deleteItem: any;
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  searchFilter = {
    mainTopic: { $key: '', categoryName: 'Select main topic' },
    subTopic: { $key: '', subCategory: 'Select sub topic'}
  };
  constructor(
    public faqService: FaqService,
    public mainTopicService: MainTopicService,
    public formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastMessageService,
    private spinner: NgxSpinnerService,
    public activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage ? parseInt(params.itemsPerPage) : 10;
    });
    this.setSearchFaqorm()
  }

  ngOnInit(): void {
    this.getFaqList()
    this.getMainTopicList()
  }
  // function to get all faq list
  getFaqList() {
    this.spinner.show()
    this.faqService.getfaq().subscribe((list) => {
      this.isDataLoaded = true;
      this.spinner.hide()
      this.faqList = list.map((item) => {
        return {
          $key: item.key,
          data: item.payload.val(),
        }
      })
      this.faqItems = []
      this.faqList.forEach((subcategory) => {
        Object.entries(subcategory.data).forEach(([faqkey, value1]) => {
          /* tslint:disable */
          const eachfaqList = {
            faqKey: faqkey,
            categoryKey: value1['categorykey'],
            subcatKey: subcategory.$key,
            fQuestion: value1['fQuestion'],
            fAnswer: value1['fAnswer'],
            isPublished: value1['isPublished'],
          }
          this.faqItems.push(eachfaqList)
        })
      })
      this.allFaqList = this.faqItems
      if(this.searchFaqForm.value.subCategoryName.$key !== ''){
        this.changeSubCategory();
      } else if(this.searchFaqForm.value.categoryName.$key !== ''){
        this.changeCategory();
      }
    })
  }
  setSearchFaqorm() {
    this.searchFaqForm = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
    })
  }
  // function to get all categories
  getMainTopicList() {
    this.mainTopicService.getMainTopics().subscribe((list) => {
      const MainTopicList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.MainTopicList = _.orderBy(
        MainTopicList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
      // console.log("this.MainTopicList",this.MainTopicList)
      this.MainTopicList.unshift({ $key: '', categoryName: 'Select main topic' })
      this.searchFilter.mainTopic = this.MainTopicList[0]
      this.subCatname.unshift({ $key: '', subCategory: 'Select sub topic' })
      this.searchFilter.subTopic = this.subCatname[0]
      this.MainTopicItems1 = []
      this.subCategoryList = []
      this.MainTopicList.forEach((category) => {
        this.subCategories = category.subCategories
        if (this.subCategories) {
          this.subCategoryList.push(this.subCategories)
        }
        if (!this.subCategories) {
        } else {
          Object.entries(category.subCategories).forEach(
            ([subcatkey, value]) => {
              this.MainTopicItems1.push({
                $key:subcatkey,
                parentkey: category.parentKey,
                subcatKey: subcatkey,
                categorykey: category.$key,
                category: category.categoryName,
                subCategory: value['subCategoryName'],
              })
            }
          )
        }
      })
    })
  }
  // ascending and descending sort
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.allFaqList, this.pageSort)
  }
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.allFaqList, this.pageSort)
  }
  sortResult(source, sort) {
    this.allFaqList = _.orderBy(
      source,
      [(data) => data?.fQuestion?.toLowerCase()],
      sort
    )
  }
  // function to filter subcategories based on categories
  changeCategory() {
    const faqList = this.faqItems;
    const categories = this.searchFilter.mainTopic;
    if(categories.$key !== ""){
      this.allFaqList = faqList.filter((item) => item.categoryKey === categories.$key);
      this.subCatname = [];
      this.subCatname = this.MainTopicItems1.filter((item) => item.categorykey === categories.$key);
      this.subCatname.unshift({ $key: '', subCategory: 'Select sub topic' });
      this.searchFilter.subTopic = this.subCatname[0];
    } else {
      this.allFaqList = faqList;
    }
  }
  // function to filter chapters based on subcategories
  changeSubCategory() {
    const faqList = this.faqItems;
    const categories = this.searchFilter.mainTopic;
    const subCategories = this.searchFilter.subTopic;
    if(subCategories.$key !== ""){
      this.allFaqList = faqList.filter((item) =>
        (item.subcatKey === subCategories.$key) && (item.categoryKey === categories.$key)
      )
    } else if(categories.$key !== "") {
      this.allFaqList = faqList.filter((item) => item.categoryKey === categories.$key);
    } else {
      this.allFaqList = faqList;
    }
  }

  addExamTips() {
    this.router.navigate(['/add-faq'], {
      queryParams: { pageNo: this.pageNo, itemsPerPage: this.itemsPerPage }
    });
  }
  // function to show modal for delete faq
  onDeleteFaq(subcatKey, faqKey, isPublished) {
    const objFaq: CommonDeletePublishModal = {
      section: SECTIONS.faq,
      displayMessage: APP_MESSAGE.FAQ.faq_delete,
      sectionItems: { subcatKey, faqKey },
    }
    this.deleteItem = objFaq
    if (isPublished === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.FAQ.faq_cant_delete)
    }
  }

  onUpdateFaq(subcatKey, faqKey) {
    this.router.navigate(['/add-faq'], {
      queryParams: { 
        subKey: subcatKey, 
        faqkey: faqKey,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage 
      }
    });
  }
  cancelPublish() {}
  // function to display modal for publish faq
  onUpdatePublish(subcatKey, faqKey, isPublished, details) {
    const type = 'FAQ'
    const objSubTopic: CommonDeletePublishModal = {
      section: SECTIONS.faq,
      displayMessage: APP_MESSAGE.PUBLISH.publish,
      sectionItems: { subcatKey, faqKey, isPublished, details, type }
    }
    this.publishItem = objSubTopic
    $('#modal-update-publish').modal('show')
  }
  // function to display modal for unpublish faq

  onUpdateUnPublish(subcatKey, faqKey, isPublished) {
    const objSubTopic: CommonDeletePublishModal = {
      section: SECTIONS.faq,
      displayMessage: APP_MESSAGE.UNPUBLISH.unpublish,
      sectionItems: { subcatKey, faqKey, isPublished },
    }
    this.unPublishItem = objSubTopic

    $('#modal-update-unpublish').modal('show')
  }

  //Reset fields
  resetFilter() {
    this.searchFilter.mainTopic = this.MainTopicList[0]
    this.subCatname = [{ $key: '', subCategory: 'Select sub topic'}];
    this.searchFilter.subTopic = this.subCatname[0]
    this.getFaqList();
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
