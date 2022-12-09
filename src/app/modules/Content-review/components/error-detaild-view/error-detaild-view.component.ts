import { Component, Input, OnInit } from '@angular/core';
import { APP_MESSAGE } from '@app/core/config';

@Component({
  selector: 'app-error-detaild-view',
  templateUrl: './error-detaild-view.component.html',
  styleUrls: ['./error-detaild-view.component.scss']
})
export class ErrorDetaildViewComponent implements OnInit {
  @Input() data: any;
  noDataMsg = APP_MESSAGE.COMMON.result_not_found;
  moduleName: string;
  constructor() { }

  ngOnInit() { }
  

}
