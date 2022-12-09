import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MonthComponent } from './components'
import { MonthRoutingModule } from './month-routing.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { SharedModule } from '@app/shared'
@NgModule({
  declarations: [MonthComponent, MonthComponent],
  imports: [
    CommonModule,
    MonthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    SharedModule,
  ],
})
export class MonthModule {}
