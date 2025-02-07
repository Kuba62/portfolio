import { Component, ElementRef, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import emailjs from '@emailjs/browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})

export class ContactComponent {

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]), // Name is required
    email: new FormControl('', [Validators.required, Validators.email]), // Email must be valid
    message: new FormControl('', [Validators.required]) // Message is required
  });


  formSubmitted = false; // Tracks form submission state
  messageSent = false; // Tracks if the message was successfully sent

  onSubmit() {

    this.formSubmitted = true; // Mark the form as submitted

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched(); // Marks all fields as touched to trigger validation
      console.log('Form is invalid. Please fill in all required fields.');
      return;
    }

    else if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      emailjs.send(environment.emailJsServiceId, environment.emailJsTemplateId, formData, environment.emailJsPublicKey)
      .then((response) => {
        console.log('Message sent succesfully', response.status, response.text);
        this.messageSent = true; // Set success message flag to true
        this.contactForm.reset(); // Clear the form after submission
        this.formSubmitted = false; // Reset submission state
        setTimeout(() => {
          this.messageSent = false;
        }, 5000);
      })
      .catch((error) => {
        console.log('Message not sent', error);
      }); 
    } 
    
    else {
      console.log('Form is invalid');
    }

  }

}

