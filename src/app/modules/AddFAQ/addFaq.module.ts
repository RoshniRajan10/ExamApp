import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AddFaqComponent } from './components'
import { NgxEditorModule } from 'ngx-editor'
import { AddFaqRoutingModule } from './addFaq-routing.module'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
@NgModule({
  declarations: [AddFaqComponent],
  imports: [
    CommonModule,
    AddFaqRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEditorModule,
    RichTextEditorAllModule,
  ],
})
export class AddFaqModule {}
