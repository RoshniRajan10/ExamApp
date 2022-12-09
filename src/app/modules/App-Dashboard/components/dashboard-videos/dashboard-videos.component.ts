import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { NgxSpinnerService } from 'ngx-spinner'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  ToastMessageService,
  YouTubeVideoService,
  MainTopicService,
  ChapterService,
  AppDashboardService
 } from '@app/core';

import * as _ from 'lodash'
import { APP_MESSAGE } from '@app/core/config'
declare var $: any
import { values } from 'lodash';

@Component({
  selector: 'app-dashboard-videos',
  templateUrl: './dashboard-videos.component.html',
  styleUrls: ['./dashboard-videos.component.scss']
})
export class DashboardVideosComponent implements OnInit {
  @Output() addVideoEmitter = new EventEmitter<{addVideo: boolean, addVideoButton: boolean}>();
  @Input() addVideoValue: any;
  addVideo = false;
  public data: Array<Select2OptionData>;
  public options: Options;
  public ngSelectValue: string[];
  isDataLoaded: boolean;
  submitted: boolean;
  videos: any[];
  videoList: any[] = [];
  videoItems: any[] = [];
  //for pagination
  pageNo: number = 1;
  pageNoBind: number;
  pageMaxSize: number = 10;
  itemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  allVideoItems1: any[];
  orderStatus = true;
  allVideoItems: any[] = [];
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  selectedVids: any[] = [];
  selectedVideoUrl: string;
  selections: any;
  videoForm: FormGroup;
  MainTopicList: any[];
  searchFilter = {
    mainTopic: { $key: '', categoryName: 'Select main topic' },
    subTopic: { $key: '', subCategory: 'Select sub topic',subcatKey: ''},
    chapter: { $key: '', chapterName: 'Select chapter', chapterkey: '' },
  };
  MainTopicItems1: any[];
  subCategoryList: any[];
  subCategories: any;
  chapterList: any[];
  chapterData: any[] =[];
  subcatname: any[];
  chapterItems: any[];
  pageSort: string;

  /// for existing videos///
  videosHighlighted: any[] = [];
  appDashBoardContents: any[];
  // selectedVideoUrl: string;
  videoCount: number;
  addVideoButton: boolean = false;
  videoSearchForm: FormGroup;
  selectedVideoArray: any[] = [];
  hideCheckBox: boolean;
  constructor(
    public formbuilder: FormBuilder,
    private router: Router,
    private toastr: ToastMessageService,
    private spinner: NgxSpinnerService,
    public youTubeVideoService: YouTubeVideoService,
    public mainTopicService: MainTopicService,
    public chapterService: ChapterService,
    private appDashboardService: AppDashboardService,
    ) {
      this.setvideoSearchForm();
    }

  ngOnInit(): void {
    this.getYouTubeList();
    this.getMainTopicList();
    this.getAllChapters();
    this.getHighlightedVideos();
  }

  setvideoSearchForm() {
    this.videoSearchForm = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
      chapterName: [''],
    })
  }
  getYouTubeList() {
    this.spinner.show();
    this.youTubeVideoService.getAllYoutubeVideos().subscribe((list) => {
      this.isDataLoaded = true
      this.spinner.hide();
        this.videoList = list.map((item) => {
        const itemList = {
          $key: item.key,
          data: item.payload.val(),
        }
        return itemList
      })
      this.videoItems = []
      this.videoList.forEach((chapter) => {
        Object.entries(chapter.data).forEach(([videokeys, value]) => {
          this.videoItems.push({
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
            order: value['order']
          })
          this.allVideoItems = this.videoItems;
        })
      });
    })
  }
   // function to get all main topics
  getMainTopicList() {
    this.mainTopicService.getMainTopics().subscribe((list) => {
      this.MainTopicList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })

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
    //const category = this.VideoForm.value.categoryName
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
  // function to filter video list  based on chapters
  changeChapter() {
    const chapters = this.searchFilter.chapter;
    this.allVideoItems = this.videoItems.filter(
      (item) => item.chapterKey === chapters.chapterkey
    )
    this.pageNo = 1;
  }
  resetFilter() {
    this.videoItems = []
    this.searchFilter.mainTopic = this.MainTopicList[0]
    this.changeCategory()
    this.getYouTubeList()
    //this.VideoForm.reset();
  }
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.allVideoItems, this.pageSort)
  }
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.allVideoItems, this.pageSort)
  }
  sortResult(source, sort) {
    this.allVideoItems = _.orderBy(
      source,
      [(data) => data?.title?.toLowerCase()],
      sort
    )
  }
  getHighlightedVideos(){
    this.appDashboardService.getAllVideosInDashBoard().subscribe((list) => {
      this.isDataLoaded = true;
        this.appDashBoardContents = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.videosHighlighted = this.appDashBoardContents.filter((data)=> data.status !== false)
      this.videoCount = this.videosHighlighted.length;
      if(this.videoCount < 4){
        this.addVideoButton = true;
      }
      
      this.videosHighlighted.forEach((vh)=>{
        this.allVideoItems = this.allVideoItems.filter((data)=> data.videokey !== vh.$key)   
      });
    })
  }
  // function to play video
  playVideo(embedUrl) {
    $('#modalBody').modal('show')
    this.selectedVideoUrl = embedUrl + '?rel=0'
    $('#modalBody').html(
      "<iframe width='480' height='270'   src=" +
        this.selectedVideoUrl +
        ' ></iframe>'
    )
  }
  closeModal() {
    $('#modalBody').empty()
    $('#modalBody').modal('hide')
  }
  addToDashBoard(videokey){
    if(this.addVideoValue.videoToRemove !== ""){
      const remove = this.appDashboardService.removeHighlightedVideo(this.addVideoValue.videoToRemove);
    }
    let selectedVideo = [];
    let order = this.addVideoValue.order;
    selectedVideo = this.allVideoItems.filter((data)=>data.videokey === videokey)
    let videoDetails = selectedVideo['0']
    const result = this.appDashboardService.addVideoToDashBoard(videoDetails,order);
    if(result){
      this.toastr.show(APP_MESSAGE.VIDEO.video_add, false)
      this.addVideo = false;
      this.addVideoButton = false;
      this.addVideoEmitter.emit({addVideo:this.addVideo,addVideoButton:this.addVideoButton})
    }
  }
  back(){
    this.addVideo = false;
    this.addVideoButton = false;
    this.addVideoEmitter.emit({addVideo:this.addVideo,addVideoButton:this.addVideoButton})
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
