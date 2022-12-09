import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { 
  PracticeService, 
  ToastMessageService,
  ChapterService 
} from '@app/core';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
import { APP_MESSAGE } from '@app/core/config'

@Component({
  selector: 'app-add-practices',
  templateUrl: './add-practices.component.html',
  styleUrls: ['./add-practices.component.scss']
})
export class AddPracticesComponent implements OnInit {

  // @Output() addVideoEmitter = new EventEmitter<{addVideo:boolean,order:number,videoToRemove:string}>();
  // @Input() selectedPractice: any[];
  practicesForm: FormGroup;
  public data: Array<Select2OptionData>
  public options: Options
  public selectedPractices: string[]= [];
  practiceList: any;
  PracticeItems: any[];
  chapterKey: string;
  chapterInSubCatKey: string;
  chapterDetails: any;
  previousSavedPractices: any[];
  AllPracticeList: any[];
  practices: any;
  selectedItems: string[];
  constructor(
    public activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public practiceService: PracticeService,
    public chapterService: ChapterService,
    public toastr: ToastMessageService,
    private spinner: NgxSpinnerService
  ) { 
    this.activatedRoute.queryParams.subscribe((params) => {
      this.chapterKey = params.chapterKey,
      this.chapterInSubCatKey = params.chapterInSubCatKey
    })
  }

  ngOnInit(): void {
    this.setPracticesForm();
    this.getAllPracticesByChapterUsing();
    this.getPracticeList();
    this.getChapterDetails();
    this.options = {
      multiple: true
    };
  }
  setPracticesForm() {
    this.practicesForm = this.formBuilder.group({
      practicesCtrl: [''],
    })
  }
  get practicesFormCtrls(){
    return this.practicesForm.controls
  }
  // get ChapterDetails
  getChapterDetails(){
    this.chapterService.getChapterById(this.chapterKey)
    .on('value', (snapshot) => {
      this.chapterDetails = {
        chapterId: this.chapterKey,
        chapterDetails: snapshot.val()
      }
    });
  }
  // function to get all practice list
  getPracticeList(){
    this.previousSavedPractices = [];
    this.practiceService.getAllPractices().then((snapshot)=>{
      let practices;
      practices = snapshot.val();
      let PracticeItems = [];
      Object.values(practices).forEach((elements) => {
        Object.entries(elements).forEach(([practicekey, value]) => {
          PracticeItems.push({
            /* tslint:disable */
            key: practicekey,
            id: value['practiceId'],
            text: value['metaData'].practiceName ? value['metaData'].practiceName : '',
            // practicesInChapterKeys: value['practicesInChapterKey'],
            // categoryNames: value['metaData'].categoryName ? value['metaData'].categoryName : '',
            // subCategoryNames: value['metaData'].subCategoryName ? value['metaData'].subCategoryName : '',
            // categoryKeys: value['metaData'].categorykey ? value['metaData'].categorykey : '',
            // isPublished: value['metaData'].isPublished ? value['metaData'].isPublished : '',
            // subCategoryKeys: value['metaData'].subCategoryKey ? value['metaData'].subCategoryKey : '',
            // chapterName: value['metaData'].chapterName ? value['metaData'].chapterName : '',
            // chapterkey: value['metaData'].chapterkey ? value['metaData'].chapterkey : '',
            // totalNoOfQuestion: value['metaData'].totalNoOfQuestions ? value['metaData'].totalNoOfQuestions : '',
            // same_weightage: value['metaData'].same_weightage ? value['metaData'].same_weightage : '',
            // marks: value['metaData'].marks ? value['metaData'].marks : '',
            // negativeMarks: value['metaData'].negativeMarks ? value['metaData'].categoryName : '',
            // isPremium: value['metaData'].isPremium ? value['metaData'].isPremium : '',
            // chaptersUsing: value['chaptersUsing'] ? value['chaptersUsing'] : '',
            // notificationMetaData: value['metaData'],
          });
        });
      });
      this.PracticeItems = PracticeItems;
    })
  }
  // get all practices where the chapter added
  async getAllPracticesByChapterUsing(){
    this.previousSavedPractices = [];
    this.selectedPractices = [];
    this.selectedItems = [];
    this.spinner.show();
    const practices = async()=>{
      return this.chapterService.getAllPracticesChapterUsed().then((snapShot)=>{
        this.practices = snapShot.val();
      })
    } 
    practices()
    .then(()=>{
      Object.entries(this.practices).forEach(([practicekey, value])=>{
        if(value['chaptersUsing']){
          Object.keys(value['chaptersUsing']).forEach((item)=>{
            if((item === this.chapterKey) && (!this.selectedPractices.includes(practicekey))){
              this.selectedPractices.push(practicekey)
            }
          })
        }
      });
      this.spinner.hide();
      console.log(this.selectedPractices)
      this.selectedItems = this.selectedPractices
      this.previousSavedPractices = this.selectedPractices;
    });
  }
  // to save practices in chapter
  savePractices(){
    let filtered = [];
    let filterdDistinct = [];
    let distinctArray = [];
    const practices = this.practicesForm.value.practicesCtrl;
    practices.forEach((element)=>{
      filtered = filtered.concat(this.PracticeItems.filter((item)=> item.id === element))
    })
    if(this.previousSavedPractices.length > 0){
      console.log("this.previousSavedPractices")
      console.log(this.previousSavedPractices)
      distinctArray = this.previousSavedPractices.filter((obj) => { 
        return practices.indexOf(obj) === -1; 
      });
      console.log("distinctArray")
      console.log(distinctArray)
      distinctArray.forEach((element)=>{
        filterdDistinct = filterdDistinct.concat(this.PracticeItems.filter((item) => item.id === element))
      })
      const remove = async() => {
        console.log("filterdDistinct")
        console.log(filterdDistinct)
        await filterdDistinct.forEach((practices)=>{
          console.log("practices")
          console.log(practices)
          const chapterKeyToSave = this.chapterDetails.chapterId;
          this.chapterService
            .removeChapterFromPractice(practices.id, chapterKeyToSave)
          });
        }
      remove().then(()=>{
        this.saveChapterKeysInPratices(filtered);
      });
    } else {
      this.saveChapterKeysInPratices(filtered);
    }
  }
  async saveChapterKeysInPratices(filteredPractices){
    const chapterKeyToSave = this.chapterDetails.chapterId;
    await filteredPractices.forEach((practices)=>{
      this.chapterService
      .saveChapterIdInPractices(practices.id, chapterKeyToSave, this.chapterDetails.chapterDetails);
    });
    this.toastr.show(APP_MESSAGE.PRACTICE.practice_create, false)
    // this.getAllPracticesByChapterUsing();
  }
  
  cancel() {
    $('#showRandomQuestionModel').modal('hide')
  }
}
