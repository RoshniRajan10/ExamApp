import { Component, OnInit } from '@angular/core'
import {
  ToastMessageService,
  YouTubeVideoService,
  MainTopicService,
  ChapterService,
} from '@app/core'
import { APP_MESSAGE } from '@app/core/config';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { error } from 'console';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
declare var $: any;
@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
})
export class VideosComponent implements OnInit {
  addVideoForm: any;
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
  showYoutubeDetails: boolean;
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
  videoValidate: boolean;
  isUploaded = true;
  isPremium = false;
  pageNo: number;
  itemsPerPage: number;
  constructor(
    public youTubeVideoService: YouTubeVideoService,
    public formbuilder: FormBuilder,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastMessageService,
    public mainTopicService: MainTopicService,
    public chapterService: ChapterService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
    })
    this.showYoutubeDetails = false;
    this.setVideoForm();
  }

  ngOnInit(): void {
    this.getMainTopicList()
    this.getAllChapters()
    this.getYouTubeList()
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
  // function to get video count
  getYouTubeList() {
    this.youTubeVideoService.getAllYoutubeVideos().subscribe((list) => {
      this.videoList = list.map((item) => {
        return {
          $key: item.key,
          data: item.payload.val(),
        }
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
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
      var match = videoID.match(regExp)
      if (match && match[2].length == 11) {
        // Do anything for being valid
        // if need to change the url to embed url then use below line
        this.videoValidate = false
      } else {
        this.videoValidate = true
        // Do anything for not being valid
      }
    }
  }

  // function to fetch video details from youtube api
  FetchYouTubeData() {
    this.addVideoForm.value.thumbnail = ''
    this.extarctedVideoIDs = this.addVideoForm.value.videoID
    if(this.extarctedVideoIDs === ''){
      this.videoValidate = true;
    } else {
      const resultData = this.YouTubeGetID(this.addVideoForm.value.videoID)
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
            })
            $('#iframeId').html(this.YouTubeItems[0].html)
          },
          (error) => {}
        )
      }
    }
  }
  // function to category list
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
              //   }
              // )
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
  // function to filter chapters based on subcategories
  changeSubCategory() {
    const subCategoryName = this.addVideoForm.value.subCategoryName
      .subcatKey
    this.chapterItems = this.chapterData.filter(
      (item) => item.subCategorykey === subCategoryName
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
      this.thumbnailUrl = this.YouTubeItems[0].thumbnail_url
      this.autherurl = this.YouTubeItems[0].author_url
      this.embedUrl = $('#iframeId > iframe').attr('src')
    }

    const VideoData = {
      chapterName: this.addVideoForm.value.chapterName.chapterName,
      chapterKey: this.addVideoForm.value.chapterName.chapterkey,
      embedUrl: this.embedUrl,
      categorykey: this.addVideoForm.value.categoryName.$key,
      subCategoryKey: this.addVideoForm.value.subCategoryName.subcatKey,
      thumbnail_url: this.thumbnailUrl,
      url: this.YouTubeItems[0].url,
      video_id: this.YouTubeItems[0].video_id,
      title: this.YouTubeItems[0].title,
      author_url: this.autherurl,
      isPublished: false,
      order: this.videoLength + 1,
      created_at: firebase.database.ServerValue.TIMESTAMP,
      isPremium: this.isPremium
    }

    // if (objResultVideo) {
    if (this.addVideoForm.valid) {
      const objResult = this.youTubeVideoService.addYoutubeData(VideoData)
      if (objResult) {
        this.toastr.show(APP_MESSAGE.VIDEO.video_add, false);
        const params = {
          chapterName: this.addVideoForm.value.chapterName.chapterName,
          chapterKey: this.addVideoForm.value.chapterName.chapterkey,
          categorykey: this.addVideoForm.value.categoryName.$key,
          subCategoryKey: this.addVideoForm.value.subCategoryName.subcatKey,
          categoryName: this.addVideoForm.value.categoryName.categoryName,
          subCategoryName: this.addVideoForm.value.subCategoryName.subCategory,
          youtubeDataKey: objResult,
        }
        const objResultVideo = this.youTubeVideoService.addVideosInChapter(
          params,
          this.addVideoForm.value.chapterName.chapterkey,
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
      //  }
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
