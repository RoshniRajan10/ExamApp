import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
  AllUserService,
  ExamService,
  PracticeService,
  StudyMaterialService,
  CurrentAffairService,
  YouTubeVideoService,
} from '@app/core'
import * as _ from 'lodash'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {
  TotalNoOfUsers: number
  TotalNoOfExam: number = 0;
  practiceList: any[]
  PracticeItems1: any[] = []
  AllPracticeListCount: number
  public studyMaterialList: any[]
  totalNoOfStudyMaterial: number
  videoList: any[]
  videoItems: any[] = []
  pageNo = 1
  currentAffairList1: any[]
  currentAffairList2: any[]
  currentAffairs: any[]
  totalNoOfExams: number
  allUserList: any[] = []
  examList: any[] = []
  ExamItems1: any[] = []
  StudyMaterialItems: any[] = []
  allVideoItems: any[]
  allVideoItems1: any[]
  currentAffairList: any[] = []
  isCurAffLoading= true;
  isCurVideosLoading= true;
  allExamList: any[]
  constructor(
    public allUserService: AllUserService,
    public examService: ExamService,
    public practiceService: PracticeService,
    public studyMaterialService: StudyMaterialService,
    public youTubeVideoService: YouTubeVideoService,
    public currentAffiarService: CurrentAffairService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.getAllUsers();
    this.getAllExamList();
    this.getPracticeList();
    this.getStudyMaterialList();
    this.getYouTubeList();
    this.getCurrentAffairsList();
  }
  
  
  
  // function to get all users
  getAllUsers() {
    this.allUserService.getAllUsers().subscribe((list) => {
      const usrList = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      })
      this.allUserList = usrList.filter((item) => item && item.userDetails)
      this.TotalNoOfUsers = this.allUserList.length
    })
  }
  // function to get all exam details
  getAllExamList() {
    this.examService.getExamList().subscribe((list) => {
      this.allExamList = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        return itemList
      })
      this.allExamList.forEach((e1)=>{
        if((e1.isPublished == true)&&(e1.examsInCategory)){
          const val = Object.values(e1.examsInCategory)
          this.TotalNoOfExam = this.TotalNoOfExam + val.length
        }
      });
    });
    // this.examService.getPublishedCategories().then((list) => {
    //   list.on('value', (snapshot) => {
    //     const data = snapshot.val()
    //     this.ExamItems1 = []
    //     Object.entries(data).forEach(([datakey, datavalue]) => {
    //       this.examList.push({
    //         $key: datakey,
    //         // tslint:disable-next-line: no-string-literal
    //         categoryName: datavalue['categoryName'],
    //         // tslint:disable-next-line: no-string-literal
    //         examsInCategory: datavalue['examsInCategory'],
    //       })
    //     })
    //   })
    //   this.examList.forEach((category, value) => {
    //     if (category.examsInCategory) {
    //       Object.entries(category.examsInCategory).forEach(
    //         ([examkey, examvalue]) => {
    //           this.ExamItems1.push({
    //             /* tslint:disable */
    //             examkeys: examkey,
    //             categoryName: examvalue['metaData'].categoryName,
    //           })
    //           this.totalNoOfExams = this.ExamItems1.length
    //         }
    //       )
    //     }
    //   })
    // })
  }
  // function to get all practice list
  getPracticeList() {
    this.practiceService.getExamList().subscribe((list) => {
      this.practiceList = list.map((item) => {
        const itemList = {
          $key: item.key,
          data: item.payload.val(),
        }
        return itemList
      })
      this.practiceList.forEach((elements) => {
        Object.entries(elements.data).forEach(([practicekey, value]) => {
          if((value['metaData'].practiceName) && (value['metaData'].practiceName !== "")){
            this.PracticeItems1.push({
              /* tslint:disable */
              practicekeys: practicekey,
            })
          }
          this.AllPracticeListCount = this.PracticeItems1.length
        })
      })
    })
  }
  // function to get all study materials
  getStudyMaterialList() {
    this.studyMaterialService.getAllStudyMaterialList().subscribe((list) => {
      this.studyMaterialList = list.map((item) => {
        const itemList = {
          $key: item.key,
          data: item.payload.val(),
        }
        return itemList
      })
      this.studyMaterialList.forEach((chapter) => {
        Object.entries(chapter.data).forEach(([studymatkey, studymatvalue]) => {
          let studyMaterialName = studymatvalue['metaData'].studyMaterialName;
          if(studyMaterialName && studyMaterialName !== ""){
            this.StudyMaterialItems.push({
              chapterKey: chapter.$key,
            })
          }
          this.totalNoOfStudyMaterial = this.StudyMaterialItems.length
        })
      })
    })
  }
  // function to get all youtube videos
  getYouTubeList() {
    this.youTubeVideoService.getAllYoutubeVideos().subscribe((list) => {
      this.videoList = list.map((item) => {
        const itemList = {
          $key: item.key,
          data: item.payload.val(),
        }
        this.isCurVideosLoading = false;
        return itemList
      })
      this.videoItems = []
      this.videoList.forEach((chapter) => {
        Object.entries(chapter.data).forEach(([videokeys, value]) => {
          this.videoItems.push({
            /* tslint:disable */
            thumbnail_url: value['thumbnail_url'],
            title: value['title'],
            order: value['order'],
            created_at: value['created_at'],
          })
          this.allVideoItems1 = this.videoItems
          this.allVideoItems = _.orderBy(
            this.allVideoItems1,
            [(data) => data?.created_at],
            'asc'
          );
          // console.log(this.allVideoItems);
        })
      })
    })
  }
  // function to get all current affairs
  getCurrentAffairsList() {
    // const data = this.currentAffiarService.getCurrentAffairsLimited('date',50)
    // console.log(data);
    this.currentAffiarService.getCurrentAffairsLimited('date',50).subscribe((list) => {
      this.currentAffairs = list.map((item) => {
        const itemList = {
          $key: item.key,
          ...item.payload.val(),
        }
        this.isCurAffLoading = false;
        return itemList
      })

      this.currentAffairs.forEach((item) => {
        this.currentAffairList.push({
          /* tslint:disable */

          date: item['date'],
          title: item['title'],

          isPublished: item['isPublished'],
        })
      })
      this.currentAffairList = _.orderBy(
        this.currentAffairList,
        [(data) => data?.date],
        'desc'
      )
    })
  }
  viewUsers() {
    this.router.navigateByUrl('/users')
  }
  ViewAllVideos() {
    this.router.navigateByUrl('/Youtube-videos')
  }
  viewPractice() {
    this.router.navigateByUrl('/practice')
  }
  viewStudyMaterial() {
    this.router.navigateByUrl('/study-material')
  }
  viewExam() {
    this.router.navigateByUrl('/exam')
  }
  viewAllCurrentAffair() {
    this.router.navigateByUrl('/current-affairs')
  }
}
