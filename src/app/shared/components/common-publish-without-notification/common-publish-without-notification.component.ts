import { Component, OnInit, Input } from '@angular/core'
import { CommonPublishService } from '@app/core/services/common-publish-service'

@Component({
  selector: 'app-common-publish-without-notification',
  templateUrl: './common-publish-without-notification.component.html',
  styleUrls: ['./common-publish-without-notification.component.scss']
})
export class CommonPublishWithoutNotificationComponent implements OnInit {
  @Input() item: any
  sectionid: any
  constructor(private commonPublishService: CommonPublishService) {}

  ngOnInit(): void {}
  updatePublishItem(section, sectionItems) {
    this.sectionid = section.key;
    this.commonPublishService.publishItem(this.sectionid, sectionItems);
  }
}