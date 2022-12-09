import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core'

@Component({
  selector: 'app-right-nav-menu',
  templateUrl: './right-nav-menu.component.html',
  styleUrls: ['./right-nav-menu.component.scss'],
})
export class RightNavMenuComponent implements OnInit, AfterViewInit {
  @ViewChild('mainSidebar', { static: false }) mainSidebar
  @Output() mainSidebarHeight: EventEmitter<any> = new EventEmitter<any>()
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.mainSidebarHeight.emit(this.mainSidebar.nativeElement.offsetHeight)
  }
}
