import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.scss'],
})
export class GridContainerComponent implements OnInit {
  @Input() gridHeaders: any[]
  @Input() dataSource: any[]
  constructor() {}
  ngOnInit(): void {}
}
