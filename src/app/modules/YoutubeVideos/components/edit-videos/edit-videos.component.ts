import { Component, OnInit } from '@angular/core'
import {
  ToastMessageService,
  YouTubeVideoService,
  MainTopicService,
  ChapterService,
} from '@app/core'
import { APP_MESSAGE } from '@app/core/config'
import { NgxSpinnerService } from 'ngx-spinner'
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import * as firebase from 'firebase'
import { data } from 'jquery'
declare var $: any

@Component({
  selector: 'app-edit-videos',
  templateUrl: './edit-videos.component.html',
  styleUrls: ['./edit-videos.component.scss']
})
export class EditVideosComponent implements OnInit {
  showYoutubeDetails: boolean = true;
  addVideoForm: FormGroup;
  extarctedVideoID: any;
  extarctedVideoIDs: any;
  MainTopicList: any[];
  MainTopicItems1: any[] = [];
  subCategoryList: any[];
  subCategories: any;
  subCatname: any[];
  videoData: any;
  VideoDetails: any[] = [];
  videodatarray: any[] = [];
  title: any;
  YouTubeItems: any[] = [];
  categorykey: any;
  subCategoryKey: any;
  thumbnail_url: any;
  url: any;
  video_id: any;
  author_url: any;
  embedUrl: any;
  submitted: boolean;
  chapterItems: any[];
  chapterList: any;
  chapterData: any[] = [];
  videoList: any;
  videoItems: any[] = [];
  selectedFiles: FileList;
  private basePath = '/YoutubeVideos';
  // tslint:disable-next-line
  videoLength: number = 0;
  ImageUpload: boolean;
  ext: any;
  thumbNailImageName: string;
  thumbNailImage: any;
  error: any;
  thumbnailUrl: any;
  autherurl: any;
  thumbnail: any;
  videoValidate: boolean = false;
  isUploaded = true;
  categoryKey: any;
  chapterKey: any;
  videokey: any;
  videosInchapterKey: any;
  isPublished: any;
  v_url: any;
  videoDetails: any;
  categoryName: any = [];
  categoryNames: any = {
    $key: "", 
    categoryName: ""
  };
  videodetails: any; 
  subCategoryName: any = { $key: "", subCategory: "" };
  chapterName: any = { $key: "", chapterName: "" };
  categoryList: any[];
  subTopicList: any[];
  authorUrl: any;
  isPremium: boolean;
  pageNo: number;
  itemsPerPage: number;
  constructor(
    public youTubeVideoService: YouTubeVideoService,
    public formbuilder: FormBuilder,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastMessageService,
    public mainTopicService: MainTopicService,
    public chapterService: ChapterService,
    private spinner: NgxSpinnerService
    ) {
      this.activatedRoute.queryParams.subscribe((params) => {
      this.categoryKey = params.categoryKey;
      this.subCategoryKey = params.subCategoryKey;
      this.chapterKey = params.chapterKey;
      this.videokey = params.videokey;
      this.videosInchapterKey = params.videosInchapterKey;
      this.v_url = params.v_url;
      this.title = params.title;
      this.isPublished = params.isPublished;
      this.thumbnailUrl = params.thumbnail;
      this.autherurl = params.author_url;
      this.embedUrl = params.v_url;
      this.video_id = params.video_id;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      const v_url1 = this.embedUrl.split('?')[0]
      this.v_url = v_url1.replace("embed/", "watch?v=");
      if(params.isPremium === 'true'){
        this.isPremium = true;
      } else {
        this.isPremium = false;
      }
    });
    this.setVideoForm();
  }

  ngOnInit(): void {
    this.getSubTopicList();
    this.getAllCategories();
    this.getAllChapters();
    this.getAllYouTubeList();
    this.getYouTubeList();
    this.FetchYouTubeThumbNail();
  }

