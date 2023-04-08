import { Component } from '@angular/core';

@Component({
  selector: 'app-flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.css']
})
export class FlyoutComponent {
  isOpen = false;

  toggleFlyout() {
    this.isOpen = !this.isOpen;
  }
}
