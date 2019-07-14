import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable ({ providedIn: "root" })

export class MessageService {
   private subject = new Subject<any>();

   sendMessage(message: string) {
       this.subject.next({text: message})
   }
   getMessage() {
       return this.subject.asObservable();
   }
   clearMessages() {
       this.subject.next;
   }
}