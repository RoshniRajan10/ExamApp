import { Component, OnInit, Renderer2, ViewChild } from '@angular/core'

@Component({
  selector: 'app-exam-app-layout',
  templateUrl: './exam-app-layout.component.html',
  styleUrls: ['./exam-app-layout.component.scss'],
})
export class ExamAppLayoutComponent implements OnInit {
  public sidebarMenuOpened = true
  @ViewChild('contentWrapper', { static: false }) contentWrapper

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.removeClass(document.querySelector('app-root'), 'login-page')
    this.renderer.removeClass(
      document.querySelector('app-root'),
      'register-page'
    )
  }

  mainSidebarHeight(height) {
    // this.renderer.setStyle(
    //   this.contentWrapper.nativeElement,
    //   'min-height',
    //   height - 114 + 'px'
    // );
  }

  toggleMenuSidebar() {
    if (this.sidebarMenuOpened) {
      this.renderer.removeClass(
        document.querySelector('app-root'),
        'sidebar-open'
      )
      this.renderer.addClass(
        document.querySelector('app-root'),
        'sidebar-collapse'
      )
      this.sidebarMenuOpened = false
    } else {
      this.renderer.removeClass(
        document.querySelector('app-root'),
        'sidebar-collapse'
      )
      this.renderer.addClass(document.querySelector('app-root'), 'sidebar-open')
      this.sidebarMenuOpened = true
    }
  }
}
