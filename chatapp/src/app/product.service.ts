import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Order } from './model/order.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(private http: HttpClient) { }

  // Subject for user messages
  private subject = new Subject<string>();

  // BehaviorSubject for bot responses with an initial message
  private behaviorSubject = new BehaviorSubject<string>('Hello! How can I help you?');

  updateSubject(value: string) {
    this.subject.next(value);
  }

  updateBehaviorSubject(value: string) {
    this.behaviorSubject.next(value);
  }

  // Exposing Subject and BehaviorSubject as Observables
  getSubject() {
    return this.subject;
  }

  getBehaviorSubject() {
    return this.behaviorSubject;
  }

  getPayment() {
    return this.http.get("http://localhost:3000/payment-details").pipe(
      catchError(error => {
        console.error('Error fetching payment details:', error);
        return of(error);
      })
    );
  }


  getOrderDetails() {
    return this.http.get<Order[]>("http://localhost:3000/order-details").pipe(
      map((orders: Order[]) => {
        let mostRecentOrder = orders[0]; // Start with the first order

        // Loop through the orders to find the most recent one
        for (let i = 1; i < orders.length; i++) {
          if (new Date(orders[i].date) > new Date(mostRecentOrder.date)) {
            mostRecentOrder = orders[i];
          }
        }

        // Return an object with the required fields
        return {
          order_id: mostRecentOrder.order_id,
          amount: mostRecentOrder.amount,
          date: mostRecentOrder.date,
          status: mostRecentOrder.status
        };
      }),
      catchError((error) => {
        console.error('Error fetching order details:', error);
        return of(error);
      })
    );
  }
}
