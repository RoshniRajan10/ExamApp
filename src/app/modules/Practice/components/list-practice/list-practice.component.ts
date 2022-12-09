import { Component, OnInit } from '@angular/core'
import {
  CommonDeletePublishModal,
  PracticeService,
  ToastMessageService,
  MainTopicService,
  ChapterService,
} from '@app/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { ActivatedRoute, Router } from '@angular/router'
declare var $: any
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'
import { FormBuilder, FormGroup } from '@angular/forms'
import * as firebase from 'firebase'
import { SECTIONS } from '@app/core/utils'

@Component({
  selector: 'app-list-practice',
  templateUrl: './list-practice.component.html',
  styleUrls: ['./list-practice.component.scss'],
})
export class ListPracticeComponent implements OnInit {
  deleteItem: CommonDeletePublishModal;
  unPublishItem: CommonDeletePublishModal;
  publishItem: CommonDeletePublishModal;
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  practiceForm: FormGroup;
  practiceList: any[];
  examsInCategory: any[];
  AllPracticeList: any[];
  PracticeItems1: any[] = [];
  categorykey: any;
  examkeys: any;
  isPublished: boolean;
  MainTopicList: any[];
  MainTopicItems1: any[];
  subCategoryList: any[];
  subCategories: any;
  chapterList: any[];
  chapterData: any[] = [];
  subcatname: any[];
  chapterItems: any[];
  pageSort = 'asc';
  isDataLoaded = false;
  examLevelList: any[];
  categoryForm: any;
  data1: any;
  QstnList: any[] = [];
  Qstnlength: number;
  examkey: any;
  subCategoryKey: any;
  practicekey: any;
  practicekeys: any;
  subCategoryKeys: any;
  chapterkeys: any;
  searchFilter = {
    keyword: '',
    mainTopic: { $key: '', categoryName: 'Select main topic' },
    subTopic: { $key: '', subCategory: 'Select sub topic', subcatKey: '' },
    chapter: { $key: '', chapterName: 'Select chapter', chapterkey: '' },
  };
  //for pagination
  searchExam;
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
    public practiceService: PracticeService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public formbuilder: FormBuilder,
    public toastr: ToastMessageService,
    private spinner: NgxSpinnerService,
    private mainTopicService: MainTopicService,
    private chapterService: ChapterService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo ? params.pageNo : 1;
      this.itemsPerPage = params.itemsPerPage ? parseInt(params.itemsPerPage) : 10;
    })
    this.setCategoryForm()
    this.setPracticeForm()
  }

  ngOnInit() {
    this.getPracticeList()
    this.getAllExamLevel()
    this.getMainTopicList()
    this.getAllChapters()
  }
  setPracticeForm() {
    this.practiceForm = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
      chapterName: [''],
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
      this.PracticeItems1 = []
      this.practiceList.forEach((elements) => {
        Object.entries(elements.data).forEach(([practicekey, value]) => {
          if((value['metaData'].practiceName) && (value['metaData'].practiceName !== "")){
            this.PracticeItems1.push({
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
              same_weightage: value['metaData'].same_weightage,
              marks: value['metaData'].marks,
              negativeMarks: value['metaData'].negativeMarks,
              isPremium: value['metaData'].isPremium,
              notificationMetaData: value['metaData'],
            })
          }
        })
      })
      this.AllPracticeList = this.PracticeItems1
      this.sortResult(this.AllPracticeList, this.pageSort)
      if (this.searchFilter.chapter.$key !== '') {
        this.changeChapter()
      } else if (this.searchFilter.subTopic.$key !== '') {
        this.changeSubCategory()
      } else if (this.searchFilter.mainTopic.$key !== '') {
        this.changeCategory()
      }
    })
  }
  addPractice() {
    this.router.navigate(['/add-practice/add'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      }
    });
  }
  resetFilter() {
    this.searchExam = ''
    this.AllPracticeList = _.orderBy(
      this.PracticeItems1,
      [(data) => data?.practiceNames?.toLowerCase()],
      'asc'
    )
    this.getMainTopicList()
    this.getAllChapters()
  }
  loadSpinner(isShow: boolean) {
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  onPageSortAsc() {
    // function to sort the data in ascending order
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.AllPracticeList, this.pageSort)
  }
  onPageSortDesc() {
    // function to sort the data in decending order
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.AllPracticeList, this.pageSort)
  }
  sortResult(source, sort) {
    // sort the list based on specific value
    this.AllPracticeList = _.orderBy(
      source,
      [(data) => data?.practiceNames?.toLowerCase()],
      sort
    )
  }
  setCategoryForm() {
    // initialize category form
    this.categoryForm = this.formbuilder.group({
      levelName: [''],
    })
  }
  getAllExamLevel() {
    // function to get all exam levels
    this.practiceService.getAllExamLevel().subscribe((list) => {
      this.examLevelList = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      })
    })
  }
  changeLevel() {
    // sort practice list by changing the exam level
    const { levelName } = this.categoryForm.value
    this.AllPracticeList = this.PracticeItems1.filter(
      (item) => item.levelkey === levelName.$key
    )
  }
  // function to show delete modal popup
  onDeleteExam(practicekeys, chapterkey, isPublished) {
    const objPractice: CommonDeletePublishModal = {
      section: SECTIONS.practiceInSubCategories,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { practicekeys, chapterkey },
    }
    this.deleteItem = objPractice
    if (isPublished === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.PRACTICE.practice_cant_delete)
    }
  }

  // function to show modal for unpublish practice
  onUpdateUnPublish(practicesInChapterKeys, chapterkey, isPublished) {
    const objPractice: CommonDeletePublishModal = {
      section: SECTIONS.practiceInSubCategories,
      displayMessage: APP_MESSAGE.UNPUBLISH.unpublish,
      sectionItems: { practicesInChapterKeys, chapterkey, isPublished },
    }
    this.unPublishItem = objPractice
    $('#modal-update-unpublish').modal('show')
    // }
  }
  async getAllQuestionsBykey(examsId) {
    // function to get all questions under a specific practice
    firebase
      .database()
      .ref('exams')
      .child(examsId)
      .on('value', (snapshot) => {
        this.data1 = snapshot.val()
      })
    return this.data1
  }
  // function to show modal for publish practice
  onUpdatepublish(
    practicesInChapterKeys,
    chapterkey,
    isPublished,
    practiceId,
    details
  ) {
    this.practiceService.getAllQuestionsBykey(practiceId)
    .then((snapshot)=>{
      const { data: questions } = snapshot.val()
      console.log("questions",questions)
      if(questions){
        const type = 'PRACTICE'
        const objPractice: CommonDeletePublishModal = {
          section: SECTIONS.practiceInSubCategories,
          displayMessage: APP_MESSAGE.PUBLISH.publish,
          sectionItems: {
            key: practiceId,
            practicesInChapterKeys,
            chapterkey,
            practiceId,
            isPublished,
            details,
            type,
          },
        }
        this.publishItem = objPractice;
        $('#modal-update-publish').modal('show')
      } else {
        this.toastr.show('Create at least one question for publishing this practice', true)
      }
    })
  }
  cancelPublish() {
    $('#modal-update-publish').modal('hide')
  }
  // redirect to practice question list page based on exam
  viewQuestion(practiceId, practicesInChapterKeys, chapterkeys, weightage) {
    this.router.navigate(['/list-questions/view'], {
      queryParams: {
        practicekeys: practiceId,
        practiceInChapterKeys: practicesInChapterKeys,
        chapterkey: chapterkeys,
        weightage: weightage,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      },
    })
  }
  // redirect to go to edit exam page
  onUpdateExam(
    practiceId,
    practicesInChapterKeys,
    chapterkeys,
    categoryKeys,
    subCategoryKeys,
    isPremium
  ) {
    this.router.navigate(['/edit-practice/edit'], {
      queryParams: {
        practicekey: practiceId,
        practicesInChapterKey: practicesInChapterKeys,
        chapterkey: chapterkeys,
        categoryKey: categoryKeys,
        subCategoryKey: subCategoryKeys,
        isPremium: isPremium,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      },
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
    this.chapterData = []
    this.chapterList = []
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
    this.chapterItems = []
    this.chapterItems.unshift({ $key: '', chapterName: 'Select chapter' })
    this.searchFilter.chapter = this.chapterItems[0]
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
    if (categories.$key !== '') {
      this.AllPracticeList = this.PracticeItems1.filter(
        (item) => item.categoryKeys === categories.$key
      )
      this.pageNo = 1
    }
  }
  // function to filter chapters based on subcategories
  changeSubCategory() {
    const subCategories = this.searchFilter.subTopic
    this.chapterItems = this.chapterData.filter(
      (item) => item.subCategorykey === subCategories.subcatKey
    )
    this.chapterItems.unshift({ $key: '', chapterName: 'Select chapter' })
    this.searchFilter.chapter = this.chapterItems[0]
    if (subCategories.$key !== '') {
      this.AllPracticeList = this.PracticeItems1.filter(
        (item) => item.subCategoryKeys === subCategories.subcatKey
      )
    }
  }
  // function to filter study material based on chapter
  changeChapter() {
    const chapters = this.searchFilter.chapter.chapterkey
    if (this.searchFilter.chapter.chapterkey !== '') {
      this.AllPracticeList = this.PracticeItems1.filter(
        (item) => item.chapterkey === chapters
      )
    }
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
