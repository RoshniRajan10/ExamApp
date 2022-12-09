import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AddExcelComponent } from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { SharedModule } from '@app/shared'
import { AddExcelRoutingModule } from './add-excel-routing.module'
@NgModule({
  declarations: [AddExcelComponent],
  imports: [
    CommonModule,
    SharedModule,
    AddExcelRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
  ],
})
export class AddExcelModule {}
