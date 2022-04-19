import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Campground } from "./campgrounds.model";

@Injectable({providedIn: 'root'})

export class CampgroundService {
  private campgrounds: Campground[] = []
  private campgroundsUpdated = new Subject<{campgrounds: Campground[], campgroundCount: number }>()
  maxCampgrounds: number

  constructor(private http: HttpClient, private router: Router) {}

  getCampgroundsUpdatedListener() {
    return this.campgroundsUpdated.asObservable()
  }

  getCampgrounds(campgroundsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${campgroundsPerPage}&page=${currentPage}`
    this.http.get<{message: string, campgrounds: Campground[], maxCampgrounds: number}>("http://localhost:3000/campgrounds" + queryParams)
      .subscribe((campgroundData) => {
        this.maxCampgrounds = campgroundData.maxCampgrounds
        this.campgrounds = campgroundData.campgrounds
        this.campgroundsUpdated.next({campgrounds: [...this.campgrounds], campgroundCount: this.maxCampgrounds})
      })
  }

  getCampground(id: string) {
    return this.http.get<{message: string, campground: Campground}>("http://localhost:3000/campgrounds/" + id)
  }

  newCampground(title: string, location: string, description: string, price: number, image: string) {
    const campground = {title, location, description, price, image}
    this.http.post<{message: string, campground: Campground}>('http://localhost:3000/campgrounds/new', campground)
      .subscribe(result => {
        this.campgrounds.push(result.campground)
        this.campgroundsUpdated.next({campgrounds: [...this.campgrounds], campgroundCount: this.maxCampgrounds})
        this.router.navigate(['/campgrounds', result.campground._id])
      })
  }

  editCampground(id: string, editedTitle: string, editedLocation: string, editedDescription: string, editedPrice: number, editedImage: string) {
    const campground = {editedTitle, editedLocation, editedDescription, editedPrice, editedImage}
    this.http.put('http://localhost:3000/campgrounds/' + id +'/edit', {campground, id})
      .subscribe(result => {
        this.router.navigate(['/campgrounds', id])
      })
  }

  deleteCampground(id: string) {
    this.http.delete("http://localhost:3000/campgrounds/" + id + "/delete")
      .subscribe(response => {
        this.router.navigate(['/campgrounds'])
      })
  }

}
