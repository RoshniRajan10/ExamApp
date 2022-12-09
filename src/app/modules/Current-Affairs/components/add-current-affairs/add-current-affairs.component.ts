import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, RichTextEditorComponent, NodeSelection } from '@syncfusion/ej2-angular-richtexteditor';
import * as firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';
import { isBase64 } from 'is-base64' ;
import {
  CurrentAffairService,
  ToastMessageService,
  CurrentAffairModel,
} from '@app/core';
import { APP_MESSAGE } from '@app/core/config';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-add-current-affairs',
  templateUrl: './add-current-affairs.component.html',
  styleUrls: ['./add-current-affairs.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService , NodeSelection ]
})
export class AddCurrentAffairsComponent implements OnInit {

  @ViewChild('sample') public rteObj: RichTextEditorComponent;
  // @ViewChild('defaultupload')  public uploadObj: uploaderComponent;
  public insertImageSettings: Object = {
    resize: true,
    saveFormat: 'Base64'
  };
  monthList: any[] = [];
  addCurrentAffairsForm: FormGroup;
  submitted = false;
  public currentAffairKey: any;
  selectedId: any;
  key: any;
  publishedDate: string;
  monthName: string = "";
  select: string;
  minDate = new Date();
  uploaded: boolean;
  attachments: any[] = [];
  downloadUrls: any[] = [];
  changedDescription: string;
  pageNo: number;
  itemsPerPage: number;
  constructor(
    public formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastMessageService,
    public currentAffiarService: CurrentAffairService,
    private spinner: NgxSpinnerService,
    private sanitizer:DomSanitizer
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.select = 'Select month';
      this.currentAffairKey = params.currentAffairKey;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
    });
    this.setcurrentAffairForm()
  }

  ngOnInit(): void {
    this.getMonthList()
    this.onUpdateCurrentAffair(this.currentAffairKey)
  }
  // function to initialize current affair form
  setcurrentAffairForm() {
    this.addCurrentAffairsForm = this.formbuilder.group({
      month: [''],
      date: [''],
      description: [''],
      title: [''],

      isPublished: [''],
      linkAvailable: [''],
    })
  }
  loadSpinner(isShow: boolean) {
    if (isShow) {
      this.spinner.show()
    } else {
      this.spinner.hide()
    }
  }
  // function to get all months
  getMonthList() {
    this.currentAffiarService.getMonth().subscribe((list) => {
      const itemList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.monthList = _.orderBy(
        itemList,
        [(data) => data.monthname?.toLowerCase()],
        'asc'
      );
      this.monthList = this.monthList.filter((item => item.monthname !== " "))
    })
  }
  // function to get particular current affair details by key
  currentAffairDetails($key) {
    return this.currentAffiarService.getCurrentAffairDetails($key)
  }
  // function to get particular month details by key
  monthDetails(month) {
    return this.currentAffiarService.getMonthDetails(month)
  }
  // function to get particular current affair details by key
  onUpdateCurrentAffair(currentAffairKey) {
    this.selectedId = currentAffairKey
    if (this.currentAffairKey) {
      this.currentAffiarService.getCurrentAffairDetails(currentAffairKey)
      .on('value', (snapshot) => {
        const data = snapshot.val();
        const { title, description, date, month } = data;
        // this.currentAffiarService.getMonthDetails(month)
        // .on('value', (snapshot) => {
          const monthDetails = snapshot.val();
          // const { monthName } = monthDetails
          this.monthName = month
          this.publishedDate = date
          this.addCurrentAffairsForm.controls.description.setValue(description)
          this.addCurrentAffairsForm.controls.title.setValue(title)
        // });
      });
    }
  }
  // function to upload attachment to firebase
  async uploadToFireBase(description){
    const today = new Date().getTime();
    this.downloadUrls = [];
    let index = 0;
    let tmp = document.createElement('div');
    tmp.innerHTML = description;
    this.attachments.forEach((attachmnts)=>{
      if(isBase64(attachmnts.src, {mimeRequired: true})){
        const filePath = `${'/ca'}/${today+attachmnts.alt}`;
        firebase.storage().ref().child(filePath).putString(attachmnts.src, 'data_url')
        .then((snapshot) => {
          snapshot.ref.getDownloadURL().then((downloadUrl)=>{
            tmp.getElementsByTagName("img")[index].setAttribute("src", downloadUrl);
            this.changedDescription = tmp.outerHTML;
            index++
          })
        });
      } else {
        this.changedDescription = description;
      }
    });
    this.loadSpinner(true)
    await this.sleep(5000);
  }
  updateCurrentAffairs($key) {
    this.submitted = true;
    const { description } = this.addCurrentAffairsForm.value;
    const today = new Date().getTime();
    if(this.attachments.length !== 0){
      this.uploadToFireBase(description).then(()=>{
      this.loadSpinner(false)
      this.insertCA($key, this.changedDescription)
      })
    } else {
      this.insertCA($key, description)
    }
  }
  insertCA($key, changedDescriptn){
    const { valid, invalid } = this.addCurrentAffairsForm
    if (valid) {
      const {
        date,
        month,
        title,
      } = this.addCurrentAffairsForm.value;
      let desc;
      if(changedDescriptn.includes('width=\"auto\"')){
        changedDescriptn = changedDescriptn.replaceAll('width=\"auto\"','width=\"\"')        
      }
      if(changedDescriptn.includes('height=\"auto\"')){
        changedDescriptn = changedDescriptn.replaceAll('height=\"auto\"','height=\"\"')        
      }
      desc = changedDescriptn
      const description = desc;
      this.currentAffiarService
      .manageCurrentAffair({
        $key,
        date: new Date(date).getTime(),
        description,
        month,
        title,
        isPublished: false,
        linkAvailable: false,
      })
      .then(() => {
        this.toastr.show(
          APP_MESSAGE.CURRENT_AFFAIRS.current_affairs_update,
          false
        )
        this.submitted = false
        this.router.navigate(['/current-affairs'], {
          queryParams: {
            pageNo: this.pageNo,
            itemsPerPage: this.itemsPerPage
          },
        });
      });
      if (invalid) {
        return;
      }
    }
  }
  get currentaffairform() {
    return this.addCurrentAffairsForm.controls
  }

  // function to add current affair
  addCurrentAffairs() {
    const today = new Date().getTime();
    let $key = ''
    const { description } = this.addCurrentAffairsForm.value;
    this.submitted = true
    if(this.attachments.length !== 0){
      this.uploadToFireBase(description).then(()=>{
        this.insertCA($key, this.changedDescription)
      })
    } else {
      this.insertCA($key, description)
    }
  }
  addCA($key, changedDescriptn){
    const { valid, invalid } = this.addCurrentAffairsForm;
    if (valid) {
      const {
        date,
        month,
        title,
      } = this.addCurrentAffairsForm.value;
      const description = changedDescriptn;
      const objCurrentAffair: CurrentAffairModel = {
        $key: $key,
        date: new Date(date).getTime(),
        description,
        month,
        title,
        isPublished: false,
        linkAvailable: false,
      }
      const objResult = this.currentAffiarService.manageCurrentAffair(
        objCurrentAffair
      )
      if (objResult) {
        this.submitted = false
        this.router.navigate(['/current-affairs'], {
          queryParams: {
            pageNo: this.pageNo,
            itemsPerPage: this.itemsPerPage
          }
        });
        this.toastr.show(
          APP_MESSAGE.CURRENT_AFFAIRS.current_affairs_create,
          false
        )
        this.addCurrentAffairsForm.reset()
      } else {
        this.toastr.show(APP_MESSAGE.COMMON.some_went_wrong)
      }
    }
  }
  gotoList() {
    this.router.navigate(['/current-affairs'], {
      queryParams: {
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage
      },
    });
  }

  // function to upload subcategory image
  getAttachmentsDeatisl(isUdate, event) {
    // this.loadSpinner(true)
    if(event.value){
      this.attachments = [];
      this.attachments = this.getSrcs(event.value)
    }
  }
  getSrcs(string){
    const attachments = [];
    let tmp = document.createElement('div');
    tmp.innerHTML = string;
    let alt = tmp.querySelectorAll(".e-rte-image");
    let details = {};
    alt.forEach((item)=>{
      details = {
        alt: item.getAttribute('alt'),
        src: item.getAttribute('src')
      }
      attachments.push(details)
    });
    // this.loadSpinner(false)
    return attachments;
  }
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