  // function to initialize video form
  setVideoForm() {
    this.addVideoForm = this.formbuilder.group({
      videoID: [''],
      categoryName: [''],
      subCategoryName: [''],
      title: [''],
      chapterName: [''],
      thumbnail: [''],
      ispremium: ['']
    })
  }
  get commentform() {
    return this.addVideoForm.controls
  }
  getYouTubeList() {
    this.youTubeVideoService.getVideoDetailsById(this.chapterKey,this.videokey)
    .then((result)=>{
      result.on("value", snapShot => {
        const data = snapShot.val();
        this.categoryNames = {
          $key: data.categorykey,
          categoryName: data.categoryName,
        }
        this.subCategoryName = {
          $key: data.subCategoryKey,
          subCategory: data.subCategoryName,
        }
        this.chapterName = {
          $key: data.chapterKey,
          chapterName: data.chapterName,
        }
        if(this.v_url === this.addVideoForm.value.videoID){
          this.showYoutubeDetails = true;
        } else {
          this.showYoutubeDetails = false;
        }
      })
    })
  }
  // function to get video id from youtube url
  YouTubeGetID(url) {
    const arr = url.split('v=')
    if (arr.length > 1) {
      this.extarctedVideoID = arr[1].substr(0, 11)
      return true
    } else if (url.indexOf('youtu.be') > -1) {
      const arr1 = url.split('youtu.be')
      this.extarctedVideoID = arr1[1].substr(1, 11)
      return true
    } else {
      return false
    }
  }
  ClearData() {
    this.addVideoForm.value.videoID = ''
  }
  get videoform() {
    return this.addVideoForm.controls
  }
  GoBack() {
    this.router.navigate(['/Youtube-videos'], {
      queryParams: {
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage
      }
    });
  }
  validateYouTubeUrl() {
    const videoID = this.addVideoForm.value.videoID
    if (videoID != undefined || videoID != '') {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
      const match = videoID.match(regExp)
      if (match && match[2].length === 11) {
        // Do anything for being valid
        // if need to change the url to embed url then use below line
        this.videoValidate = false
        this.showYoutubeDetails = false
      } else {
        this.videoValidate = true
        this.showYoutubeDetails = true
        // Do anything for not being valid
      }
    }
  }

  // function to fetch video details from youtube api
  FetchYouTubeData() {
    this.addVideoForm.value.thumbnail = '';
    this.extarctedVideoIDs = this.addVideoForm.value.videoID;
    if(!this.extarctedVideoIDs){
      console.log("in if")
      this.extarctedVideoIDs = this.v_url;
    }
    console.log(this.extarctedVideoIDs)
    const resultData = this.YouTubeGetID(this.extarctedVideoIDs)
    if (resultData) {
      this.showYoutubeDetails = true
      this.youTubeVideoService.getVideoDetails(this.extarctedVideoID).subscribe(
        (element) => {
          this.videodatarray = []
          this.videodatarray.push(element)

          this.error = this.videodatarray[0].error

          Object.entries(this.videodatarray).forEach(([key, value]) => {
            this.YouTubeItems = []
            this.YouTubeItems.push({
              /* tslint:disable */
              title: value['title'],
              author_name: value['author_name'],
              author_url: value['author_url'],
              html: value['html'],
              thumbnail_url: value['thumbnail_url'],
              url: value['url'],
              video_id: this.extarctedVideoID,
            })
            this.title = value['title'];
            this.thumbnailUrl = value['thumbnail_url'];
            this.video_id = this.extarctedVideoID;
          })
          $('#iframeId').html(this.YouTubeItems[0].html)
        },
        (error) => {}
      )
    }
  }
  // function to get all categories
  FetchYouTubeThumbNail() {
    this.addVideoForm.value.thumbnail = '';
    this.extarctedVideoIDs = this.addVideoForm.value.videoID;
    if(!this.extarctedVideoIDs){
      this.extarctedVideoIDs = this.v_url;
    }
    const resultData = this.YouTubeGetID(this.extarctedVideoIDs)
    if (resultData) {
      this.showYoutubeDetails = true
      this.youTubeVideoService.getVideoDetails(this.extarctedVideoID).subscribe(
        (element) => {
          this.videodatarray = []
          this.videodatarray.push(element)
          this.error = this.videodatarray[0].error
          Object.entries(this.videodatarray).forEach(([key, value]) => {
            this.YouTubeItems = []
            this.YouTubeItems.push({
              /* tslint:disable */
              author_name: value['author_name'],
              author_url: value['author_url'],
              html: value['html'],
              thumbnail_url: value['thumbnail_url'],
              url: value['url'],
              video_id: this.extarctedVideoID,
            })
            this.thumbnailUrl = value['thumbnail_url'];
            this.video_id = this.extarctedVideoID;
          })
          $('#iframeId').html(this.YouTubeItems[0].html)
        },
        (error) => {}
      )
    }
  }
  getAllCategories() {
    this.youTubeVideoService.getAllPublishedCategories().subscribe((list) => {
      this.categoryList = list.map((item) => {
        const itemList1 = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList1
      })
    })
  }
  // function to get all subtopics
  // function to get all subtopics
  getSubTopicList() {
    this.mainTopicService.getMainTopics().subscribe((list) => {
      this.subTopicList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.MainTopicItems1 = []
      this.subCategoryList = []
      this.subTopicList.forEach((category) => {
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
      this.changeSubCategorys()
      })
    })
  }
  // function to filter sub categories based on categories
  changeCategory() {
    const category = this.addVideoForm.value.categoryName
    this.subCatname = this.MainTopicItems1.filter(
      (item) => item.categorykey === category.$key
    )
  }
  changeCategorys() {
    const category = this.categoryKey
    this.subCatname = this.MainTopicItems1.filter(
      (item) => item.categorykey === category
    )
  }
  // function to filter chapters based on subcategories
  changeSubCategory() {
    const subCategoryName = this.addVideoForm.value.subCategoryName
      .subcatKey
    this.chapterItems = this.chapterData.filter(
      (item) => item.subCategorykey === subCategoryName
    )
  }
  changeSubCategorys() {
    const subCategoryKeys = this.subCategoryKey
    this.chapterItems = this.chapterData.filter(
      (item) => item.subCategorykey === subCategoryKeys
    )
  }

