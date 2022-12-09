import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
import { MatStepperModule } from '@angular/material/stepper'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { Ng5SliderModule } from 'ng5-slider'
import { PracticeRoutingModule } from './Practice-routing.module'
import { 
  ListPracticeComponent,
  AddPracticeComponent, 
  AddPracticeQuestionsComponent,
  ListPracticeQuestionsComponent,
  UpdatePracticeQuestionsComponent,
  UpdatePracticeComponent,
  SelectRandomQuestionsByTagComponent 
} from './components'

import { SharedModule } from '@app/shared'
import { MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgSelect2Module } from 'ng-select2';
@NgModule({
  declarations: [
    ListPracticeComponent,
    AddPracticeComponent,
    AddPracticeQuestionsComponent,
    ListPracticeQuestionsComponent,
    UpdatePracticeQuestionsComponent,
    UpdatePracticeComponent,
    SelectRandomQuestionsByTagComponent
  ],
  imports: [
    CommonModule,
    PracticeRoutingModule,
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
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    NgSelect2Module
  ],
})
export class PracticeModule {}
