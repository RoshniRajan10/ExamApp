import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-app-dashboard',
  templateUrl: './app-dashboard.component.html',
  styleUrls: ['./app-dashboard.component.scss']
})
export class AppDashboardComponent implements OnInit {
  

  addVideo: boolean = false;
  addVideoButton: boolean;
  order: number;
  valuesForAddAction: { addVideo: boolean; order: number; videoToRemove: string };
  videoToRemove: string;
  
  constructor( ) { }

  ngOnInit(): void { }

  emitedFromSelectedVideos(values){
    this.addVideo = values.addVideo;
    this.order = values.order;
    this.videoToRemove = values.videoToRemove;
    this.valuesForAddAction = {
      addVideo: this.addVideo,
      order: this.order,
      videoToRemove: this.videoToRemove
    }
  }
  emitedFromVideosList(values){
    this.addVideo = values.addVideo;
    this.addVideoButton = values.addVideoButton;
  }
}
