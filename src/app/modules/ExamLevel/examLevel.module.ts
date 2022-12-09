import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { ExamLevelComponent } from './components'
import { ExamLevelRoutingModule } from './examLevel-routing.module'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { SharedModule } from '@app/shared'
@NgModule({
  declarations: [ExamLevelComponent],
  imports: [
    CommonModule,
    ExamLevelRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    SharedModule,
  ],
})
export class ExamLevelModule {}
