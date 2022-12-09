import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router'
import {
  SubTopicService,
  MainTopicService,
  ChapterService,
  ToastMessageService,
  CommonDeletePublishModal,
  YouTubeVideoService,
  StudyMaterialService,
  PracticeService,
  PushNotificationService
} from '@app/core'
declare var $: any
import * as _ from 'lodash'
import { APP_MESSAGE } from '@app/core/config'
import { SECTIONS } from '@app/core/utils'

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss'],
})
export class ChaptersComponent implements OnInit {
  ChapterFormAdd: FormGroup;
  MainTopicItems: any[];
  subCategoryList: any[];
  subCategories: any[];
  MainTopicItems1: any[] = [];
  currentPage = 1;
  SubTopicFormAdd: FormGroup;
  SubTopicFormUpdate: FormGroup;
  selectedFiles: FileList;
  subcatKey: any;
  SubTopic: any[] = [];
  subTopic: any[] = [];
  categorykey: any;
  CategoryItems: any[] = [];
  private basePath = '/subCategoryImages';
  searchsubTopicTopic: any;
  ext: any;
  a: any;
  isPublished: any;
  subCategoryName: any;
  subCategoryThumb: any;
  isDataLoaded = false;
  pageSort = 'asc';
  submitted = false;
  categoryName: any;
  categoryName1: any;
  imageUpload: boolean;
  result: any[];
  subCatName: any[];
  MainTopicList: any[];
  chapterInSubCatKey: string;
  chapterList: any[];
  allChapters: any[];
  videoList: any;
  allvideoItems: any[];
  allPracticeItems: any[];
  practiceList: any;
  allStudyMaterial: any[] = [];
  studyMaterialList: any;
  isPremium = false;
  practiceForm: FormGroup
  subcatname: any[]
  chapters: any[]
  chapterData: any[] = [];
  chapterSearchForm: FormGroup
  subCatNameAdd: any[]
  //for pagination
  searchChapter: string;
  pageNo: number = 1;
  pageNoBind: number;
  onSearchChange(searchKey: string): void {
    this.pageNo = 1
  }
  pageMaxSize: number = 10;
  itemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  chapterItems: any[];
  selectedId: any;
  ChapterFormUpdate: FormGroup;
  chapterName: any;
  id: any;
  chapterInSubCatKeys: any;
  categorykeys: any;
  subCategorykeys: any;
  deleteItem: any;
  publishItem: any;
  unPublishItem: any;
  MainTopics: any;
  searchFilter = {
    keyword: '',
    mainTopic: { $key: '', categoryName: 'Select Main Topic' },
    subTopic: { $key: '', subCategory: 'Select Sub Topic',subcatKey: ''},
    chapter: { $key: '', chapterName: 'Select Chapter', chapterkey: '' },
  }
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  constructor(
    public formbuilder: FormBuilder,
    private toastr: ToastMessageService,
    public subTopicService: SubTopicService,
    public mainTopicService: MainTopicService,
    private spinner: NgxSpinnerService,
    public chapterService: ChapterService,
    public youTubeVideoService: YouTubeVideoService,
    public practiceService: PracticeService,
    public studyMaterialService: StudyMaterialService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public pushNotificationService: PushNotificationService
    // private dialog: MatDialog,
  ) {
    this.setchapterSearchForm();
  }

