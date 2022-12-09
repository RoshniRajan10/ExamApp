import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AddExcelFileComponent } from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
import { UploadExcelRoutingModule } from './uploadExcel-routing.module'
// import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [AddExcelFileComponent],
  imports: [
    CommonModule,
    UploadExcelRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    RichTextEditorAllModule,
  ],
})
export class UploadExcelModule {}
