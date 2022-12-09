import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import {
  FaqService,
  ToastMessageService,
  FaqModel,
  MainTopicService,
} from '@app/core'
import { Router, ActivatedRoute } from '@angular/router'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'
@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss'],
})
export class AddFaqComponent implements OnInit {
  faqList: any[];
  categorykey: any;
  serachExamTip: any;
  MainTopicList: any[];
  addExamTipForm: any;
  allFaqList: any[];
  subatname: any[];
  addFaqForm: any;
  subCategoryList = [];
  subCategories: any;
  MainTopicItems1: any[] = [];
  submitted: boolean;
  categoryKey: any;
  subCatKey: any;
  faqKey: any;
  categoryName1: any;
  data: any;
  categoryName: any;
  subCategoryName: any;
  subCategoryName1: any;
  result: any[];
  subCategoryNames: any;
  pageNo: number;
  itemsPerPage: number;
  constructor(
    public faqService: FaqService,
    public mainTopicService: MainTopicService,
    public formbuilder: FormBuilder,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastMessageService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.categoryKey = params.CatKey;
      this.subCatKey = params.subKey;
      this.faqKey = params.faqkey;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage
    });
    this.setFaqForm();
  }

  ngOnInit(): void {
    this.getMainTopicList()
    this.onUpdateFaq()
  }
  // function to get all main topics
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
      this.MainTopicList.unshift({
        $key: '',
        categoryName: 'Select main topic',
      })
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
                parentkey: category.parentKey,
                subcatKey: subcatkey,
                categorykey: category.$key,
                category: category.categoryName,
                // tslint:disable-next-line: no-string-literal
                subCategory: value['subCategoryName'],
              })
              this.changeCategorys()
              this.result = this.MainTopicItems1
            }
          )
        }
      })
    })
  }
  get addFaqform() {
    return this.addFaqForm.controls
  }
  // function to initialize faq form
  setFaqForm() {
    this.addFaqForm = this.formbuilder.group({
      fAnswer: [''],
      fQuestion: [''],
      isPublished: [''],
      subCategoryName: [''],
      categoryName: [''],
    })
  }
  // function to filter subcategories based on a category
  changeCategory() {
    const category = this.addFaqForm.value.categoryName.categoryName

    this.subatname = this.MainTopicItems1.filter(
      (item) => item.category === category
    )
  }
  // function to add faq
  addFaq() {
    const { valid, invalid } = this.addFaqForm
    this.submitted = true
    if (valid) {
      const createdAt = new Date().getTime()
      const categorykey = this.addFaqForm.value.categoryName.$key
      const subCategoryKey = this.addFaqForm.value.subCategoryName.subcatKey
      const { fQuestion } = this.addFaqForm.value
      const { fAnswer } = this.addFaqForm.value
      const { categoryName } = this.addFaqForm.value.categoryName
      this.subCategoryNames = this.addFaqForm.value.subCategoryName.subCategory
      const subCategoryName = this.subCategoryNames
      const objFaq: FaqModel = {
        $key: '',
        categorykey,
        subCategoryKey,
        categoryName,
        subCategoryName,
        fQuestion,
        fAnswer,
        createdAt,
        isPublished: false,
      }
      const objResult = this.faqService.manageFaq(objFaq)
      if (objResult) {
        this.submitted = false
        this.addFaqForm.reset();
        this.router.navigate(['/faq'], {
          queryParams: {
            pageNo: this.pageNo,
            itemsPerPage: this.itemsPerPage
          }
        });
        this.toastr.show(APP_MESSAGE.FAQ.faq_create, false)
      } else {
        // this.toastr.show(APP_MESSAGE.COMMON.some_went_wrong)
      }
    }
  }
  clearAll() {
    this.addFaqForm.reset()
  }

  gotoList() {
    this.router.navigate(['/faq'], {
      queryParams: {
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage
      }
    });
  }
  // function to get faq details based on category and subcategories
  faqDetails(subCatKey, faqKey) {
    return this.faqService.getFaqDetails(subCatKey, faqKey)
  }
  // function to get category details based on category key
  categoryDetails(categoryKey) {
    return this.faqService.getCategoryDetails(categoryKey)
  }
  // function to get subcategory details based on subcategory key
  subCategoryDetails(categoryKey, subCatKey) {
    return this.faqService.getSubCategoryDetails(categoryKey, subCatKey)
  }
  // function to filter subcategories based on a category
  changeCategorys() {
    const category = this.categoryKey
    this.subatname = this.MainTopicItems1.filter(
      (item) => item.categorykey === category
    )
  }
  // function to display faq details based on a particular faq key
  onUpdateFaq() {
    if (this.faqKey) {
      // console.log("faq details", this.faqDetails(this.subCatKey, this.faqKey))
      this.faqService.getFaqDetails(this.subCatKey, this.faqKey)
      .then((snapShot)=>{
        const {
          fAnswer,
          fQuestion,
          categoryName,
          subCategoryName,
        } = snapShot.val();
        console.log("snapShot.val()",snapShot.val())
        this.categoryName = categoryName ? categoryName : "";
        this.subCategoryName = subCategoryName ? subCategoryName : "";
        this.addFaqForm.patchValue({
          fQuestion: fQuestion,
          fAnswer: fAnswer,
          categoryName: this.categoryName,
          subCategoryName: this.subCategoryName
        })
      })
    }
  }
  // function to update faq
  updateFaq() {
    this.submitted = true
    const { valid, invalid } = this.addFaqForm
    if (valid) {
      const createdAt = new Date().getTime()
      const { fQuestion, fAnswer } = this.addFaqForm.value
      const isPublished = true
      this.faqService
        .updateFaq(
          this.subCatKey,
          this.faqKey,
          fQuestion,
          fAnswer,
          isPublished,
          createdAt
        )

        .then(() => {
          this.submitted = false
          this.toastr.show(APP_MESSAGE.FAQ.faq_update, false)
          this.router.navigate(['/faq'], {
            queryParams: {
              pageNo: this.pageNo,
              itemsPerPage: this.itemsPerPage
            }
          });
          this.addFaqForm.reset()
        })
    }
  }
}
