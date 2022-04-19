import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CampgroundService } from '../camp-service.service';

@Component({
  selector: 'app-new-campground',
  templateUrl: './new-campground.component.html',
  styleUrls: ['./new-campground.component.css']
})
export class NewCampgroundComponent implements OnInit, OnDestroy {
  newCampgroundForm: FormGroup
  isLoading = false

  constructor(public campService: CampgroundService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.newCampgroundForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      price: new FormControl(null, [Validators.required, Validators.min(0), Validators.pattern(/^[1-9]\d*$/)]),
      image: new FormControl(null, {validators: [ Validators.required]})
    })

  }

  onSubmit() {
    if(this.newCampgroundForm.invalid) {
      return
    }
    this.isLoading = true
    this.campService.newCampground(
      this.newCampgroundForm.value.title,
      this.newCampgroundForm.value.location,
      this.newCampgroundForm.value.description,
      this.newCampgroundForm.value.price,
      this.newCampgroundForm.value.image
    )
  }

  ngOnDestroy() {

  }
}
