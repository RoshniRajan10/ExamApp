import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import {
  ListCurrentAffairComponent,
  AddCurrentAffairsComponent,
} from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { CurrentAffairsRoutingModule } from './CurrentAffairs-routing.module'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
import { SharedModule } from '@app/shared'
@NgModule({
  declarations: [ListCurrentAffairComponent, AddCurrentAffairsComponent],
  imports: [
    CommonModule,
    CurrentAffairsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    RichTextEditorAllModule,
    SharedModule,
  ],
})
export class ListCurrentAffairsModule {}
