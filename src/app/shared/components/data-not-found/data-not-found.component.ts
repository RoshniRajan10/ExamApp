import { Component, Input, OnInit } from '@angular/core'
import {} from '@app/shared'

@Component({
  selector: 'app-data-not-found',
  templateUrl: './data-not-found.component.html',
  styleUrls: ['./data-not-found.component.scss'],
})
export class DataNotFoundComponent implements OnInit {
  @Input() noDataMsg: string
  constructor() {}

  ngOnInit(): void {}
}
