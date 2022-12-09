import { Component, OnInit, Output, EventEmitter, Input  } from '@angular/core';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { 
  AppDashboardService,
  ToastMessageService,
  YouTubeVideoService,
 } from '@app/core';
import { NgxSpinnerService } from 'ngx-spinner'
import { ActivatedRoute, Router } from '@angular/router'
import * as _ from 'lodash'
import { APP_MESSAGE } from '@app/core/config'
import { FunctionCall } from '@angular/compiler';
declare var $: any

@Component({
  selector: 'app-selected-videos',
  templateUrl: './selected-videos.component.html',
  styleUrls: ['./selected-videos.component.scss']
})
export class SelectedVideosComponent implements OnInit {
  @Output() addVideoEmitter = new EventEmitter<{addVideo:boolean,order:number,videoToRemove:string}>();
  @Input() addVideoValue : boolean;
  isDataLoaded: boolean;
  videoList: any[] = [];
  appDashBoardContents: any[];
  selectedVideoUrl: string;
  videoCount: number;
  addVideoButton = false;
  addVideo: boolean;
  videosHighlighted: any[] = [];
  allVideoItems: any;
  videoItems: any;
  orderStatus: boolean;
  deleteData: any;
  deleteMessage: string;

  constructor(
    private appDashboardService: AppDashboardService,
    private toastr: ToastMessageService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public youTubeVideoService: YouTubeVideoService,
  ) { 
    this.orderStatus = false
  }

  ngOnInit(): void {
    this.getHighlightedVideos();
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
      this.videosHighlighted = _.orderBy(
        this.appDashBoardContents,
        [(data) => data?.order],
        'asc'
      );
      if(this.videosHighlighted.length < 4){
        this.addVideoButton = true;
      }
    })
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
  onRemoveVideo(videoKey){
    this.deleteData = videoKey;
    // this.deleteMessage = APP_MESSAGE.DELETE.delete;
    this.deleteMessage = '<h2  class="text-center">Are you sure to remove this video ?</h2>';
    $('#showDeleteDialog').modal('show');
  }
  removeVideo(videoKey){
    const result = this.appDashboardService.removeHighlightedVideo(videoKey);
    if(result){
      this.toastr.show(APP_MESSAGE.APP_DASHBOARD.video_removed, false);
      $('#showDeleteDialog').modal('hide')
    }
  }
  changeVideo(videoKey,vOrder){
    this.addVideo = true;
    this.addVideoEmitter.emit({addVideo:this.addVideo,order:vOrder,videoToRemove:videoKey});
  }
  addNewVideo(){
    const vOrder = 1;
    this.addVideo = true;
    this.addVideoEmitter.emit({addVideo:this.addVideo,order:vOrder,videoToRemove:""});
  }
  onDrop(event: CdkDragDrop<string[]>, orderStatus: boolean) {
    if (orderStatus === true) {
      if (event.previousContainer === event.container) {
        moveItemInArray(
          event.container.data, 
          event.previousIndex,
          event.currentIndex);
        } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex, 
          event.currentIndex);
      }
      this.videosHighlighted.forEach((video, idx) => {
        video.order = idx + 1;
      })
    }
  }
  // function to update video order
  Save() {
    const saveOrder = async() => {
        this.videosHighlighted.forEach((video) => {
        const order = video.order;
        const videokey = video.$key;
        const result = this.appDashboardService.updateVideoOrder(videokey, order);
        this.orderStatus = false;
      }) 
    }  
    saveOrder().then (()=>{
      this.toastr.show(APP_MESSAGE.APP_DASHBOARD.video_order_save, false);
    }) 
  }
}
