import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import {
  AddExamComponent,
  AddQuestionComponent,
  ListExamsComponent,
  EditExamsComponent,
  ListQuestionsComponent,
  UpdateExamComponent,
  ExamResultsComponent,
} from './components'

const routes: Routes = [
  { path: 'manage', component: AddExamComponent },
  { path: 'manage-exam', component: AddQuestionComponent },
  { path: '', component: ListExamsComponent },
  { path: 'edit', component: EditExamsComponent },
  { path: 'view-questions', component: ListQuestionsComponent },
  { path: 'update', component: UpdateExamComponent },
  { path: 'results', component: ExamResultsComponent },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamRoutingModule {}
