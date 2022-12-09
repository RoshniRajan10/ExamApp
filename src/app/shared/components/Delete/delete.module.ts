import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { DeleteModalComponent } from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { SharedModule } from '@app/shared'
import { DeleteRoutingModule } from './delete-routing.module'
@NgModule({
  declarations: [DeleteModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    DeleteRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
  ],
})
export class DeleteModule {}
