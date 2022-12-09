import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import {
  ListPracticeComponent,
  AddPracticeComponent,
  UpdatePracticeQuestionsComponent,
  UpdatePracticeComponent,
  AddPracticeQuestionsComponent,
  ListPracticeQuestionsComponent,
} from './components'

const routes: Routes = [
  { path: '', component: ListPracticeComponent },
  { path: 'add', component: AddPracticeComponent },
  { path: 'Add', component: AddPracticeQuestionsComponent },
  { path: 'edit', component: UpdatePracticeComponent },
  { path: 'view', component: ListPracticeQuestionsComponent },
  { path: 'update', component: UpdatePracticeQuestionsComponent },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PracticeRoutingModule {}
