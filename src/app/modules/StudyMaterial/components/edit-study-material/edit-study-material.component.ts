import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import {
  ToastMessageService,
  MainTopicService,
  StudyMaterialService,
  AddStudyMaterialModel,
  ChapterService,
} from '@app/core'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'

@Component({
  selector: 'app-edit-study-material',
  templateUrl: './edit-study-material.component.html',
  styleUrls: ['./edit-study-material.component.scss'],
})
export class EditStudyMaterialComponent implements OnInit {
  MainTopicList = [];
  subCategories: any;
  subCategoryList = [];
  MainTopicItems1 = [];
  submitted = false;
  AddStudyMaterialForm: FormGroup;
  subCatName: any[];
  subcategoryKey: any;
  categoryName: any;
  categorykey: any;
  description: any;
  isPublished: any;
  studyMaterialName: any;
  subCategoryKey: any;
  subCategoryName: any;
  studyMaterialsInChapterKeys: any;
  chapterKeys: any;
  chapterItems: any[];
  chapterData: any[] = [];
  chapterList: any[];
  chapterName: any;
  studyMaterialID: any;
  isPremium: boolean;
  pageNo: number;
  itemsPerPage: number;
  constructor(
    public formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastMessageService,
    public mainTopicService: MainTopicService,
    public activatedRoute: ActivatedRoute,
    public studyMaterialService: StudyMaterialService,
    public chapterService: ChapterService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.subcategoryKey = params.subcategoryKeys;
      this.studyMaterialID = params.studyMaterialIDs;
      this.categorykey = params.categorykeys;
      this.studyMaterialsInChapterKeys = params.studyMaterialsInChapterKey;
      this.chapterKeys = params.chapterKey;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      if(params.isPremium === 'true'){
        this.isPremium = true;
      } else {
        this.isPremium = false;
      }
    })
    this.setStudyMaterialForm()
  }

  ngOnInit() {
    this.getMainTopicList()
    this.studyMaterialDetails()
    this.getAllChapters()
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
                $key: subcatkey,
              })
              this.changeCategorys()
            }
          )
        }
      })
    })
  }
  // function to initialize study material form
  setStudyMaterialForm() {
    this.AddStudyMaterialForm = this.formbuilder.group({
      categoryName: ['', Validators.required],
      subCategoryName: ['', Validators.required],
      studyMaterialName: ['', Validators.required],
      description: ['', Validators.required],
      chapterName: ['', Validators.required],
      ispremium: ['']
    })
  }
  get studymatform() {
    return this.AddStudyMaterialForm.controls
  }
  // function to get all chapters
  getAllChapters() {
    this.chapterService.getAllChaptersInSubCategory().subscribe((list) => {
      this.chapterList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.chapterList.forEach((chapter) => {
        this.chapterData.push({
          chapterName: chapter.chapterName,
          chapterkey: chapter.$key,
          subCategory: chapter.subCategoryName,
          subcatKey: chapter.subCategorykey,
          $key: chapter.$key,
        })
        this.changeSubCategorys()
      })
    })
  }
  // function to filter subcategories based on categories
  changeCategory() {
    const category = this.AddStudyMaterialForm.value.categoryName
    this.subCatName = this.MainTopicItems1.filter(
      (item) => item.categorykey === category.$key
    )
  }
  changeCategorys() {
    const category = this.categorykey
    this.subCatName = this.MainTopicItems1.filter(
      (item) => item.categorykey === category
    )
  }
  // function to filter chapter based on subCategories
  changeSubCategory() {
    const subCategoryName = this.AddStudyMaterialForm.value.subCategoryName
      .subcatKey
    this.chapterItems = this.chapterData.filter(
      (item) => item.subcatKey === subCategoryName
    )
  }
  changeSubCategorys() {
    const subCategoryKeys = this.subcategoryKey
    this.chapterItems = this.chapterData.filter(
      (item) => item.subcatKey === subCategoryKeys
    )
  }
  // function to get  study material details based on a material key
  studyMaterialDetails() {
    this.studyMaterialService.getallStudyMaterialDetails(
      this.chapterKeys,
      this.studyMaterialsInChapterKeys
    )
    .on('value', (snapshot) => {
      const data = snapshot.val();
      this.description = data.description
      this.studyMaterialName = data.studyMaterialName
      this.categoryName = {
        $key: data.categorykey,
        categoryName: data.categoryName,
      }
      this.subCategoryName = {
        $key: data.subCategoryKey,
        subCategory: data.subCategoryName,
      }
      this.chapterName = {
        $key: data.chapterkey,
        chapterName: data.chapterName,
      }
    });
  }
  // function to update study material
  updateStudyMaterial() {
    this.submitted = true;
    const params = {
      metaData: {
        categoryName: this.AddStudyMaterialForm.value.categoryName.categoryName,
        categorykey: this.AddStudyMaterialForm.value.categoryName.$key,
        subCategoryName: this.AddStudyMaterialForm.value.subCategoryName.subCategory,
        subCategoryKey: this.AddStudyMaterialForm.value.subCategoryName.$key,
        studyMaterialName: this.AddStudyMaterialForm.value.studyMaterialName,
        description: this.AddStudyMaterialForm.value.description,
        isPublished: false,
        chapterkey: this.AddStudyMaterialForm.value.chapterName.$key,
        chapterName: this.AddStudyMaterialForm.value.chapterName.chapterName,
        hasText: true,
        isPremium: this.isPremium
      },
      studyMaterialID: this.studyMaterialID,
    }
    const removeData = this.studyMaterialService.removeStudyMaterial(
      this.studyMaterialsInChapterKeys,
      this.chapterKeys
    )
    if (removeData === 'deleted') {
      this.studyMaterialService.updateStudyMaterial(
        params.metaData.chapterkey,
        params
      )
      this.toastr.show(APP_MESSAGE.STUDY_MATERIAL.study_mat_updated, false)
      this.submitted = false
      this.router.navigate(['/study-material'], {
        queryParams: {
          pageNo: this.pageNo, 
          itemsPerPage: this.itemsPerPage
        }
      });
    }
  }
  GoBack() {
    this.router.navigate(['/study-material'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      }
    });
  }
  // function to check two values
  checkCategoryName(option, value) {
    return option.categoryName === value.categoryName
  }
  checkSubCatname(option, value) {
    return option.subCategory === value.subCategory
  }
  checkChapterName(option, value) {
    return option.chapterName === value.chapterName
  }
  isPremiumEvent(event){
    if(event.target.checked === true){
      this.isPremium = true
    }else{
      this.isPremium = false
    }
  }
}
