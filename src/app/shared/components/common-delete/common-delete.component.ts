import { Component, OnInit, Input } from '@angular/core';
declare var $: any
import { CommonDeleteService } from '@app/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { APP_MESSAGE } from '@app/core/config'
@Component({
  selector: 'app-common-delete',
  templateUrl: './common-delete.component.html',
  styleUrls: ['./common-delete.component.scss'],
})
export class CommonDeleteComponent implements OnInit {
  @Input() item: any;
  sectionid: string;
  deleteMessage = APP_MESSAGE.DELETE.delete;
  constructor(
    private commonDeleteService: CommonDeleteService,
    private analytics: AngularFireAnalytics
    ) { }

  ngOnInit() {}
  deleteData(section, sectionItems) {
    this.analytics.logEvent('delete',{
      content_id: sectionItems.$key
    });
    this.sectionid = section.key;
    this.commonDeleteService.deleteItem(this.sectionid, sectionItems);
  }
}
