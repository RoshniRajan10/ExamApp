import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { StudyMaterialService, ToastMessageService } from '@app/core'
import { APP_MESSAGE } from '@app/core/config'
import * as firebase from 'firebase'
declare var $: any

@Component({
  selector: 'app-manage-study-material',
  templateUrl: './manage-study-material.component.html',
  styleUrls: ['./manage-study-material.component.scss'],
})
export class ManageStudyMaterialComponent implements OnInit {
  subCategoryKey: any
  studyMaterialKey: any
  sudyMaterialKey: any
  studyMaterialsInSubCategoriesKey: any
  categoryName: any
  subCategoryName: any
  studyMaterialName: any
  description: any
  firstFormGroup: any
  AddStudyMaterialForm: FormGroup
  addstudyMaterial: boolean
  imageLink: boolean
  createdAt: number
  public myreg = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi
  submitted: boolean
  categorykey: any
  studyMaterialsInChapterKey: any
  chapterKeys: any
  hasText: boolean
  pdfUpload: boolean
  ext: any
  selectedFiles: FileList
  private basePath = '/studyMaterial'
  materialPdfName: string
  materialPdf: string
  materialPdfUrl: any
  materialPdfUrlName: any
  pageNo: number;
  itemsPerPage: number;
  smPageNo: number;
  smitemsPerPage: number;
  hasImage = false;
  constructor(
    public studyMaterialService: StudyMaterialService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public formbuilder: FormBuilder,
    private toastr: ToastMessageService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.subCategoryKey = params.subCatKey;
      this.sudyMaterialKey = params.studymatKey;
      this.categorykey = params.categorykeys;
      this.studyMaterialsInChapterKey = params.studyMaterialsInChapterKeys;
      this.chapterKeys = params.chapterKey;
      this.pageNo = params.pageNo;
      this.itemsPerPage = params.itemsPerPage;
      this.smPageNo = params.smPageNo;
      this.smitemsPerPage = params.smitemsPerPage;
    })
    this.setStudyMaterialForm()
  }

  ngOnInit(): void {
    this.getStuMaterialDetails()
    this.firstFormGroup = this.formbuilder.group({
      categoryName: [''],
      subCategoryName: [''],
      studyMaterialName: [''],
      description: [''],
    })
  }
  // initialize study material form
  setStudyMaterialForm() {
    this.AddStudyMaterialForm = this.formbuilder.group({
      title: ['', Validators.required],
      hasText: [''],
      description: [''],
      hasImage: [''],
      imageLink: ['', Validators.pattern(this.myreg)],
      materialPdf: [''],
      materialPdfName: [''],
    })
  }

  // function to get study materialdetails based on studyMaterialsInChapterKey
  getStuMaterialDetails() {
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
    });
  }
  StudyMaterial() {
    this.addstudyMaterial = true
  }
  get StudyMaterialform() {
    return this.AddStudyMaterialForm.controls
  }
  // function to enable description box if true

  addDescription(event) {
    /* tslint:disable */
    if (event.target.checked === true) {
      this.AddStudyMaterialForm.controls['description'].setValidators([
        Validators.required,
      ])
      this.description = true
    } else {
      this.AddStudyMaterialForm.controls['description'].clearValidators()
      this.AddStudyMaterialForm.controls['description'].updateValueAndValidity()
      this.description = false
    }
  }
  // function to enable imafge text box if true
  addImageLink(event) {
    /* tslint:disable */
    if (event.target.checked === true) {
      this.hasImage = true
      this.AddStudyMaterialForm.controls['imageLink'].setValidators([
        Validators.required,
      ])
    } else {
      this.AddStudyMaterialForm.controls['imageLink'].clearValidators()
      this.AddStudyMaterialForm.controls['imageLink'].updateValueAndValidity()
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

  // function to add study materail
  addStudyMaterial() {
    this.submitted = true
    this.createdAt = new Date().getTime()
    if (this.AddStudyMaterialForm.valid) {
      // this.materialPdfUrl =
      if (this.materialPdf != undefined) {
        this.materialPdfUrl = this.materialPdf
        this.materialPdfUrlName = this.AddStudyMaterialForm.value.materialPdfName
      } else if (this.materialPdf === undefined) {
        this.materialPdfUrl = ''
        this.materialPdfUrlName = ''
      }
      const params = {
        title: this.AddStudyMaterialForm.value.title,
        hasText: this.AddStudyMaterialForm.value.hasText,
        description: this.AddStudyMaterialForm.value.description,
        hasImage: this.AddStudyMaterialForm.value.hasImage,
        imageLink: this.AddStudyMaterialForm.value.imageLink,
        materialPdf: this.materialPdfUrl,
        materialPdfName: this.materialPdfUrlName,
        createdAt: this.createdAt,
      }
      const objResultStusyMat = this.studyMaterialService.addStudyMaterials(
        params,
        this.sudyMaterialKey
      )
      if (objResultStusyMat) {
        this.router.navigate(['/view-study-material/view-study-mat'], {
          queryParams: {
            subcategoryKeys: this.subCategoryKey,
            studyMaterialIDs: this.sudyMaterialKey,
            categorykeys: this.categorykey,
            chapterKey: this.chapterKeys,
            studyMaterialsInChapterKeys: this.studyMaterialsInChapterKey,
            pageNo: this.pageNo, 
            itemsPerPage: this.itemsPerPage,
            smPageNo: this.smPageNo,
            smitemsPerPage: this.smitemsPerPage
          }
        })
      }
    }
  }
  GoBack() {
    this.router.navigate(['/view-study-material/view-study-mat'], {
      queryParams: {
        subcategoryKeys: this.subCategoryKey,
        studyMaterialIDs: this.sudyMaterialKey,
        categorykeys: this.categorykey,
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
