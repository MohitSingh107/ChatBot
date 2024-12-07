### Summary of the ChatBot Application

This Angular-based chatbot application is designed to interact with users and handle multiple types of queries related to an e-commerce or food delivery service. The core functionality includes:

1. **User Interaction**: 
   - The chatbot interacts with the user via a message interface where the user can send text messages and receive responses from the bot.
   - The user can ask questions related to `Order Status`, `Payment Issues`, or `General FAQs`.
   - The bot offers options for the user to select, which helps drive the conversation flow. Based on the selected option, different types of responses are generated.

2. **Component Breakdown**:
   - **AppComponent**: This is the main component that contains the logic to handle the conversation flow, including managing the messages, tracking active options (e.g., `isOrderStatusActive`, `isPaymentIssuesActive`), and responding to user input.
   - **ChatMessage**: A model representing each message in the conversation, which includes properties for the message text, the sender (either 'user' or 'bot'), and optional reply options for the user.
   - **ProductService**: This service makes HTTP requests to fetch data like payment details (`getPayment()`) and order details (`getOrderDetails()`). It handles API interactions and processes the response data accordingly.

3. **Message Flow**:
   - The chatbot begins with an initial greeting message: "Hi Mohit, How can I help you!"
   - When the user selects a question (such as `Order Status` or `Payment Issues`), the app shows options and fetches relevant information (like order details or payment status) from an API.
   - The bot responds with the necessary information and also handles invalid inputs or unexpected responses, guiding the user back to valid options.

4. **UI Components**:
   - **Chat Interface**: The chat interface displays the conversation messages in a scrollable chat container. It shows user and bot messages, including any available options for the user to choose from.
   - **Typing Indicator**: A visual typing indicator shows when the bot is preparing a response, simulating a natural conversation flow.

5. **Error Handling**: 
   - The app handles various error scenarios like failing to fetch payment or order details and responds with a user-friendly error message.

6. **Interactive Options**:
   - The user can interact with the bot by selecting options, which dynamically trigger different paths in the conversation. The options include: `Order Status`, `Payment Issues`, `General FAQ's`, and `Exit`.

### Key RxJS Concepts and Subjects Used

1. **BehaviorSubject**:
   - The `BehaviorSubject` is used to store and emit the bot's initial response message ("Hi Mohit, How can I help you!").
   - The bot’s initial response is subscribed to in `ngOnInit()`. When a new value is emitted, the bot replies with an appropriate message after a short delay (simulating typing).
   - `BehaviorSubject` always holds the latest value and can be subscribed to multiple times.

   ```typescript
   private botResponseSubject = new BehaviorSubject<string>('Hi Mohit, How can I help you!');
   ```

2. **Subject**:
   - A `Subject` is used to handle user input (`userMessageSubject`). This allows the app to push user messages and process them asynchronously. 
   - When the user sends a message, it triggers a response after a delay, based on the user’s query.

   ```typescript
   private userMessageSubject = new Subject<string>();
   ```

3. **Subscriptions**:
   - The component subscribes to both the `BehaviorSubject` for bot messages and the `Subject` for user messages.
   - Each time a new message is emitted (either by the bot or the user), the relevant methods are invoked to process the message and generate appropriate responses.
   
   ```typescript
   this.botResponseSubject.subscribe(message => {
     // Handle bot message and update messages array
   });

   this.userMessageSubject.subscribe(message => {
     // Handle user message and generate bot response
   });
   ```

4. **Observable Pipelines (`pipe` and `catchError`)**:
   - The `ProductService` makes HTTP requests to fetch order and payment details. The results are processed using RxJS operators like `map` and `catchError`.
   - `catchError` ensures that errors in the HTTP request are caught and an alternative value (like an error message) is returned.

   ```typescript
   this.http.get<Order[]>("http://localhost:3000/order-details").pipe(
     map((orders: Order[]) => {
       // Process orders
     }),
     catchError((error) => {
       // Handle error and return fallback value
     })
   );
   ```

5. **Asynchronous Behavior**:
   - The app uses asynchronous operations to fetch data from the backend (e.g., `getOrderDetails()` and `getPayment()`), simulating a natural conversation where the bot may take a moment to process and respond.
   - The `setTimeout` function in the subscriptions is used to simulate a typing delay and make the bot responses feel more natural.

6. **Error Handling with `of()`**:
   - In case of an error during the API call (e.g., failed network request), `catchError` uses the `of()` function to emit a default value (like an error message), ensuring that the app doesn’t crash.

   ```typescript
   return of(error);
   ```

### Summary of Tools and Libraries Used:
1. **RxJS**: Used extensively for managing asynchronous data streams, with subjects like `BehaviorSubject` and `Subject` used to track and emit messages.
2. **HttpClient**: For making HTTP requests to external APIs (like fetching order and payment details).
3. **Angular Forms**: Used for two-way data binding between the input field and the component's `prompt` property.
4. **Angular Directives**: `*ngFor`, `*ngIf` to loop through messages and display content conditionally.
5. **Angular Modules**: Modules like `BrowserModule`, `HttpClientModule`, and `FormsModule` are imported to enable essential Angular functionality.

The overall design relies heavily on RxJS's reactive programming model, which ensures that both user interactions and bot responses are managed efficiently through streams of data. This provides a smooth and responsive user experience in the chatbot application.
