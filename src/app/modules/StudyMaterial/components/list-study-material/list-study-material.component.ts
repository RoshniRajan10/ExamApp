import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Options } from 'ng5-slider'
import { APP_MESSAGE } from '@app/core/config'
import {
  StudyMaterialService,
  ToastMessageService,
  MainTopicService,
  CommonDeletePublishModal,
  ChapterService,
} from '@app/core'
declare var $: any
import * as _ from 'lodash'
import { SECTIONS } from '@app/core/utils'
@Component({
  selector: 'app-list-study-material',
  templateUrl: './list-study-material.component.html',
  styleUrls: ['./list-study-material.component.scss'],
})
export class ListStudyMaterialComponent implements OnInit {
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  public studyMaterialList: any[];
  StudyMaterialItems: any[] = [];
  pageSort = 'asc';
  subcategoryKey: any;
  studymatkey: any;
  categorykey: any;
  searchFilter = {
    keyword: '',
    mainTopic: { $key: '', categoryName: 'Select main topic' },
    subTopic: { $key: '', subCategory: 'Select sub topic', subcatKey: '' },
    chapter: { $key: '', chapterName: 'Select chapter', chapterkey: '' },
  };
  MainTopicList: any[];
  subcatname: any[];
  subCategoryList = [];
  subCategories: any;
  isDataLoaded = false;
  MainTopicItems1: any[] = [];
  allstudyMaterialItems: any[] = [];
  subcatKey: any;
  result: any[];
  studyMaterialForm: FormGroup;
  studyMaterialsInChapterKeys: any;
  chapterKeys: any;
  chapterName: any[];
  deleteItem: any;
  publishItem: any;
  unPublishItem: any;
  chapterList: any;
  chapterData: any[] = [];
  catname: any[];
  chapterItems: any[];
  //for pagination
  searchStudyMaterial;
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
    public studyMaterialService: StudyMaterialService,
    public mainTopicService: MainTopicService,
    private router: Router,
    public toastr: ToastMessageService,
    private activatedRoute: ActivatedRoute,
    public formbuilder: FormBuilder,
    public chapterService: ChapterService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo ? params.pageNo : 1;
      this.itemsPerPage = params.itemsPerPage ? parseInt(params.itemsPerPage) : 10;      
    });
    this.setstudyMaterialForm()
  }

  ngOnInit(): void {
    this.getStudyMaterialList()
    this.getMainTopicList()
    this.getAllChapters()
  }
  setstudyMaterialForm() {
    this.studyMaterialForm = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
      chapterName: [''],
    })
  }
  // function to get all study materials
  getStudyMaterialList() {
    this.studyMaterialService.getAllStudyMaterialList().subscribe((list) => {
      this.isDataLoaded = true
      const studyMaterialList = list.map((item) => {
        return {
          $key: item.key,
          data: item.payload.val(),
        }
      })
      this.StudyMaterialItems = []
      studyMaterialList.forEach((chapter) => {
        Object.entries(chapter.data).forEach(([studymatkey, studymatvalue]) => {
          let studyMaterialName = studymatvalue['metaData'].studyMaterialName;
          if(studyMaterialName && studyMaterialName !== ""){
            let studyMaterialsInChapterKey = studymatvalue['studyMaterialsInChapterKey'] ? studymatvalue['studyMaterialsInChapterKey'] : studymatvalue['studyMaterialsInSubCategoriesKey']
            this.StudyMaterialItems.push({
              /* tslint:disable */
              chapterKey: chapter.$key,
              chapterName: studymatvalue['metaData'].chapterName,
              categoryName: studymatvalue['metaData'].categoryName,
              categorykey: studymatvalue['metaData'].categorykey,
              description: studymatvalue['metaData'].description,
              isPublished: studymatvalue['metaData'].isPublished,
              studyMaterialName: studymatvalue['metaData'].studyMaterialName,
              subCategoryKey: studymatvalue['metaData'].subCategoryKey,
              subCategoryName: studymatvalue['metaData'].subCategoryName,
              studyMaterialsInChapterKey: studyMaterialsInChapterKey,
              studyMaterialID: studymatvalue['studyMaterialID'],
              isPremium: studymatvalue['metaData'].isPremium,
            });
          }
          if (this.searchFilter.chapter.$key == '') {
            this.allstudyMaterialItems = this.StudyMaterialItems
          } else {
            this.changeChapter()
          }
        })
      })
      // console.log("this.allstudyMaterialItems",this.allstudyMaterialItems)
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
      this.MainTopicList.unshift({
        $key: '',
        categoryName: 'Select main topic',
      })
      this.searchFilter.mainTopic = this.MainTopicList[0]

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
      this.changeCategory()
    })
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
    // const category = this.studyMaterialForm.value.categoryName
    const categories = this.searchFilter.mainTopic
    this.subcatname = this.MainTopicItems1.filter(
      (item) => item.categorykey === categories.$key
    )
    this.subcatname.unshift({ $key: '', subCategory: 'Select sub topic' })
    this.searchFilter.subTopic = this.subcatname[0]
    this.changeSubCategory()
  }
  // function to filter chapters based on subcategories
  changeSubCategory() {
    const subCategories = this.searchFilter.subTopic
    this.chapterItems = this.chapterData.filter(
      (item) => item.subCategorykey === subCategories.subcatKey
    )
    this.chapterItems.unshift({ $key: '', chapterName: 'Select chapter' })
    this.searchFilter.chapter = this.chapterItems[0]
  }
  // function to filter study material based on chapter
  changeChapter() {
    const chapters = this.searchFilter.chapter.chapterkey
    // this.StudyMaterialItems.forEach((si) =>{

    // })
    this.allstudyMaterialItems = this.StudyMaterialItems.filter(
      (item) => item.chapterKey === chapters
    )
  }
  // function to show modal for unpublish
  onUpdateUnPublish(chapterKey, studyMaterialsInChapterKey) {
    const objStudyMaterial: CommonDeletePublishModal = {
      section: SECTIONS.studyMaterialInChapter,
      displayMessage: APP_MESSAGE.UNPUBLISH.unpublish,
      sectionItems: { chapterKey, studyMaterialsInChapterKey },
    }
    this.unPublishItem = objStudyMaterial
    $('#modal-update-unpublish').modal('show')
  }
  // function to show modal for publish
  onUpdatepublish(chapterKey, studyMaterialsInChapterKey, details) {
    const type = 'STUDY_MATERIALS'
    const objStudyMaterial: CommonDeletePublishModal = {
      section: SECTIONS.studyMaterialInChapter,
      displayMessage: APP_MESSAGE.PUBLISH.publish,
      sectionItems: {
        key: details.studyMaterialID,
        chapterKey,
        studyMaterialsInChapterKey,
        details,
        type,
      },
    }
    this.publishItem = objStudyMaterial
    $('#modal-update-publish').modal('show')
  }
  cancelPublish() {
    $('#modal-update-publish').modal('hide')
  }
  resetFilter() {
    this.searchStudyMaterial = ''
    this.StudyMaterialItems = [] = []
    this.getStudyMaterialList()
    this.searchFilter.mainTopic = this.MainTopicList[0]
    this.changeCategory()
    //this.studyMaterialForm.reset()
  }
  // sorting in ascending and descending order
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
      [(data) => data?.studyMaterialName?.toLowerCase()],
      sort
    )
  }
  // function to show modal for delete data
  onDeleteStudyMaterial(chapterKey, studyMaterialsInChapterKey, isPublished) {
    const objStudyMaterial: CommonDeletePublishModal = {
      section: SECTIONS.studyMaterialInChapter,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { chapterKey, studyMaterialsInChapterKey },
    }
    this.deleteItem = objStudyMaterial
    if (isPublished === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.STUDY_MATERIAL.study_mat_cant_delete)
    }
  }
  // redirect to edit page
  editStudyMaterial(
    chapterKeys,
    studyMaterialsInChapterKeys,
    categorykey,
    subcategoryKey,
    studyMaterialID,
    isPremium
  ) {
    this.router.navigate(['/edit-study-material/edit'], {
      queryParams: {
        subcategoryKeys: subcategoryKey,
        studyMaterialsInChapterKey: studyMaterialsInChapterKeys,
        categorykeys: categorykey,
        chapterKey: chapterKeys,
        studyMaterialIDs: studyMaterialID,
        isPremium: isPremium,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      },
    })
  }
  // redirect to view page
  viewStudyMaterial(
    chapterKeys,
    studyMaterialsInChapterKey,
    studyMaterialID,
    categorykey,
    subCategoryKey
  ) {
    this.router.navigate(['/view-study-material/view-study-mat'], {
      queryParams: {
        subcategoryKeys: subCategoryKey,
        studyMaterialIDs: studyMaterialID,
        chapterKey: chapterKeys,
        studyMaterialsInChapterKeys: studyMaterialsInChapterKey,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      },
    })
  }
  // categorykeys: categorykey,
  addStudyMaterial() {
    this.router.navigate(['/add-study-material/manage'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      },
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
