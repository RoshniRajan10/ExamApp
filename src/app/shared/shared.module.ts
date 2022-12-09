import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule } from '@angular/forms'

import {
  HeaderComponent,
  FooterComponent,
  RightNavMenuComponent,
  SettingsComponent,
  GridContainerComponent,
  DeleteModalComponent,
  CommonDeleteComponent,
} from './components'
import { CommonPublishComponent } from './components/common-publish/common-publish.component'
import { CommonUnpublishComponent } from './components/common-unpublish/common-unpublish.component'
import { LoaderComponent } from './components/loader/loader.component';
import { DataNotFoundComponent } from './components/data-not-found/data-not-found.component';
import { CommonRestoreComponent } from './components/common-restore/common-restore.component';
import { CommonPublishWithoutNotificationComponent } from './components/common-publish-without-notification/common-publish-without-notification.component'

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SettingsComponent,
    RightNavMenuComponent,
    GridContainerComponent,
    DeleteModalComponent,
    CommonDeleteComponent,
    CommonPublishComponent,
    CommonUnpublishComponent,
    LoaderComponent,
    DataNotFoundComponent,
    CommonRestoreComponent,
    CommonPublishWithoutNotificationComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    SettingsComponent,
    RightNavMenuComponent,
    GridContainerComponent,
    CommonDeleteComponent,
    CommonPublishComponent,
    CommonUnpublishComponent,
    LoaderComponent,
    DataNotFoundComponent,
    CommonRestoreComponent,
    CommonPublishWithoutNotificationComponent
  ],
})
export class SharedModule {}
