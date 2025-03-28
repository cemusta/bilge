import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyCounterButtonComponent, PageComponent } from '@repo/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MyCounterButtonComponent, PageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'web';
}
