import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { ListNewsComponent } from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { ListNewsRoutingModule } from './listNews-routing.module'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
import { SharedModule } from '@app/shared'
@NgModule({
  declarations: [ListNewsComponent],
  imports: [
    CommonModule,
    ListNewsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    RichTextEditorAllModule,
    SharedModule,
  ],
})
export class ListNewsModule {}
