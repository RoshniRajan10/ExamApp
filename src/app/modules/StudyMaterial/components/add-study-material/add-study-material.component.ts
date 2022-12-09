import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
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
  selector: 'app-add-study-material',
  templateUrl: './add-study-material.component.html',
  styleUrls: ['./add-study-material.component.scss'],
})
export class AddStudyMaterialComponent implements OnInit {
  MainTopicList = []
  subCategories: any
  subCategoryList = []
  MainTopicItems1 = []
  submitted = false
  AddStudyMaterialForm: FormGroup
  sudyMaterialKey: any
  studyMaterials = []
  subCatname: any[]
  chapterItems: any[]
  chapterList: any
  chapterData: any[] = []
  isPremium = false;
  pageNo: number;
  itemsPerPage: number;
  constructor(
    public formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastMessageService,
    public mainTopicService: MainTopicService,
    public studyMaterialService: StudyMaterialService,
    public chapterService: ChapterService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage
    });
    this.setStudyMaterialForm()
  }
  ngOnInit() {
    this.getMainTopicList()
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
              })
            }
          )
        }
      })
    })
  }
  // function to initialize studymaterial form
  setStudyMaterialForm() {
    this.AddStudyMaterialForm = this.formbuilder.group({
      categoryName: ['', Validators.required],
      subCategoryName: ['', Validators.required],
      studyMaterialName: ['', Validators.required],
      description: ['', Validators.required],
      chapterName: ['', Validators.required],
      ispremium:['']
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
          subCategoryName: chapter.subCategoryName,
          subCategorykey: chapter.subCategorykey,
        })
      })
    })
  }
  // function to filter subcategories based on categories
  changeCategory() {
    const category = this.AddStudyMaterialForm.value.categoryName
    this.subCatname = this.MainTopicItems1.filter(
      (item) => item.categorykey === category.$key
    )
  }
  // function to filter chapter based on subcategories
  changeSubCategory() {
    const subCategoryName = this.AddStudyMaterialForm.value.subCategoryName
      .subcatKey
    this.chapterItems = this.chapterData.filter(
      (item) => item.subCategorykey === subCategoryName
    )
  }

  gotoList() {
    this.router.navigate(['/study-material'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      }
    });
  }

  // function to add study material
  addStudyMaterial() {
    const { valid, invalid } = this.AddStudyMaterialForm
    this.submitted = true
    const createdAt = new Date().getTime()
    const objStudyMaterial: AddStudyMaterialModel = {
      $key: '',
      createdAt,
    }
    const objResult = this.studyMaterialService.manageStudyMaterial(
      objStudyMaterial
    )

    if (objResult) {
      this.sudyMaterialKey = objResult.key
      if (valid) {
        const params = {
          metaData: {
            categoryName: this.AddStudyMaterialForm.value.categoryName.categoryName,
            categorykey: this.AddStudyMaterialForm.value.categoryName.$key,
            subCategoryName: this.AddStudyMaterialForm.value.subCategoryName.subCategory,
            subCategoryKey: this.AddStudyMaterialForm.value.subCategoryName.subcatKey,
            studyMaterialName: this.AddStudyMaterialForm.value.studyMaterialName,
            description: this.AddStudyMaterialForm.value.description,
            chapterName: this.AddStudyMaterialForm.value.chapterName.chapterName,
            chapterkey: this.AddStudyMaterialForm.value.chapterName.chapterkey,
            isPublished: false,
            hasText: true,
            isPremium: this.isPremium
          },
          studyMaterialID: this.sudyMaterialKey,
        }

        const objResultStusyMat = this.studyMaterialService.addStudyMaterialInSubCategory(
          this.AddStudyMaterialForm.value.categoryName.$key,
          this.AddStudyMaterialForm.value.subCategoryName.subcatKey,
          params.metaData.chapterkey,
          params
        )
        this.toastr.show(APP_MESSAGE.STUDY_MATERIAL.study_mat_create, false)
        const studyMaterialsInChapterKey = objResultStusyMat
        this.router.navigate(['/manage-study-material/add'], {
          queryParams: {
            subCatKey: params.metaData.subCategoryKey,
            studyMaterialsInChapterKeys: studyMaterialsInChapterKey,
            studymatKey: params.studyMaterialID,
            categorykeys: params.metaData.categorykey,
            chapterKey: params.metaData.chapterkey,
          },
        })
      }
    }
  }
  isPremiumEvent(event){
    if(event.target.checked === true){
      this.isPremium = true
    }else{
      this.isPremium = false
    }
  }
}
