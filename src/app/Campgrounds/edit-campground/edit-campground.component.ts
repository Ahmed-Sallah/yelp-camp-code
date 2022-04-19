import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CampgroundService } from '../camp-service.service';
import { Campground } from '../campgrounds.model';

@Component({
  selector: 'app-edit-campground',
  templateUrl: './edit-campground.component.html',
  styleUrls: ['./edit-campground.component.css']
})
export class EditCampgroundComponent implements OnInit, OnDestroy {
  editCampgroundForm: FormGroup
  id: string
  fetchedCampground: Campground
  isLoading = false

  constructor(public campService: CampgroundService, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.id = paramMap.get('id')
      this.initForm()
    })
  }

  private initForm() {
    this.isLoading = true
    this.campService.getCampground(this.id)
    .subscribe((campgroundData) => {
      this.isLoading = false
      this.fetchedCampground = campgroundData.campground
      this.editCampgroundForm = new FormGroup({
        title: new FormControl(this.fetchedCampground.title, Validators.required),
        location: new FormControl(this.fetchedCampground.location, Validators.required),
        description: new FormControl(this.fetchedCampground.description, Validators.required),
        image: new FormControl(this.fetchedCampground.image, Validators.required),
        price: new FormControl(this.fetchedCampground.price, [Validators.required, Validators.min(0), Validators.pattern(/^[1-9]\d*$/)])
      })
    })
  }

  onSubmit() {
    if(this.editCampgroundForm.invalid) {
      return
    }
    this.isLoading = true
    let editedTitle = this.editCampgroundForm.value.title
    let editedLocation= this.editCampgroundForm.value.location
    let editedDescription = this.editCampgroundForm.value.description
    let editedPrice = this.editCampgroundForm.value.price
    let editedimage = this.editCampgroundForm.value.image
    this.campService.editCampground(this.id, editedTitle, editedLocation, editedDescription, editedPrice, editedimage)
  }

  ngOnDestroy() {
  }
}
