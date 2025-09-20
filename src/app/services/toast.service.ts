import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  message: string;
  type:string;
  duration: number;
  header: string;
  ngIfControl: boolean;

  constructor() { 
    this.message="";
    this.type= "";
    this.duration= 0;
    this.header = "";
    this.ngIfControl= false;
  }

  prepare(message: string, type: string, duration: number, header: string){
    this.message = message;
    this.type = type;
    this.duration = duration;
    this.header = header;
    return this;
}

  show(){
    this.ngIfControl = true;
    setTimeout(()=>{
      setTimeout(()=>{
        this.ngIfControl = false; 
      },this.duration);
      return this;
    })
  }
}
