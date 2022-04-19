import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CampgroundService } from '../camp-service.service';
import { Campground } from '../campgrounds.model';

@Component({
  selector: 'app-camp-list',
  templateUrl: './camp-list.component.html',
  styleUrls: ['./camp-list.component.css']
})
export class CampListComponent implements OnInit, OnDestroy {
  campgrounds: Campground[] = []
  isLoading = false
  totalCampgrounds = 0
  campgroundsPerPage = 10
  currentPage = 1
  pageSizeOptions = [10, 20, 30, 50]

  private campgroundsSub: Subscription

  constructor(public campService: CampgroundService) { }

  ngOnInit(): void {
    this.isLoading = true
    this.campService.getCampgrounds(this.campgroundsPerPage, this.currentPage)
    this.campgroundsSub = this.campService.getCampgroundsUpdatedListener()
      .subscribe((campgrounds: {campgrounds: Campground[], campgroundCount: number}) => {
        this.isLoading = false
        this.totalCampgrounds = campgrounds.campgroundCount
        this.campgrounds = campgrounds.campgrounds
      })
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1
    this.campgroundsPerPage = pageData.pageSize
    this.campService.getCampgrounds(this.campgroundsPerPage, this.currentPage)
  }

  ngOnDestroy() {
    this.campgroundsSub.unsubscribe()
  }

}
