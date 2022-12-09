import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { RouterModule } from '@angular/router'
import {
  AddStudyMaterialComponent,
  ManageStudyMaterialComponent,
  ListStudyMaterialComponent,
  EditStudyMaterialComponent,
  ViewStudyMaterialComponent,
  UpdateStudyMaterialComponent,
} from './components'

const routes: Routes = [
  { path: 'manage', component: AddStudyMaterialComponent },
  { path: 'add', component: ManageStudyMaterialComponent },
  { path: '', component: ListStudyMaterialComponent },
  { path: 'edit', component: EditStudyMaterialComponent },
  { path: 'view-study-mat', component: ViewStudyMaterialComponent },
  { path: 'update', component: UpdateStudyMaterialComponent },
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudyMaterialRoutingModule {}
