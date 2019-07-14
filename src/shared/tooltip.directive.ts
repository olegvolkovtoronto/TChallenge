import { Directive, HostListener, ElementRef, Input} from "@angular/core";
import { MessageService } from "../_services/message.service";
import { Subscription } from 'rxjs';

@Directive({
    selector: "[ovTooltip]",
    host: {
        '(window:resize)': 'onResize($event)'
    }    
})

export class ToolTipDirective {  
    @Input() toolTip: string;
    private messageToBeSent: number = Math.floor(Math.random() * 1000000) + 1;
    private subscription: Subscription;
    private element: ElementRef;       
    private divId: string = "div_" + String(this.messageToBeSent);    

    constructor(elementRef: ElementRef, private messageService: MessageService) { 
        this.element = elementRef;  
        this.element.nativeElement.setAttribute("data-tooltip",this.divId);
        this.subscription = this.messageService.getMessage().subscribe(message=>{            
            if(String(message.text) == String(this.messageToBeSent) ){
               // do nothing
            }
            else {                
                this.hideToolTipDiv();
            }
        });
    }   

    @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {    
       if (event.keyCode === 27) {         
         this.hideToolTipDiv();
       }    
    }    
    
    private getToolTipDiv(){
        var domElement = document.getElementById(this.divId);
        if(domElement==undefined) {
            var rect = this.element.nativeElement.getBoundingClientRect();
            var div = document.createElement('div');
            div.setAttribute("id", this.divId);
            div.style.position = "absolute";
            div.style.top = String(rect.top - 40) + "px"; 
            div.style.left = String(rect.left) + "px"; 
            div.innerText = this.toolTip;

            div.style.borderBottom = "1px dotted black";
            div.style.width = "120px"
            div.style.backgroundColor = "black";
            div.style.color = "#fff";
            div.style.textAlign = "center";
            div.style.borderRadius = "6px";
            div.style.padding = "5px 0";     

            document.body.appendChild(div)
            domElement = document.getElementById(this.divId);
        }        
        return domElement;
    }   

    hideShowToolTipDiv(){           
        var domElement = this.getToolTipDiv();        
        if(domElement!=undefined) {
          if(domElement.style.display =="block"){
            domElement.style.display ="none";             
          }
          else {
            domElement.style.display ="block";          
          }
        }
    }

    hideToolTipDiv(){
        var domElement = document.getElementById(this.divId);
        if(domElement!=undefined) {
            domElement.style.display ="none";           
        }
    }    

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {        
        // debugger;        
        var attribute = targetElement.getAttribute("data-tooltip");
        if(attribute==this.divId){
            this.hideShowToolTipDiv();
            this.messageService.sendMessage(String(this.messageToBeSent));
            return;
        }
        if(targetElement.id==this.divId) {
            return;
        }
        if(targetElement.id!=this.divId){                           
            this.hideToolTipDiv();   
        }
    }    
    
    onResize(){         
        // Remove from DOM
        var domElement = document.getElementById(this.divId);
        if(domElement!=undefined) {
            domElement.parentNode.removeChild(domElement);
        }
    }   
}