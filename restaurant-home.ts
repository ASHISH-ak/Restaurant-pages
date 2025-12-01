import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
}

interface Order {
  id: number;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  orderTime: Date;
  address: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}


@Component({
  selector: 'app-restaurant-home',
   imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './restaurant-home.html',
  styleUrl: './restaurant-home.css',
})
export class RestaurantHome {
   activeTab = signal<'menu' | 'orders'>('menu');
  showAddMenuForm = signal(false);
  selectedOrderStatus = signal<'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed'>('pending');
  
  menuForm: FormGroup;
  menuItems = signal<MenuItem[]>([]);
  orders = signal<Order[]>([]);

  orderStatuses: ('pending' | 'confirmed' | 'preparing' | 'ready' | 'completed')[] = 
    ['pending', 'confirmed', 'preparing', 'ready', 'completed'];

  constructor(private fb: FormBuilder) {
    this.menuForm = this.createMenuForm();
    this.initializeSampleData();
  }

  private createMenuForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      category: ['', [Validators.required]],
      image: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', [Validators.required]],
      isVeg: [true],
      isAvailable: [true]
    });
  }

  private initializeSampleData(): void {
    // Sample menu items
    this.menuItems.set([
      {
        id: 1,
        name: 'Butter Chicken',
        description: 'Tender chicken in rich tomato butter sauce',
        price: 320,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        isVeg: false,
        isAvailable: true
      },
      {
        id: 2,
        name: 'Paneer Butter Masala',
        description: 'Cottage cheese in creamy tomato gravy',
        price: 280,
        category: 'main-course',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
        isVeg: true,
        isAvailable: true
      },
      {
        id: 3,
        name: 'Garlic Naan',
        description: 'Soft bread with garlic butter',
        price: 60,
        category: 'breads',
        image: 'https://images.unsplash.com/photo-1633945274415-b1c7e85aae81?w=400&h=300&fit=crop',
        isVeg: true,
        isAvailable: true
      }
    ]);

    // Sample orders
    this.orders.set([
      {
        id: 1001,
        customerName: 'Rajesh Kumar',
        items: [
          { name: 'Butter Chicken', quantity: 1, price: 320 },
          { name: 'Garlic Naan', quantity: 2, price: 60 }
        ],
        total: 440,
        status: 'pending',
        orderTime: new Date(Date.now() - 30 * 60000),
        address: '123 MG Road, Ahmedabad'
      },
      {
        id: 1002,
        customerName: 'Priya Patel',
        items: [
          { name: 'Paneer Butter Masala', quantity: 1, price: 280 },
          { name: 'Garlic Naan', quantity: 3, price: 60 }
        ],
        total: 460,
        status: 'confirmed',
        orderTime: new Date(Date.now() - 45 * 60000),
        address: '456 Satellite Road, Ahmedabad'
      },
      {
        id: 1003,
        customerName: 'Amit Shah',
        items: [
          { name: 'Butter Chicken', quantity: 2, price: 320 },
          { name: 'Paneer Butter Masala', quantity: 1, price: 280 }
        ],
        total: 920,
        status: 'preparing',
        orderTime: new Date(Date.now() - 60 * 60000),
        address: '789 CG Road, Ahmedabad'
      }
    ]);
  }

  getNavClass(tab: string): string {
    const baseClass = "flex items-center px-4 py-2 rounded-2xl font-semibold transition-all duration-200";
    return this.activeTab() === tab 
      ? `${baseClass} bg-orange-500 text-white`
      : `${baseClass} text-gray-600 hover:text-orange-500 hover:bg-orange-50`;
  }

  addMenuItem(): void {
    if (this.menuForm.valid) {
      const newItem: MenuItem = {
        id: Date.now(),
        ...this.menuForm.value
      };
      this.menuItems.update(items => [...items, newItem]);
      this.menuForm.reset({
        isVeg: true,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
      });
      this.showAddMenuForm.set(false);
    }
  }

  toggleAvailability(itemId: number): void {
    this.menuItems.update(items =>
      items.map(item =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  }

  deleteMenuItem(itemId: number): void {
    this.menuItems.update(items => items.filter(item => item.id !== itemId));
  }

  getPendingOrdersCount(): number {
    return this.orders().filter(order => 
      order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing'
    ).length;
  }

  getOrdersCountByStatus(status: string): number {
    return this.orders().filter(order => order.status === status).length;
  }

  getFilteredOrders(): Order[] {
    return this.orders().filter(order => order.status === this.selectedOrderStatus());
  }

  updateOrderStatus(orderId: number, newStatus: Order['status']): void {
    this.orders.update(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }
}
