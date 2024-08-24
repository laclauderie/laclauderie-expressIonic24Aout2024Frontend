import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Data } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  pageTitle: string = 'Dashboard'; // Default page title
  selectedMenuItem: string = ''; // Track selected menu item

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Subscribe to router events to detect route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const childRoute = this.getChildRoute(this.activatedRoute);
        if (childRoute && childRoute.snapshot.data) {
          const data = childRoute.snapshot.data as any;
          // Update page title based on route data
          if (data.title) {
            this.pageTitle = data.title;
          } else {
            this.pageTitle = 'Dashboard';
          }
        } else {
          this.pageTitle = 'Dashboard';
        }

        // Update the selected menu item based on the current URL
        const urlSegments = this.router.url.split('/');
        this.selectedMenuItem = urlSegments[urlSegments.length - 1];
      }
    });
  }

  ngOnInit() {
    // Retrieve selected menu item from local storage if it exists
    const storedMenuItem = localStorage.getItem('selectedMenuItem');
    if (storedMenuItem) {
      this.selectedMenuItem = storedMenuItem;
    }
  }

  // Helper method to get the deepest child route
  private getChildRoute(route: ActivatedRoute): ActivatedRoute {
    if (route.firstChild) {
      return this.getChildRoute(route.firstChild);
    } else {
      return route;
    }
  }

  // Set the selected menu item and store it in local storage
  setSelectedMenuItem(menuItem: string) {
    this.selectedMenuItem = menuItem;
    localStorage.setItem('selectedMenuItem', menuItem);
  }

  logoutAndNavigate() {
    // Perform logout logic if needed
    // For example: clear tokens, reset user data, etc.
  
    // Navigate to the Villes Commerces page
    this.router.navigate(['/villes-commerces']);
  }
  

}
