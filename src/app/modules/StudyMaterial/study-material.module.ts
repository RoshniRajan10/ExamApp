import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import {
  AddStudyMaterialComponent,
  ManageStudyMaterialComponent,
} from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { StudyMaterialRoutingModule } from './study-material-routing.module'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
import { MatStepperModule } from '@angular/material/stepper'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { Ng5SliderModule } from 'ng5-slider'
import { ListStudyMaterialComponent } from './components/list-study-material/list-study-material.component'
import { EditStudyMaterialComponent } from './components/edit-study-material/edit-study-material.component'
import { ViewStudyMaterialComponent } from './components/view-study-material/view-study-material.component'
import { UpdateStudyMaterialComponent } from './components/update-study-material/update-study-material.component'
import { SharedModule } from '@app/shared'
@NgModule({
  declarations: [
    AddStudyMaterialComponent,
    ManageStudyMaterialComponent,
    ListStudyMaterialComponent,
    EditStudyMaterialComponent,
    ViewStudyMaterialComponent,
    UpdateStudyMaterialComponent,
  ],
  imports: [
    CommonModule,
    StudyMaterialRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    RichTextEditorAllModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    Ng5SliderModule,
    SharedModule,
  ],
})
export class StudyMaterialModule {}
