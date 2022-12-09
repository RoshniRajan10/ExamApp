import { Component, OnInit } from '@angular/core'
import {
  ToastMessageService,
  YouTubeVideoService,
  MainTopicService,
  ChapterService,
  CommonDeletePublishModal,
} from '@app/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormGroup } from '@angular/forms'
import * as _ from 'lodash'
import { APP_MESSAGE } from '@app/core/config'
import { SECTIONS } from '@app/core/utils'
declare var $: any
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop'
@Component({
  selector: 'app-list-videos',
  templateUrl: './list-videos.component.html',
  styleUrls: ['./list-videos.component.scss'],
})
export class ListVideosComponent implements OnInit {
  videoList: any[];
  videoItems: any[] = [];
  VideoForm: FormGroup;
  MainTopicList: any[] = [];
  MainTopicItems1: any[] = [];
  subCategoryList: any[];
  subCategories: any;
  result: any[];
  catname: any[];
  allVideoItems: any[];
  allVideoItems1: any[];
  pageSort = 'asc';
  categoryKey: any;
  isDataLoaded = false;
  subCategoryKey: any;
  videokey: any;
  selectedVideoUrl: any;
  chapterKeys: any;
  subcatname: any[] = [];
  chapterName: any[];
  chapterList: any;
  chapterData: any[] = [];
  chapterItems: any[] = [];
  deleteItem: any;
  publishItem: any;
  unPublishItem: any;
  orderStatus: boolean;
  //for pagination
  pageNo: number = 1;
  pageNoBind: number;
  pageMaxSize: number = 10;
  itemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  searchFilter = {
    mainTopic: { $key: '', categoryName: 'Select main topic' },
    subTopic: { $key: '', subCategory: 'Select sub topic'},
    chapter: { $key: '', chapterName: 'Select chapter'},
  };
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  videoDetails: any

