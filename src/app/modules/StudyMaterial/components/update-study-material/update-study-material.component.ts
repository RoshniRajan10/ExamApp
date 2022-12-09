import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Options } from 'ng5-slider'
import { APP_MESSAGE } from '@app/core/config'
import { StudyMaterialService, ToastMessageService } from '@app/core'
import * as firebase from 'firebase'
declare var $: any

@Component({
  selector: 'app-update-study-material',
  templateUrl: './update-study-material.component.html',
  styleUrls: ['./update-study-material.component.scss'],
})
export class UpdateStudyMaterialComponent implements OnInit {
  description: boolean
  imageLink: boolean
  UpdateStudyMaterialForm: FormGroup
  subCategoryKey: any
  studyMaterialsInSubCategoriesKey: any
  studyMaterialID: any
  categoryName: any
  subCategoryName: any
  studyMaterialName: any
  firstFormGroup: FormGroup
  studyMaterialInSubCatkey: any
  studyMatDatakey: any
  title: any
  hasText: boolean
  hasImage = false;
  descriptions: any
  public myreg = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi
  submitted: boolean
  studyMaterialsInChapterKey: any
  chapterKeys: any
  materialPdf: any
  materialPdfName: any
  pdfUpload: boolean
  ext: any
  selectedFiles: FileList
  private basePath = '/studyMaterial'
  subcategoryKey: any
  materialPdfUrl: any
  materialPdfUrlName: string
  pageNo: number;
  itemsPerPage: number;
  smPageNo: number;
  smitemsPerPage: number;
  constructor(
    public studyMaterialService: StudyMaterialService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public formbuilder: FormBuilder,
    private toastr: ToastMessageService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.studyMaterialsInChapterKey = params.studyMaterialsInChapterKeys;
      this.studyMaterialID = params.studymatKey;
      this.studyMatDatakey = params.studyMatDatakeys;
      this.chapterKeys = params.chapterKey;
      this.subcategoryKey = params.subcategoryKeys;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      this.smPageNo = params.smPageNo;
      this.smitemsPerPage = params.smitemsPerPage;
    })
    this.setStudyMaterialForm()
  }

  ngOnInit() {
    this.getStudyMaterialDetails()
    this.getStudyMaterialById()
    this.setFirstForm()
  }
  setFirstForm() {
    this.firstFormGroup = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
      studyMaterialName: [''],
      description: [''],
    })
  }
  // initialize study material form
  setStudyMaterialForm() {
    this.UpdateStudyMaterialForm = this.formbuilder.group({
      title: ['', Validators.required],
      hasText: [''],
      description: [''],
      hasImage: [''],
      imageLink: ['', Validators.pattern(this.myreg)],
      materialPdf: [''],
      materialPdfName: [''],
    })
  }
  // function to get study material details based on studyMaterialsInChapterKey
  getStudyMaterialDetails() {
    const objStudyMarRes = this.studyMaterialService.getStuMaterialDetails(
      this.chapterKeys,
      this.studyMaterialsInChapterKey
    ).once('value').then((snapshot)=>{
      const objStudyMarRes: any =  snapshot.val();
      this.categoryName = objStudyMarRes.categoryName
      this.subCategoryName = objStudyMarRes.subCategoryName
      this.studyMaterialName = objStudyMarRes.studyMaterialName
      this.description = objStudyMarRes.description
      this.hasText = objStudyMarRes.hasText
    })
  }
  // function to get study material details based onstudyMatDatakey
  getStudyMaterialById() {
    this.studyMaterialService.getStudyMaterialDetailsById(this.studyMaterialID,this.studyMatDatakey)
    .on('value', (snapshot) => {
      const objStudyRes = snapshot.val();
      console.log("snapshot.val()",snapshot.val())
      this.title = objStudyRes.title
      this.hasText = objStudyRes.hasText
      this.descriptions = objStudyRes.description
      this.hasImage = objStudyRes.hasImage
      this.imageLink = objStudyRes.imageLink
      this.materialPdf = objStudyRes.materialPdf
      this.materialPdfName = objStudyRes.materialPdfName
    })
  }
  // function to enable description box if true
  addDescription(event) {
    /* tslint:disable */
    if (event.target.checked === true) {
      this.UpdateStudyMaterialForm.controls['description'].setValidators([
        Validators.required,
      ])
      this.description = true
    } else {
      this.UpdateStudyMaterialForm.controls['description'].clearValidators()
      this.description = false
    }
  }
  get StudyMaterialform() {
    return this.UpdateStudyMaterialForm.controls
  }
  // function to enable imafge text box if true
  addImageLink(event) {
    /* tslint:disable */
    if (event.target.checked === true) {
      this.hasImage = true
      this.UpdateStudyMaterialForm.controls['imageLink'].setValidators([
        Validators.required,
      ])
    } else {
      this.UpdateStudyMaterialForm.controls['imageLink'].clearValidators()
      this.hasImage = false
    }
  }
  // function to upload pdf
  uploadPdf(event) {
    this.pdfUpload = true
    const name = event.target.files[0].name
    const lastDot = name.lastIndexOf('.')
    this.ext = name.substring(lastDot + 1)
    if (this.ext === 'pdf') {
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
            this.materialPdfName = file.name
            this.materialPdf = downloadURL
          })
          this.pdfUpload = false
        }
      )
    } else {
      this.toastr.show(APP_MESSAGE.STUDY_MATERIAL.pdf_format)
    }
  }

  // function to update study material
  updateStudyMaterial() {
    this.submitted = true
    if (this.UpdateStudyMaterialForm.valid) {
      if (this.materialPdf != undefined) {
        this.materialPdfUrl = this.materialPdf
        this.materialPdfUrlName = this.UpdateStudyMaterialForm.value.materialPdfName
      } else if (this.materialPdf === undefined) {
        this.materialPdfUrl = ''
        this.materialPdfUrlName = ''
      }
      const title = this.UpdateStudyMaterialForm.value.title
      const hasText = this.UpdateStudyMaterialForm.value.hasText
      const description = this.UpdateStudyMaterialForm.value.description
      const hasImage = this.UpdateStudyMaterialForm.value.hasImage
      const imageLink = this.UpdateStudyMaterialForm.value.imageLink
      const materialPdf = this.materialPdfUrl
      const materialPdfName = this.materialPdfUrlName
      this.studyMaterialService
        .updateStudyMaterialById(
          this.studyMaterialID,
          this.studyMatDatakey,
          title,
          hasText,
          description,
          hasImage,
          imageLink,
          materialPdf,
          materialPdfName
        )
        .then(() => {
        this.toastr.show(APP_MESSAGE.STUDY_MATERIAL.study_mat_updated, false)
        this.router.navigate(['/view-study-material/view-study-mat'], {
          queryParams: {
            subcategoryKeys: this.subcategoryKey,
            studyMaterialIDs: this.studyMaterialID,
            chapterKey: this.chapterKeys,
            studyMaterialsInChapterKeys: this.studyMaterialsInChapterKey,
            pageNo: this.pageNo, 
            itemsPerPage: this.itemsPerPage,
            smPageNo: this.smPageNo,
            smitemsPerPage: this.smitemsPerPage
          }
        })
      })
    }
  }
  GoBack() {
    this.router.navigate(['/view-study-material/view-study-mat'], {
      queryParams: {
        subcategoryKeys: this.subcategoryKey,
        studyMaterialIDs: this.studyMaterialID,
        chapterKey: this.chapterKeys,
        studyMaterialsInChapterKeys: this.studyMaterialsInChapterKey,
        pageNo: this.pageNo, 
        itemsPerPage: this.itemsPerPage,
        smPageNo: this.smPageNo,
        smitemsPerPage: this.smitemsPerPage
      }
    });
  }
}
