import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProductService } from './product.service';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  options?: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  messages: ChatMessage[] = [];
  prompt!: string;
  isTyping = false;
  initialMessageDisplayed = false;

  // Flags for tracking active options
  isFaqActive = false;
  isOrderStatusActive = false;
  isPaymentIssuesActive = false;
  isCancellationPolicyActive = false;

  questionList: string[] = [];

  private botResponseSubject = new BehaviorSubject<string>('Hi Mohit, How can I help you!');
  private userMessageSubject = new Subject<string>();

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.isTyping = true;
    this.botResponseSubject.subscribe(message => {
      setTimeout(() => {
        this.messages.push({ text: message, sender: 'bot', options: this.getOptions() });
        this.isTyping = false;
        this.initialMessageDisplayed = true;
      }, 2000);
    });

    this.userMessageSubject.subscribe(message => {
      this.messages.push({ text: message, sender: 'user' });
      this.isTyping = true;

      setTimeout(() => {
        this.handleUserResponse(message);
        this.isTyping = false;
      }, 3000);
    });
  }

  sendData(): void {
    if (this.prompt.trim()) {
      this.userMessageSubject.next(this.prompt);
      this.prompt = '';
    }
  }

  handleOption(option: string): void {
    this.userMessageSubject.next(option);
  }

  private getOptions(): string[] {
    return [
      'Order Status',
      'Payment Issues',
      'General FAQ\'s',
      'Exit'
    ];
  }

  private noOptions(): string[] {
    return [];
  }

  private handleUserResponse(message: string): void {
    // Handle the active option based on the flags
    if (this.isFaqActive && !this.getOptions().some(option => message.includes(option))) {
      this.handleFaqResponse(message);
    }

    else if (this.isOrderStatusActive && !this.getOptions().some(option => message.includes(option))) {
      this.handleOrderStatusActive(message);
    }

    else if (this.isPaymentIssuesActive && !this.getOptions().some(option => message.includes(option))) {
      this.verifyOrderId(message);
    }

    else {
      // Handle other options
      const botResponse = this.getBotResponse(message);
      if (botResponse) {
        this.messages.push({ text: botResponse, sender: 'bot', options: this.noOptions() });
      }
    }
  }

  private handleFaqResponse(message: string): void {
    switch (message) {
      case '1': {
        this.messages.push({ text: 'The estimated delivery time depends on the restaurant and your location.', sender: 'bot' });
        break;
      }
      case '2': {
        this.messages.push({ text: 'You can cancel your order within a few minutes after placing it.', sender: 'bot' });
        break;
      }
      case '3': {
        this.messages.push({ text: 'We accept major credit/debit cards, digital wallets, and online banking.', sender: 'bot' });
        break;
      }
      case '4': {
        this.messages.push({ text: 'Yes, refunds for canceled orders are processed immediately.', sender: 'bot' });
        break;
      }
      case '5': {
        this.messages.push({ text: 'If your food arrives cold or is incorrect, please contact support.', sender: 'bot' });
        break;
      }
      case '6': {
        this.messages.push({ text: 'If your order is late, you can track it in real-time in the app.', sender: 'bot' });
        break;
      }
      case '/restart': {
        this.messages.push({ text: 'Hi Mohit, How can I help you!', sender: 'bot', options: this.getOptions() });
        this.isFaqActive = false;
        this.isOrderStatusActive = false;
        this.isPaymentIssuesActive = false;
        this.isCancellationPolicyActive = false;
        break;
      }
      default: {
        this.messages.push({ text: 'Please enter a valid option (1-6), or restart the chat by typing `/restart`', sender: 'bot' });
      }
    }
  }

  private verifyOrderId(orderId: string): void {
    this.productService.getPayment().subscribe((payments: any[]) => {
      const payment = payments.find(payment => payment.order_id === orderId);

      if (payment) {
        console.log(payment)
        // If order_id found in payment details
        const botResponse = `Payment found for Order ID: ${payment.order_id}. Amount: ₹${payment.amount}, Status: ${payment.txn_status}.`;
        this.messages.push({ text: botResponse, sender: 'bot' });
        const botResponse2 = `If you have any further query, We recommend you to kindly contact us at our toll free number 011-21131233. We are only active between 10 AM to 5 PM.`;
        this.messages.push({ text: botResponse2, sender: 'bot' });
        this.isPaymentIssuesActive = false;
      } else {
        // If order_id is not found
        const botResponse = `Sorry, no payment information found for Order ID: ${orderId}. Please try again.`;
        this.messages.push({ text: botResponse, sender: 'bot' });
      }
    }, (error) => {
      // Handle API errors
      const errorResponse = 'There was an issue fetching the payment details. Please try again later.';
      this.messages.push({ text: errorResponse, sender: 'bot' });
    });
  }

  private handleOrderStatusActive(message: string): void {
    switch (message) {
      case '1': {
        this.messages.push({ text: 'You will recieve a call on your registered phone number from our representative shortly.', sender: 'bot' });
        this.messages.push({ text: 'The average time for call back will be 5 mins.', sender: 'bot' });
        break;
      }
      case '2': {
        this.messages.push({ text: 'Thank you for using our chat services. Hope we were able to resolve your query, if not kindly restart the chat by typing `/menu`.', sender: 'bot' });
        this.isOrderStatusActive = false;
        break;
      }
      case '/restart': {
        this.messages.push({ text: 'Hi Mohit, How can I help you!', sender: 'bot', options: this.getOptions() });
        this.isFaqActive = false;
        this.isOrderStatusActive = false;
        this.isPaymentIssuesActive = false;
        this.isCancellationPolicyActive = false;
        break;
      }
      default: {
        this.messages.push({ text: 'Please enter a valid option (1-2), or restart the chat by typing `/restart`', sender: 'bot' });
      }
    }
  }

  private getBotResponse(userMessage: string): string | null {
    switch (userMessage) {
      case 'Order Status': {
        this.isOrderStatusActive = true;
        this.isFaqActive = false;
        this.isPaymentIssuesActive = false;
        this.isCancellationPolicyActive = false;
        this.productService.getOrderDetails().subscribe(data => {
          // Create the order object based on the received data
          const order = {
            order_id: data.order_id,
            amount: data.amount,
            date: data.date,
            status: data.status
          };

          // Send the bot's response after receiving the data
          const botResponse = `Hello Mohit! I’ve checked your recent order with ID ${order.order_id}. It's currently ${order.status} as of ${order.date}. The total amount for your order is ₹${order.amount}.`;

          // Push the response to the messages array
          this.messages.push({ text: botResponse, sender: 'bot' });
          this.isTyping = false;  // Stop the typing indicator after response

          const botResponse_1 = `Is there anything else you'd like help with?`
          this.messages.push({ text: botResponse_1, sender: 'bot' });

          const botResponse_2 = `1. Talk with our Customer Executive`
          this.messages.push({ text: botResponse_2, sender: 'bot' });

          const botResponse_3 = `2. Exit`
          this.messages.push({ text: botResponse_3, sender: 'bot' });

        });

        // Set typing indicator to true to simulate bot typing
        this.isTyping = true;

        // Exit the switch statement early, as the response will be handled asynchronously
        return null;
      }
      case 'Payment Issues': {
        this.isFaqActive = false;
        this.isOrderStatusActive = false;
        this.isPaymentIssuesActive = true;
        this.isCancellationPolicyActive = false;
        return 'Please provide your order ID for payment verification.';
      }
      case 'General FAQ\'s': {
        this.isFaqActive = true;
        this.isOrderStatusActive = false;
        this.isPaymentIssuesActive = false;
        this.isCancellationPolicyActive = false;

        const faqIntro = 'Here are some frequently asked questions:';
        this.messages.push({ text: faqIntro, sender: 'bot' });

        this.questionList = [
          '1. What is the estimated delivery time for my order?',
          '2. How do I cancel my order?',
          '3. What payment methods do you accept?',
          '4. Can I get a refund for my canceled order?',
          '5. What happens if my food arrives cold or is incorrect?',
          '6. What do I do if my order is late?',
          'Type the relevant option in the chat'
        ];

        this.questionList.forEach(question => {
          this.messages.push({ text: question, sender: 'bot' });
        });
        return null;
      }
      case 'Exit': {
        return 'Thank you for using our chat services. Hope we were able to resolve your query, if not kindly restart the chat by typing `/menu`.';
      }

      case '/menu': {
        const botResponse = `Hi Mohit, How can I help you!`;
        // Push the response to the messages array
        this.messages.push({ text: botResponse, sender: 'bot', options: this.getOptions() });
        this.isTyping = false;
        this.isFaqActive = false;
        this.isOrderStatusActive = false;
        this.isPaymentIssuesActive = false;
        this.isCancellationPolicyActive = false;
        return null;
      }

      default: {
        return 'Sorry, I didn\'t understand that. Please type `/menu` to restart the chat.';
      }
    }
  }
}
