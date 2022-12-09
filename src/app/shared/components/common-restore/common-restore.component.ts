import { Component, OnInit, Input } from '@angular/core'
declare var $: any
import { CommonDeleteService } from '@app/core'
@Component({
  selector: 'app-common-restore',
  templateUrl: './common-restore.component.html',
  styleUrls: ['./common-restore.component.scss']
})
export class CommonRestoreComponent implements OnInit {
  @Input() item: any
  sectionid: string
  constructor(private commonDeleteService: CommonDeleteService) {}

  ngOnInit() {}
  restoreData(section, sectionItems) {
    this.sectionid = section.key
    this.commonDeleteService.restoreItem(this.sectionid, sectionItems)
  }
}