  constructor(
    public youTubeVideoService: YouTubeVideoService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastMessageService,
    public mainTopicService: MainTopicService,
    public formbuilder: FormBuilder,
    public chapterService: ChapterService,
    private spinner: NgxSpinnerService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo ? params.pageNo : 1;
      this.itemsPerPage = params.itemsPerPage ? parseInt(params.itemsPerPage) : 10;
    })
    this.orderStatus = false
    this.setyoutubeVideoForm()
  }

  ngOnInit() {
    this.getYouTubeList()
    this.getMainTopicList()
    this.getAllChapters()
  }
  // function to get all video details
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
      const videos = async() => { 
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
              order: value['order'],
              videosInchapterKey: value['videosInchapterKey'],
              isPremium: value['isPremium']
            })
          })
        })
      }
      videos().then(()=>{
        if(this.searchFilter.chapter.$key !== ''){
          this.changeChapter();
        } else if(this.searchFilter.subTopic.$key !== ''){
          this.changeSubCategory();
        } else if(this.searchFilter.mainTopic.$key !== ''){
          this.changeCategory();
        } else {
          // this.allVideoItems = this.videoItems
          this.allVideoItems = _.orderBy(
            this.videoItems,
            [(data) => data?.order],
            'asc'
          )
        }
        // if(this.searchFilter.chapter.$key === ''){
          
        // }
      })
    })
  }
  // function to initialize video form
  setyoutubeVideoForm() {
    this.VideoForm = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
      chapterName: [''],
    })
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

      this.MainTopicList.unshift({$key: '', categoryName: 'Select main topic'})
      this.searchFilter.mainTopic = this.MainTopicList[0];
      this.subcatname.unshift({ $key: '', subCategory: 'Select sub topic' })
      this.searchFilter.subTopic = this.subcatname[0];
      this.chapterItems.unshift({ $key: '', chapterName: 'Select chapter' })
      this.searchFilter.chapter = this.chapterItems[0];

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
                $key: subcatkey,
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
          $key: chapter.$key,
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
    const videoList = this.videoItems;
    const categories = this.searchFilter.mainTopic
    if(categories.$key !== ""){
      this.allVideoItems = this.videoItems.filter((item) => item.categoryKey === categories.$key);
      this.subcatname = this.MainTopicItems1.filter((item) => item.categorykey === categories.$key)
      this.subcatname.unshift({ $key: '', subCategory: 'Select sub topic' })
      this.searchFilter.subTopic = this.subcatname[0]
    } else {
      this.allVideoItems = videoList;
    }
    // this.pageNo = 1;
  }
  // function to filter chapters based on subcategories
  changeSubCategory() {
    const videoList = this.videoItems;
    const categories = this.searchFilter.mainTopic;
    const subCategories = this.searchFilter.subTopic;
    if(subCategories.$key !== ''){
      console.log("here")
      this.allVideoItems = videoList.filter((item) => 
        (item.subCategoryKey === subCategories.$key) && (item.categoryKey === categories.$key)
      );
      this.chapterItems = this.chapterData.filter(
        (item) => item.subCategorykey === subCategories.$key
      );
      this.chapterItems.unshift({ $key: '', chapterName: 'Select chapter' });
      this.searchFilter.chapter = this.chapterItems[0];
    } else if(categories.$key !== "") {
      console.log("here 1")
      this.allVideoItems = videoList.filter((item) => item.categoryKey === categories.$key);
    } else {
      this.allVideoItems = videoList;
    }
    // this.pageNo = 1;
  }
  // function to filter video list  based on chapters
  changeChapter() {
    const videoList = this.videoItems;
    const categories = this.searchFilter.mainTopic;
    const subCategories = this.searchFilter.subTopic;
    const chapters = this.searchFilter.chapter;
    if(chapters.$key !== ''){
      this.allVideoItems = videoList.filter((item) => 
        (item.chapterKey === chapters.$key) && 
        (item.subCategoryKey === subCategories.$key) && 
        (item.categoryKey === categories.$key)
      )
    } else if(subCategories.$key !== ''){
      this.allVideoItems = videoList.filter((item) => 
        (item.subCategoryKey === subCategories.$key) && (item.categoryKey === categories.$key)
      );
    } else if(categories.$key !== "") {
      this.allVideoItems = videoList.filter((item) => item.categoryKey === categories.$key);
    } else {
      this.allVideoItems = videoList;
    }
    // this.pageNo = 1;
  }
  resetFilter() {
    this.videoItems = []
    this.searchFilter.mainTopic = this.MainTopicList[0]
    this.searchFilter.subTopic = this.subcatname[0]
    this.searchFilter.chapter = this.chapterItems[0]
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
  addVideo() {
    this.router.navigate(['/add-videos/manage'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      }
    });
  }
  

  // function to display modal for publish video
  onUpdatePublish(videokey, isPublished, details) {
    const type = 'YOUTUBE'
    const id = videokey
    const objVideo: CommonDeletePublishModal = {
      section: SECTIONS.video,
      displayMessage: APP_MESSAGE.PUBLISH.publish,
      sectionItems: {
        key:videokey,
        videokey,
        isPublished,
        details, 
        type
      },
    }
    this.publishItem = objVideo
    $('#modal-update-publish').modal('show')
  }
  // function to display modal for unpublish video
  onUpdateUnpublish(videokey, isPublished) {
    const id = videokey
    const objVideo: CommonDeletePublishModal = {
      section: SECTIONS.video,
      displayMessage: APP_MESSAGE.UNPUBLISH.unpublish,
      sectionItems: {
        videokey,
        isPublished,
      },
    }
    this.unPublishItem = objVideo
    $('#modal-update-unpublish').modal('show')
  }
  // function to show modal for delete video
  onDeleteVideo(
    categoryKey,
    subCategoryKey,
    chapterKey,
    videokey,
    videosInchapterKey,
    isPublished
  ) {
    const objVideo: CommonDeletePublishModal = {
      section: SECTIONS.video,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: {
        categoryKey,
        subCategoryKey,
        chapterKey,
        videokey,
        videosInchapterKey,
      },
    }
    this.deleteItem = objVideo;
    if (isPublished === false) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.VIDEO.video_cant_delete)
    }
  }
  // function to play video
  playVideo(embedUrl) {
    $('#modalId').modal('show')
    this.selectedVideoUrl = embedUrl + '?rel=0'
    $('#modalBody').html(
      "<iframe width='480' height='270'   src=" +
        this.selectedVideoUrl +
        ' ></iframe>'
    )
  }
  closeModal() {
    $('#modalBody').empty()
    $('#modalId').modal('hide')
  }
  changeOrder() {
    this.orderStatus = true;
  }
  // function to change video order
  onDrop(event: CdkDragDrop<string[]>, orderStatus: boolean) {
    if (orderStatus === true) {
      let currentIndex;
      let previousIndex;
      let previosData;
      let currentData;
      if(this.pageNo > 1){
        currentIndex = (event.currentIndex + ((this.pageNo - 1) * this.itemsPerPage))
        previousIndex = (event.previousIndex + ((this.pageNo - 1) * this.itemsPerPage))
        
      } else {
        currentIndex = event.currentIndex
        previousIndex = event.previousIndex
      }
      if (event.previousContainer === event.container) {
        moveItemInArray(
          event.container.data, 
          previousIndex, 
          currentIndex);
        } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          previousIndex, 
          currentIndex);
      }
      this.allVideoItems.forEach((user, idx) => {
        user.order = idx + 1;
      })
    }
  }
  // function to update video order
  Save() {
    this.allVideoItems.forEach((user, idx) => {
      const order = user.order
      const categoryKey = user.categoryKey
      const subCategoryKey = user.subCategoryKey
      const chapterKey = user.chapterKey
      const videokey = user.videokey
      this.youTubeVideoService.updateVideoOrder(videokey, order)

      this.orderStatus = false
    });
    this.resetFilter();
  }
  onEdit(categoryKey,subCategoryKey,chapterKey,videokey,videosInchapterKey,embedUrl,title,isPublished,thumbnail_url,author_url,video_id,isPremium) {
    // this.videoDetails = this.youTubeVideoService.getVideoDetailsById(chapterKey,videokey)
  // onEdit(videokey) {
    let thumbnail = 'assets/img/youtube-default_2.jpg';
    if(thumbnail_url){ thumbnail = thumbnail_url }
    this.router.navigate(['/Youtube-videos/edit'], {
      queryParams: {
        categoryKey: categoryKey,
        subCategoryKey: subCategoryKey,
        chapterKey: chapterKey,
        videokey: videokey,
        videosInchapterKey: videosInchapterKey,
        v_url: embedUrl,
        title:title,
        thumbnail : thumbnail,
        isPublished: isPublished,
        author_url: author_url,
        video_id: video_id,
        isPremium:isPremium,
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage
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
