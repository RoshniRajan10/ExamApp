import { Component, OnInit, Input } from '@angular/core';
import { CommonUnPublishService } from '@app/core';

@Component({
  selector: 'app-common-unpublish',
  templateUrl: './common-unpublish.component.html',
  styleUrls: ['./common-unpublish.component.scss'],
})
export class CommonUnpublishComponent implements OnInit {
  @Input() item: any
  sectionid: any
  constructor(
    private commonUnPublishService: CommonUnPublishService
    ) { }

  ngOnInit(): void {}
  updateunPublishItem(section, sectionItems) {
    this.sectionid = section.key
    this.commonUnPublishService.unPublishItem(this.sectionid, sectionItems)
  }
}
