import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RestaurantRegister } from './restaurant-register/restaurant-register';
import { Login } from './login/login';
import { RestaurantHome } from './restaurant-home/restaurant-home';


@Component({
  selector: 'app-root',
  imports: [RestaurantRegister,Login,RestaurantHome],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('food-ordering');
}