  ngOnInit() {
    this.setChapterForm()
    this.getMainTopicList();
    this.getAllChapters();
    this.getYouTubeList();
    this.getStudyMaterialList();
    this.getPracticeList();
  }
  // function to initialize form
  setChapterForm() {
    this.ChapterFormAdd = this.formbuilder.group({
      categoryName: ['', Validators.required],
      subCategoryName: ['', Validators.required],
      chapterName: ['', Validators.required],
      ispremium: ['']
    })
    this.ChapterFormUpdate = this.formbuilder.group({
      // categoryName: [''],
      // subCategoryName: [''],
      chapterName: ['', Validators.required],
      ispremium: ['']
    })
  }
  get chapterformAdd() {
    return this.ChapterFormAdd.controls
  }
  get chapterformUpdate() {
    return this.ChapterFormUpdate.controls
  }
  loadSpinner(isShow: boolean) {
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  // function to get all chapters
  getAllChapters() {
    this.loadSpinner(true)
    this.chapterService.getAllChaptersInSubCategory().subscribe((list) => {
      this.isDataLoaded = true
      this.loadSpinner(false)
      const result = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.chapters = result.map((chapter) => {
        return {
          chapterName: chapter.chapterName,
          chapterkey: chapter.$key,
          subCategoryName: chapter.subCategoryName,
          subCategorykey: chapter.subCategorykey,
          $key: chapter.$key,
          categoryName: chapter.categoryName,
          categorykey: chapter.categorykey,
          chapterInSubCatKey: chapter.chapterInSubCatKey,
          isPublished: chapter.isPublished,
          isPremium: chapter.isPremium
        }
      });
      
      this.chapters = this.chapters.filter((item)=> item.chapterName)
      // this.chapters = result;
      this.chapterList = this.chapters
      if(this.searchFilter.subTopic.$key !== ''){
        this.changeSubCategory();
      }else if(this.searchFilter.mainTopic.$key !== ''){
        this.changeCategory();
      }
      this.sortResult(this.chapterList, this.pageSort);
    })
  }
  resetFilter() {
    this.searchChapter = ''
    this.getAllChapters();
    this.searchFilter.mainTopic = this.MainTopicList[0];
    this.changeCategory();
  }

  // sort
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.chapterList, this.pageSort)
  }
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.chapterList, this.pageSort)
  }
  sortResult(source, sort) {
    this.chapterList = _.orderBy(
      source,
      [(data) => data?.chapterName?.toLowerCase()],
      sort
    )
  }
  // function to get subcategories based on categories in chapter add
  changeCategoryAdd() {
    const category = this.ChapterFormAdd.value.categoryName
    this.subCatNameAdd = this.MainTopicItems1.filter(
      (item) => item.category === category.categoryName
    )
  }
  // function to get category List
  getMainTopicList() {
    this.mainTopicService.getMainTopics().subscribe((list) => {
      const MainTopicList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      });
      this.MainTopics = _.orderBy(
        MainTopicList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
      this.MainTopicList = _.orderBy(
        MainTopicList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
      this.MainTopicList.unshift({
        $key: '',
        categoryName: 'Select Main Topic',
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
  onDialogClose(modalId) {
    // function to close modal box    
    this.submitted = false;
    this.isPremium = false;
    this.getMainTopicList();
    this.subCatNameAdd = [];
    $('#' + modalId).modal('hide')
  }

  // function to display modal for publish chapter
  onUpdatePublish($key, isPublished, details) {
    const type = 'CHAPTERS'
    const id = $key
    const objChapter: CommonDeletePublishModal = {
      section: SECTIONS.chapter,
      displayMessage: APP_MESSAGE.PUBLISH.publish,
      sectionItems: { id, key:$key, isPublished, details, type },
    }
    this.publishItem = objChapter
    $('#modal-update-publish').modal('show')
  }

  // function to display modal for unpublish chapter
  onUpdateUnPublish($key, isPublished) {
    const id = $key
    const objChapter: CommonDeletePublishModal = {
      section: SECTIONS.chapter,
      displayMessage: APP_MESSAGE.UNPUBLISH.unpublish,
      sectionItems: { id, isPublished },
    }
    this.unPublishItem = objChapter
    $('#modal-update-unpublish').modal('show')
  }
  // function to show delete chapter modal
  onDeleteChapter(
    $key,
    isPublished,
    chapterInSubCatKey,
    categorykey,
    subCategorykey
  ) {
    const objSubTopic: CommonDeletePublishModal = {
      section: SECTIONS.chapter,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { $key, chapterInSubCatKey, categorykey, subCategorykey },
    }
    this.deleteItem = objSubTopic
    if (isPublished === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.CHAPTER.chap_cant_delete)
    }
  }

  // function to add chapter
  addChapter() {
    this.submitted = true
    if (this.isTopicNameExists(false, '')) {
      if (!this.ChapterFormAdd.invalid) {
        const createdAt = -Date.now()
        const isPremium = this.isPremium;
        const params = {
          chapterName: this.ChapterFormAdd.value.chapterName,
          createdAt,
        }
        const objResultChapter = this.chapterService.addChapterInSubCategory(
          params,
          this.ChapterFormAdd.value.categoryName.$key,
          this.ChapterFormAdd.value.subCategoryName.subcatKey
        )
        if (objResultChapter) {
          const data = {
            chapterName: this.ChapterFormAdd.value.chapterName,
            categoryName: this.ChapterFormAdd.value.categoryName.categoryName,
            categorykey: this.ChapterFormAdd.value.categoryName.$key,
            subCategoryName: this.ChapterFormAdd.value.subCategoryName
              .subCategory,
            subCategorykey: this.ChapterFormAdd.value.subCategoryName.subcatKey,
            chapterInSubCatKey: objResultChapter.key,
            isPublished: false,
            isPremium
          }
          this.chapterInSubCatKey = objResultChapter.key
          const objResult = this.chapterService.addChapter(data)
          if (objResult) {
            const $key = objResult
            const datas = this.chapterDetails($key)
            this.chapterInSubCatKeys = datas.chapterInSubCatKey
            this.categorykeys = datas.categorykey
            this.subCategorykeys = datas.subCategorykey
            const chapterResults = this.chapterService.updateChapterkeyInSubCategory(
              this.chapterInSubCatKeys,
              this.categorykeys,
              this.subCategorykeys,
              $key
            )
            if (chapterResults) {
              this.ChapterFormAdd.reset();
              this.getMainTopicList();
              this.subCatNameAdd = [];
              this.submitted = false;
              this.isPremium = false;
              $('#showChapterDialog').modal('hide')
              this.toastr.show(APP_MESSAGE.CHAPTER.chapter_add, false)
            }
          }
        }
      }
    }
  }

  // function to show update modal popup
  onUpdateChapter($key, chapterInSubCatKey, categorykey, subCategorykey) {
    this.id = $key
    this.chapterInSubCatKeys = chapterInSubCatKey
    this.categorykeys = categorykey
    this.subCategorykeys = subCategorykey
    const data = this.chapterDetails($key)
    this.categoryName = data.categoryName;
    this.chapterName = data.chapterName;
    this.subCategoryName = data.subCategoryName;
    this.isPremium =  data.isPremium;
    $('#showupdateChapterDialog').modal('show')
  }
  chapterDetails($key) {
    return this.chapterService.getChapterDetails($key)
  }
  // function to update parent topic
  UpdateChapter(id, chapterInSubCatKeys, categorykeys, subCategorykeys) {
    this.submitted = true;
    if (this.isTopicNameExists(true, id)) {
      let { chapterName, ispremium } = this.ChapterFormUpdate.value;
      this.isPremium = ispremium ? ispremium : false;
      if(this.ChapterFormUpdate.valid) {
        this.chapterService
        .updateChapters(
          id,
          this.subCategoryName,
          this.categoryName,
          chapterName,
          this.isPremium
        )
        .then(() => {
          this.chapterService.getVideos(categorykeys,subCategorykeys,id,chapterName,this.allvideoItems);
          this.chapterService.getStudyMaterials(categorykeys,subCategorykeys,id,chapterName,this.allStudyMaterial);
          this.chapterService.getPractices(categorykeys,subCategorykeys,id,chapterName,this.allPracticeItems);
          this.toastr.show(APP_MESSAGE.CHAPTER.chapter_updated, false)
          $('#showupdateChapterDialog').modal('hide')
          this.submitted = false
          this.ChapterFormUpdate.reset()
        })
        this.chapterService.updateChaptersInSubCategory(
          chapterInSubCatKeys,
          categorykeys,
          subCategorykeys,
          chapterName
        )
      }
    }
  }

  isTopicNameExists(isUpdate, $key) {
    const frm = isUpdate ? this.ChapterFormUpdate : this.ChapterFormAdd
    const { chapterName, categoryName, subCategoryName } = frm.value
    const categoryKeyId = isUpdate ? this.categorykeys : categoryName.$key
    const subCategoryId = isUpdate
      ? this.subCategorykeys
      : subCategoryName.subcatKey

    const mainTopics = this.chapterList.filter(
      (item) =>
        item.chapterName &&
        item.chapterName.toLowerCase().replace(/\s/g, '') ===
          chapterName.toLowerCase().replace(/\s/g, '') &&
        item.categorykey === categoryKeyId &&
        item.subCategorykey === subCategoryId
    )

    if (mainTopics.length === 0) {
      return true
    }
    let retVal = true
    if (!isUpdate) {
      retVal = false
    } else {
      if (mainTopics.filter((itm) => itm.$key !== $key).length > 0) {
        retVal = false
      }
    }
    if (!retVal) {
      this.toastr.show(APP_MESSAGE.CHAPTER.chapter_exists)
    }
    return retVal
  }
  // function to get all video details
  getYouTubeList() {
    this.youTubeVideoService.getAllYoutubeVideos().subscribe((list) => {
      // this.isDataLoaded = true
      this.videoList = list.map((item) => {
        const itemList = {
          $key: item.key,
          data: item.payload.val(),
        }
        return itemList
      })
      this.allvideoItems = []
      this.videoList.forEach((chapter) => {
        Object.entries(chapter.data).forEach(([videokeys, value]) => {
          this.allvideoItems.push({
            /* tslint:disable */
            videokey: chapter.$key,
            chapterKey: value['chapterKey'],
            author_url: value['author_url'],
            categoryKey: value['categorykey'],
            embedUrl: value['embedUrl'],
            chapterName: value['chapterName'],
            subCategoryKey: value['subCategoryKey'],
            thumbnail_url: value['thumbnail_url'],
            title: value['title'],
            url: value['url'],
            video_id: value['video_id'],
            isPublished: value['isPublished'],
            order: value['order'],
            videosInchapterKey: value['videosInchapterKey'],
          });
        });
      });
    });
  }
  ///to get study materials
  getStudyMaterialList() {
    this.studyMaterialService.getAllStudyMaterialList().subscribe((list) => {
      this.isDataLoaded = true
      this.studyMaterialList = list.map((item) => {
        const itemList = {
          $key: item.key,
          data: item.payload.val(),
        }
        return itemList
      })
      this.studyMaterialList.forEach((chapter) => {
        Object.entries(chapter.data).forEach(([studymatkey, studymatvalue]) => {
          this.allStudyMaterial.push({
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
            studyMaterialsInChapterKey: studymatvalue['studyMaterialsInChapterKey'],
            studyMaterialID: studymatvalue['studyMaterialID'],
          });
        });
      });
    })
  }
  // function to get all practice list
  getPracticeList() {
    this.loadSpinner(true)
    this.practiceService.getExamList().subscribe((list) => {
      this.isDataLoaded = true
      this.loadSpinner(false)
      this.practiceList = list.map((item) => {
        const itemList = {
          $key: item.key,
          data: item.payload.val(),
        }
        return itemList
      })
      this.allPracticeItems = []
      this.practiceList.forEach((elements) => {
        Object.entries(elements.data).forEach(([practicekey, value]) => {
          this.allPracticeItems.push({
            /* tslint:disable */
            practicekeys: practicekey,
            practiceId: value['practiceId'],
            practicesInChapterKeys: value['practicesInChapterKey'],
            categoryNames: value['metaData'].categoryName,
            practiceNames: value['metaData'].practiceName,
            subCategoryNames: value['metaData'].subCategoryName,
            categoryKeys: value['metaData'].categorykey,
            isPublished: value['metaData'].isPublished,
            subCategoryKeys: value['metaData'].subCategoryKey,
            chapterName: value['metaData'].chapterName,
            chapterkey: value['metaData'].chapterkey,
            totalNoOfQuestion: value['metaData'].totalNoOfQuestions,
          });
        });
      });
    });
  }
  isPremiumEvent(event){
    if(event.target.checked === true){
      this.isPremium = true
    }else{
      this.isPremium = false
    }
  }
  setchapterSearchForm() {
    this.chapterSearchForm = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
      chapterName: [''],
    })
  }
  // function to filter subcategories based on categories
  changeCategory() {
    // const category = this.studyMaterialForm.value.categoryName
    const categories = this.searchFilter.mainTopic
    this.subcatname = this.MainTopicItems1.filter(
      (item) => item.categorykey === categories.$key
    )
    this.subcatname.unshift({ $key: '', subCategory: 'Select Sub Topic' })
    this.searchFilter.subTopic = this.subcatname[0];
    if(categories.$key !== ''){
      this.chapterList = this.chapters.filter(
        (item) => item.categorykey === categories.$key
      );
    this.pageNo = 1;
    }
    this.changeSubCategory()
  }
  // function to filter chapters based on subcategories
  changeSubCategory() {
    const subCategories = this.searchFilter.subTopic;
    this.chapterItems = this.chapterData.filter(
      (item) => item.subCategorykey === subCategories.subcatKey
    )
    this.chapterItems.unshift({ $key: '', chapterName: 'Select Chapter' })
    if(subCategories.$key !== ''){
      this.chapterList = this.chapters.filter(
        (item) => item.subCategorykey === subCategories.subcatKey
      );
    }
    this.searchFilter.chapter = this.chapterItems[0]
  }
  // function to filter study material based on chapter
  changeChapter() {
    const chapters = this.searchFilter.chapter.chapterkey;
    if(this.searchFilter.chapter.chapterkey !== ''){
      this.chapterList = this.chapters.filter(
        (item) => item.$key === chapters
      );
    }
  }
  // addContentsToChapter() {
  //   const dialogRef = this.dialog.open(AddContentsComponent,{
  //     height: '79vh',
  //     width: '76vh',
  //     data: {
  //       module: "events"
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((filters: any)=>{ });
  // }
  onAddContents(chapterKey,chapterInSubCatKey){
    this.router.navigate(['chapters/add-contents'], {
      queryParams: {
        chapterKey: chapterKey,
        chapterInSubCatKey: chapterInSubCatKey
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
