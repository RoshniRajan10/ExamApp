import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AddExamTipComponent, ListUserTipsComponent } from './components'
import { AddExamTipRoutingModule } from './addExamTip-routing.module'
import { NgxEditorModule } from 'ngx-editor'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { NgxPaginationModule } from 'ngx-pagination'
import { SharedModule } from '@app/shared'
@NgModule({
  declarations: [AddExamTipComponent, ListUserTipsComponent],
  imports: [
    CommonModule,
    AddExamTipRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEditorModule,
    RichTextEditorAllModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class AddExamTipModule {}
