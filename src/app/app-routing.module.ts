import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ExamAppLayoutComponent } from './shared'
import { AdminGuard } from './modules/auth/pages/admin.guard'

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./modules/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyModule),
  },
  {
    path: '',
    component: ExamAppLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./modules/Dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'app-dashboard',
        loadChildren: () =>
          import('./modules/App-Dashboard/appDashboard.module').then(
            (m) => m.AppDashboardModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'users-and-roles',
        loadChildren: () =>
          import('./modules/UsersAndRoles/Usersandroles.module').then(
            (m) => m.UsersandrolesModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'parent-topic',
        loadChildren: () =>
          import('./modules/parentTopic/parentTopic.module').then(
            (m) => m.ParentTopicModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'main-topic',
        loadChildren: () =>
          import('./modules/Main Topic/mainTopic.module').then(
            (m) => m.MainTopicModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'exam-level',
        loadChildren: () =>
          import('./modules/ExamLevel/examLevel.module').then(
            (m) => m.ExamLevelModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'month',
        loadChildren: () =>
          import('./modules/Months/month.module').then((m) => m.MonthModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'sub-topic',
        loadChildren: () =>
          import('./modules/SubTopic/subTopic.module').then(
            (m) => m.SubTopicModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'chapters',
        loadChildren: () =>
          import('./modules/Chapters/Chapters.module').then(
            (m) => m.ChaptersModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'current-affairs',
        loadChildren: () =>
          import('./modules/Current-Affairs/CurrentAffairs.module').then(
            (m) => m.ListCurrentAffairsModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'add-current-affairs',
        loadChildren: () =>
          import('./modules/Current-Affairs/CurrentAffairs.module').then(
            (m) => m.ListCurrentAffairsModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'exam-tips',
        loadChildren: () =>
          import('./modules/AddExamTip/addExamTip.module').then(
            (m) => m.AddExamTipModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'add-exam-tips',
        loadChildren: () =>
          import('./modules/AddExamTip/addExamTip.module').then(
            (m) => m.AddExamTipModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'faq',
        loadChildren: () =>
          import('./modules/List-Faq/listFaq.module').then(
            (m) => m.ListFaqModule
          ),
        canActivate: [AdminGuard],
      },

      {
        path: 'add-faq',
        loadChildren: () =>
          import('./modules/AddFAQ/addFaq.module').then((m) => m.AddFaqModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'News',
        loadChildren: () =>
          import('./modules/List-News/listNews.module').then(
            (m) => m.ListNewsModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'add-news',
        loadChildren: () =>
          import('./modules/AddNews/addNews.module').then(
            (m) => m.AddNewsModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'add-exam',
        loadChildren: () =>
          import('./modules/Exam/Exam.module').then((m) => m.ExamModule),
        canActivate: [AdminGuard],
      },

      {
        path: 'manage-exam',
        loadChildren: () =>
          import('./modules/Exam/Exam.module').then((m) => m.ExamModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'exam',
        loadChildren: () =>
          import('./modules/Exam/Exam.module').then((m) => m.ExamModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'edit-exam',
        loadChildren: () =>
          import('./modules/Exam/Exam.module').then((m) => m.ExamModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'manage-exam',
        loadChildren: () =>
          import('./modules/Exam/Exam.module').then((m) => m.ExamModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'update-question',
        loadChildren: () =>
          import('./modules/Exam/Exam.module').then((m) => m.ExamModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'add-study-material',
        loadChildren: () =>
          import('./modules/StudyMaterial/study-material.module').then(
            (m) => m.StudyMaterialModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'study-material',
        loadChildren: () =>
          import('./modules/StudyMaterial/study-material.module').then(
            (m) => m.StudyMaterialModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'view-study-material',
        loadChildren: () =>
          import('./modules/StudyMaterial/study-material.module').then(
            (m) => m.StudyMaterialModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'edit-study-material',
        loadChildren: () =>
          import('./modules/StudyMaterial/study-material.module').then(
            (m) => m.StudyMaterialModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'view-study-material',
        loadChildren: () =>
          import('./modules/StudyMaterial/study-material.module').then(
            (m) => m.StudyMaterialModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'manage-study-material',
        loadChildren: () =>
          import('./modules/StudyMaterial/study-material.module').then(
            (m) => m.StudyMaterialModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'add-videos',
        loadChildren: () =>
          import('./modules/YoutubeVideos/youtubeVideos.module').then(
            (m) => m.YoutubeVideoModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'Youtube-videos',
        loadChildren: () =>
          import('./modules/YoutubeVideos/youtubeVideos.module').then(
            (m) => m.YoutubeVideoModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'upload-excel',
        loadChildren: () =>
          import('./modules/UploadExcel/UploadExcel.module').then(
            (m) => m.UploadExcelModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'practice',
        loadChildren: () =>
          import('./modules/Practice/Practice.module').then(
            (m) => m.PracticeModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'add-practice',
        loadChildren: () =>
          import('./modules/Practice/Practice.module').then(
            (m) => m.PracticeModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'add-questions',
        loadChildren: () =>
          import('./modules/Practice/Practice.module').then(
            (m) => m.PracticeModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'list-questions',
        loadChildren: () =>
          import('./modules/Practice/Practice.module').then(
            (m) => m.PracticeModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'update-questions',
        loadChildren: () =>
          import('./modules/Practice/Practice.module').then(
            (m) => m.PracticeModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'edit-practice',
        loadChildren: () =>
          import('./modules/Practice/Practice.module').then(
            (m) => m.PracticeModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'notification',
        loadChildren: () =>
          import('./modules/Notification/Notification.module').then(
            (m) => m.NotificationModule
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'delete',
        loadChildren: () =>
          import('./shared/shared.module').then((m) => m.SharedModule),
        canActivate: [AdminGuard],
      },
      {
        path: 'reported-errors',
        loadChildren: () =>
          import('./modules/Content-review/ContenReview.module').then(
            (m) => m.ContentReviewModule
          ),
        canActivate: [AdminGuard],
      },
    ],
  },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
