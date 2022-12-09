import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import {
  ExamLevelService,
  ToastMessageService,
  ExamLevelModel,
  CommonDeletePublishModal,
} from '@app/core'
declare var $: any
import * as _ from 'lodash'
import { APP_MESSAGE } from '@app/core/config'
import { SECTIONS } from '@app/core/utils'
import * as firebase from 'firebase'
@Component({
  selector: 'app-exam-level',
  templateUrl: './exam-level.component.html',
  styleUrls: ['./exam-level.component.scss'],
})
export class ExamLevelComponent implements OnInit {
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  examLevelList: any[];
  //for pagination
  pageNo: number = 1;
  pageNoBind: number;
  pageMaxSize: number = 10;
  itemsPerPage: number = 10;
  itemsPerPageValues = [5,10,20,50,100];
  //for pagination end
  submitted = false;
  ExamLevelForm: FormGroup;
  LevelList: any[];
  LevelName: any;
  selectedFiles: FileList;
  private basePath = '/levelimages';
  selectedId: any;
  levelNo: any;
  levelValue: any;
  levelValue1: number;
  levelUpload: boolean;
  levelName: any;
  ext: any;
  pageSort = 'asc';
  deleteItem: any;
  constructor(
    public formbuilder: FormBuilder,
    private toastr: ToastMessageService,
    public examLevelService: ExamLevelService
  ) {
    this.setExamLevelForm()
  }

  ngOnInit() {
    this.getExamLevelList()
  }
  // initialize exam level form
  setExamLevelForm() {
    this.ExamLevelForm = this.formbuilder.group({
      levelName: ['', Validators.required],
      levelThumb: ['', Validators.required],
      levelThumbName: ['', Validators.required],
    })
  }
  // function to get all exam level
  getExamLevelList() {
    this.examLevelService.getAllExamLevels().subscribe((list) => {
      this.examLevelList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      })
      this.examLevelList.forEach((element) => {
        this.levelNo = element.levelValue
      })
    })
    this.sortResult(this.examLevelList, this.pageSort)
  }
  // function to add exam level
  addExamLevel() {
    this.submitted = true
    if (this.examLevelList.length > 0) {
      this.levelValue1 = this.levelNo + 1
    } else {
      this.levelValue1 = 0
    }
    const levelValue = this.levelValue1
    if (this.isLevelNameExist()) {
      const { levelName, levelThumb, levelThumbName } = this.ExamLevelForm.value
      const objExamLevel: ExamLevelModel = {
        $key: '',
        levelName,
        levelThumb,
        levelThumbName,
        levelValue,
      }
      const objResult = this.examLevelService.manageExamLevel(objExamLevel)
      if (objResult) {
        this.submitted = false
        this.toastr.show(APP_MESSAGE.EXAM_LEVEL.exam_level_create, false)
        this.ExamLevelForm.reset()
        this.ExamLevelForm.value.levelThumb = ''
        this.ExamLevelForm.value.levelThumbName = ''
        $('#showAddExamLevelDialog').modal('hide')
      } else {
        this.toastr.show('Something went wrong !!!')
      }
    }
  }
  // function to get exam level details based on a particular level key
  examLevelDetails($key) {
    return this.examLevelService.getexamLevelDetails($key)
  }

  get levelform() {
    return this.ExamLevelForm.controls
  }
  // sorting
  onPageSortAsc() {
    this.pageSort = this.pageSort === 'asc' ? 'asc' : 'asc'
    this.sortResult(this.examLevelList, this.pageSort)
  }
  onPageSortDesc() {
    this.pageSort = this.pageSort === 'desc' ? 'desc' : 'desc'
    this.sortResult(this.examLevelList, this.pageSort)
  }
  sortResult(source, sort) {
    this.examLevelList = _.orderBy(
      source,
      [(data) => data?.levelName?.toLowerCase()],
      sort
    )
  }
  // function to check whether level name exist or not
  isLevelNameExist() {
    const {
      valid,
      invalid,
      value: { levelName },
    } = this.ExamLevelForm
    this.LevelList = this.examLevelList.filter(
      (item) =>
        item.levelName.toLowerCase().replace(/\s/g, '') ===
        levelName.toLowerCase().replace(/\s/g, '')
    )
    this.LevelList.forEach((element) => {
      this.LevelName = element.levelName
    })
    if (this.LevelName !== undefined) {
      if (
        this.ExamLevelForm.valid &&
        levelName.toLowerCase().replace(/\s/g, '') ===
          this.LevelName.toLowerCase().replace(/\s/g, '')
      ) {
        this.toastr.show(APP_MESSAGE.EXAM_LEVEL.level_exists, false)
        return false
      }
      if (invalid) {
        return
      }
      return true
    } else {
      return true
    }
  }
  // function to upload level image
  uploadLevelImage(event) {
    this.levelUpload = true
    const name = event.target.files[0].name
    const lastDot = name.lastIndexOf('.')
    this.ext = name.substring(lastDot + 1)
    if (this.ext === 'jpg' || this.ext === 'png') {
      this.selectedFiles = event.target.files
      const file = this.selectedFiles.item(0)
      const filePath = `${this.basePath}/${file.name}`
      const storageRef = firebase.storage().ref()
      const uploadTask = storageRef.child(filePath).put(event.target.files[0])
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {},
        (error) => {},
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.ExamLevelForm.controls.levelThumb.setValue(downloadURL)
            this.ExamLevelForm.controls.levelThumbName.setValue(file.name)
          })
          this.levelUpload = false
        }
      )
    } else {
      this.toastr.show(APP_MESSAGE.EXAM_LEVEL.level_image_format, false)
    }
  }
  // function to close modal
  onDialogClose(modalId) {
    this.submitted = false
    $('#' + modalId).modal('hide')
    this.ExamLevelForm.reset()
  }
  // function to show modal for update level
  onUpdateExamLevel($key) {
    this.selectedId = $key
    const { levelName, levelThumb, levelThumbName } = this.examLevelDetails(
      $key
    )
    this.levelName = levelName
    $('#showUpdatelevelDialog').modal('show')
    this.ExamLevelForm.controls.levelThumbName.setValue(levelThumbName)
    this.ExamLevelForm.controls.levelThumb.setValue(levelThumb)
  }
  // function to update exam level
  Update($key) {
    this.submitted = true
    const { levelName, levelThumb, levelThumbName } = this.ExamLevelForm.value
    const { levelValue } = this.examLevelDetails($key)
    if (this.ExamLevelForm.valid) {
      this.examLevelService
        .manageExamLevel({
          $key,
          levelName,
          levelValue,
          levelThumb,
          levelThumbName,
        })
        .then(() => {
          $('#showUpdatelevelDialog').modal('hide')
          this.submitted = false
          this.toastr.show(APP_MESSAGE.EXAM_LEVEL.exam_levelc_update, false)
        })
    }
  }
  // function to show delete modal for exam level
  onDeleteExamLevel($key) {
    const { levelValue } = this.examLevelDetails($key)
    const id = $key
    const objExamLevel: CommonDeletePublishModal = {
      section: SECTIONS.examLevel,
      displayMessage: APP_MESSAGE.DELETE.delete,
      sectionItems: { id },
    }
    this.deleteItem = objExamLevel
    if (this.levelNo === levelValue) {
      $('#showDeleteDialog').modal('show')
    } else {
      this.toastr.show(APP_MESSAGE.EXAM_LEVEL.exam_level_cantdelete, false)
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
