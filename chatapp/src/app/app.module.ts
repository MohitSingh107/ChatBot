import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

@NgModule({
   declarations:[AppComponent],
   imports:[BrowserModule,HttpClientModule,FormsModule],
   providers:[],
   bootstrap:[AppComponent] 
})
export class AppModule {

}