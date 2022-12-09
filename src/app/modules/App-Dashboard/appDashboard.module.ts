import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { 
  AppDashboardComponent,
  DashboardVideosComponent,
  SelectedVideosComponent 
} from './components'
import { NgxPaginationModule } from 'ngx-pagination'
import { NgxSpinnerModule } from 'ngx-spinner'
import { AppDashboardRoutingModule } from './appDashboard-routing.module'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'
import { NgSelect2Module } from 'ng-select2';
import { SharedModule } from '@app/shared';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CurrentAffairsComponent } from './components/current-affairs/current-affairs.component';

@NgModule({
  declarations: [AppDashboardComponent, DashboardVideosComponent, SelectedVideosComponent, CurrentAffairsComponent],
  imports: [
    CommonModule,
    AppDashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    Ng2SearchPipeModule,
    RichTextEditorAllModule,
    NgSelect2Module,
    SharedModule,
    DragDropModule,
  ],
})
export class AppDashboardModule {}