  // function to upload pdf
  uploadThumbNail(event) {
    this.isUploaded = false
    const [file] = event.target.files
    const { name } = file
    const lastDot = name.lastIndexOf('.')
    this.ext = name.substring(lastDot + 1)
    if (this.ext === 'jpg' || this.ext === 'png') {
      const filePath = `${this.basePath}/${file.name}`
      const storageRef = firebase.storage().ref()
      const uploadTask = storageRef.child(filePath).put(file)
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {},
        (error) => {
          this.isUploaded = true
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.thumbnail = downloadURL
            this.isUploaded = true
          })
        }
      )
    } else {
      this.isUploaded = true
    }
  }
  addVideoData() {
    this.submitted = true
    if (this.error === '401 Unauthorized' || this.error === '403 Forbidden') {
      this.thumbnailUrl = this.thumbnail
      this.autherurl = ''
      this.embedUrl =
        'https://www.youtube.com/embed/' +
        this.extarctedVideoID +
        '?' +
        'feature=oembed'
    } else if (this.error === undefined) {
      if(this.YouTubeItems[0]){
        this.thumbnailUrl = this.YouTubeItems[0].thumbnail_url;
        this.autherurl = this.YouTubeItems[0].author_url;
        this.embedUrl = $('#iframeId > iframe').attr('src')
      }
    }
    // console.log(this.addVideoForm.value);
    const VideoData = {
      embedUrl: this.embedUrl,
      thumbnail_url: this.thumbnailUrl,
      url: this.addVideoForm.value.videoID,
      video_id: this.video_id,
      title: this.addVideoForm.value.title,
      author_url: this.autherurl,
      isPublished: false,
      order: this.videoLength + 1,
      created_at: firebase.database.ServerValue.TIMESTAMP,
      isPremium: this.isPremium
    }

    // if (objResultVideo) {
    if (this.addVideoForm.valid) {
      // console.log(this.addVideoForm.value);
      const objResult = this.youTubeVideoService.updateYoutubeData(VideoData,this.videokey)
      if (objResult) {
        this.toastr.show(APP_MESSAGE.VIDEO.video_updated, false);
        const params = {
          chapterKey:  this.chapterKey,
          categorykey: this.categoryKey,
          subCategoryKey: this.subCategoryKey,
          youtubeDataKey: this.videokey,
        }
        const objResultVideo = this.youTubeVideoService.addVideosInChapter(
          params,
          this.chapterKey,
          params.youtubeDataKey,
          VideoData
        )
      }
      this.router.navigate(['/Youtube-videos'], {
        queryParams: {
          pageNo: this.pageNo, 
          itemsPerPage: this.itemsPerPage
        },
      })
    }
  }
  checkDatas(option, value) {
    // compare two values in select
    return option.$key === value.$key
  }
  checkSubCatname(option, value) {
    return option.subCategory === value.subCategory
  }
  checkChapterName(option, value) {
    return option.chapterName === value.chapterName
  }
  // function to get video count
  getAllYouTubeList() {
    this.youTubeVideoService.getAllYoutubeVideos().subscribe((list) => {
      this.videoList = list.map((item) => {
        const itemList = {
          $key: item.key,
          data: item.payload.val(),
        }
        return itemList
      })
      this.videoList.forEach((chapter) => {
        Object.entries(chapter.data).forEach(([videokeys, value]) => {
          this.videoItems.push({
            /* tslint:disable */
            videokey: chapter.$key,
          })
          this.videoLength = this.videoItems.length
        })
      })
    })
  }
  isPremiumEvent(event){
    if(event.target.checked === true){
      this.isPremium = true
    }else{
      this.isPremium = false
    }
  }
}
