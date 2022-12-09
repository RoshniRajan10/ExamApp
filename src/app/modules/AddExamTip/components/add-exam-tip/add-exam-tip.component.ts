import { Component, OnInit } from '@angular/core'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import {
  UserTipService,
  ToastMessageService,
  UserTipsModel,
  MainTopicService,
} from '@app/core'
import { Router, ActivatedRoute } from '@angular/router'
import * as firebase from 'firebase'
import { APP_MESSAGE } from '@app/core/config'
import * as _ from 'lodash'

@Component({
  selector: 'app-add-exam-tip',
  templateUrl: './add-exam-tip.component.html',
  styleUrls: ['./add-exam-tip.component.scss'],
})
export class AddExamTipComponent implements OnInit {
  categoryList: any[];
  ExamTipForm: FormGroup;
  examLink: boolean;
  selectedFiles: FileList;
  private basePath = '/levelimages';
  submitted: boolean;
  categoryKey: any;
  usertipKey: any;
  CatKey: any;
  categoryName: any;
  categoryNames: any;
  haslink: any;
  public myreg = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
  image: any;
  ext: any;
  imageName: any;
  pageNo: number;
  itemsPerPage: number;
  constructor(
    public userTipService: UserTipService,
    public mainTopicService: MainTopicService,
    public formbuilder: FormBuilder,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private toastr: ToastMessageService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.CatKey = params.CatKey;
      this.usertipKey = params.usertipKey;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage
    });
    this.setExamTipForm()
  }

  ngOnInit() {
    this.getCategoryList()
    this.onUpdateExamTip(this.CatKey, this.usertipKey)
  }

  get examTipform() {
    return this.ExamTipForm.controls
  }
  // function to get all categories
  getCategoryList() {
    this.mainTopicService.getMainTopics().subscribe((list) => {
      const categoryList = list.map((item) => {
        return {
          $key: item.key,
          ...item.payload.val(),
        }
      });
      this.categoryList = _.orderBy(
        categoryList,
        [(data) => data.categoryName?.toLowerCase()],
        'asc'
      );
    })
  }
  // function to initialize examtip form
  setExamTipForm() {
    this.ExamTipForm = this.formbuilder.group({
      categoryKey: [''],
      categoryName: [''],
      createdAt: [''],
      examTipDescription: [''],
      examTipName: [''],
      haslink: [''],
      image: [''],
      imageName: [''],
      isPublished: [''],
      tipLink: ['', Validators.pattern(this.myreg)],
    })
  }
  // function to show exam link field  if true
  addexamLink(event) {
    /* tslint:disable */
    if (event.target.checked === true) {
      this.ExamTipForm.controls['tipLink'].setValidators([Validators.required])
      this.examLink = true
    } else {
      this.ExamTipForm.controls['tipLink'].clearValidators()
      this.ExamTipForm.controls['tipLink'].updateValueAndValidity()
      this.examLink = false
    }
  }
  // function to get particular usertip details based on a key
  UserTipsDetails(categoryKey, usertipKey) {
    return this.userTipService.getUserTipsDetails(categoryKey, usertipKey)
  }
  // function to get category details based on a category key
  categoryDetails(categoryKey) {
    return this.userTipService.getcategoryDetails(categoryKey)
  }
  // function to display examtip details based on examtip key
  onUpdateExamTip(CatKey, usertipKey) {
    this.categoryKey = CatKey;
    this.usertipKey = usertipKey;
    if (this.CatKey) {
      this.userTipService.getUserTipsDetails(CatKey, usertipKey)
      .on('value', (snapshot) => {
        const data = snapshot.val();
        const {
          examTipName,
          examTipDescription,
          haslink,
          image,
          imageName,
          tipLink,
          categoryKey,
          categoryName,
        } = data
        this.haslink = haslink
        this.image = image
        this.imageName = imageName
        this.categoryNames = categoryName
        // this.addExamTipForm.controls.image1.setValue(image1)
        this.ExamTipForm.controls.tipLink.setValue(tipLink)
        this.ExamTipForm.controls.examTipName.setValue(examTipName)
        this.ExamTipForm.controls.examTipDescription.setValue(examTipDescription)
        if (haslink === true) {
          this.examLink = true
        }
      });
    }
  }
  // function to update exam tip
  updateExamTip($key, usertipKey) {
    this.submitted = true
    const { valid, invalid } = this.ExamTipForm
    if (valid) {
      const createdAt = new Date().getTime()
      const {
        categoryName,
        examTipDescription,
        examTipName,
        haslink,
        image,
        imageName,
        tipLink,
      } = this.ExamTipForm.value
      const categoryKey = this.CatKey
      const objExamTip: UserTipsModel = {
        $key: categoryKey,
        categoryKey,
        categoryName: this.ExamTipForm.value.categoryName,
        examTipDescription,
        examTipName,
        haslink,
        image,
        imageName,
        tipLink,
        isPublished: false,
        createdAt,
      }
      const objResult = this.userTipService.manageUserTips(objExamTip)

      this.toastr.show(APP_MESSAGE.EXAM_TIPS.exam_tips_update, false)
      this.submitted = false
      this.router.navigate(['/exam-tips'], {
        queryParams: {
          pageNo: this.pageNo,
          itemsPerPage: this.itemsPerPage
        },
      });
      this.ExamTipForm.reset()

      if (invalid) {
        return
      }
    }
  }
  // function to upload image
  uploadImage(event) {
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
            this.ExamTipForm.controls.image.setValue(downloadURL)
            this.ExamTipForm.controls.imageName.setValue(file.name)
          })
        }
      )
    } else {
      this.toastr.show('Please upload jpg/png format only')
    }
  }
  // function to add exam tip
  addExamTip() {
    const { valid, invalid } = this.ExamTipForm
    this.submitted = true
    if (valid) {
      const createdAt = new Date().getTime()
      const {
        categoryKey,
        examTipDescription,
        examTipName,
        haslink = false,
        image,
        imageName,
        tipLink,
      } = this.ExamTipForm.value

      const objExamTip: UserTipsModel = {
        $key: '',
        categoryKey: this.ExamTipForm.value.categoryKey.$key,
        categoryName: this.ExamTipForm.value.categoryKey.categoryName,
        examTipDescription,
        examTipName,
        haslink,
        image,
        imageName,
        tipLink,
        createdAt,
        isPublished: false,
      }

      const objResult = this.userTipService.manageUserTips(objExamTip)
      if (objResult) {
        this.submitted = false;
        this.ExamTipForm.reset();
        this.router.navigate(['/exam-tips'], {
          queryParams: {
            pageNo: this.pageNo,
            itemsPerPage: this.itemsPerPage
          }
        });
        this.toastr.show(APP_MESSAGE.EXAM_TIPS.exam_tips_create, false)
      } else {
      }
    }
  }
  clearAll() {
    this.ExamTipForm.reset()
  }
  gotoList() {
    this.router.navigate(['/exam-tips'], {
      queryParams: {
        pageNo: this.pageNo,
        itemsPerPage: this.itemsPerPage
      }
    });
  }
}
