import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { DashboardComponent } from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { DashboardRoutingModule } from '.'
import { SharedModule } from '@app/shared'

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class DashboardModule {}
