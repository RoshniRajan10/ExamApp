import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AddNewsComponent } from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { AddNewsRoutingModule } from './addNews-routing.module'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
@NgModule({
  declarations: [AddNewsComponent],
  imports: [
    CommonModule,
    AddNewsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    RichTextEditorAllModule,
  ],
})
export class AddNewsModule {}
