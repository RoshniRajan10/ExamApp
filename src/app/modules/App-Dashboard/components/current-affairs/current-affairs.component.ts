import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import {
  AppDashboardService,
  ToastMessageService,
} from '@app/core';
declare var $: any;
import * as _ from 'lodash';
import { APP_MESSAGE } from '@app/core/config';
import { SECTIONS } from '@app/core/utils';
@Component({
  selector: 'app-current-affairs',
  templateUrl: './current-affairs.component.html',
  styleUrls: ['./current-affairs.component.scss']
})
export class CurrentAffairsComponent implements OnInit {
  caAsList: boolean;
  currentAffairsForm: FormGroup;
  submitted: boolean;
  isDataLoaded: boolean;
  currentAffairsData: any[];
  cuInList: any;


  constructor(
    private appDashboardService: AppDashboardService,
    public formbuilder: FormBuilder,
    private toastr: ToastMessageService,
  ) { 
    this.setCurrentAffairs()
  }
  
  ngOnInit(): void {
    this.getCurrentAffairsData();
   }

  setCurrentAffairs() {
    this.currentAffairsForm = this.formbuilder.group({
      cuInList: [''],
      caAsList: ['']
    })
  }
  get currentsffairsForm() {
    return this.currentAffairsForm.controls
  }
  addexamLink(event) {
    /* tslint:disable */
    if (event.target.checked === true) {
      this.caAsList = true
    } else {
      this.caAsList = false
    }
  }
  getCurrentAffairsData(){
    this.appDashboardService.getCurrentAffairsData().once("value")
    .then((snapShot)=>{
      this.currentAffairsData = snapShot.val();
      this.caAsList = this.currentAffairsData['currentAffairsAsList'];
      this.cuInList = this.currentAffairsData['currentAffairsInList'];
    })
  }
  saveCuInDashBoard(){
    this.submitted = true
    if(!this.caAsList){
      this.caAsList = false;
    }
    // if (!this.currentAffairsForm.invalid) {
      let cuInList = this.currentAffairsForm.value.cuInList;
      if(cuInList == "" || cuInList < 4){
        cuInList = 4;
        this.toastr.show(APP_MESSAGE.APP_DASHBOARD.cu_number, true);
      } else {
        const params = {
          currentAffairsAsList: this.caAsList,
          currentAffairsInList: cuInList
        }
        const result  = this.appDashboardService.addCurrentAffairsData(params)
        if(result){
          this.toastr.show(APP_MESSAGE.APP_DASHBOARD.cu_details_added, false);
          this.getCurrentAffairsData()
        }
      }      
    // }
  }
}
