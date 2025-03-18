# LandingPage Angular proof of concept

This demo landing page shows a static list of all your favorite bookmarks, see [mock-bookmarks.ts](src/app/mock-bookmarks.ts) to set up which bookmarks will display. This is a proof of concept for testing using this page for storing bookmarks on a full page. I have been using this since July 6, 2022 on all my computer as a manual way to set a custom start page on each of my computers.

- Add Bookmarks button is non functional.

- Settings menu is just a place holder.

- Search bar does not work

- Drop down menu on each bookmark is also just a place holder and does not do anything more than pass through to the underling link

- Links as set up and named in the [mock-bookmarks.ts](src/app/mock-bookmarks.ts) should work as expected taking you to the link clicked on replacing the landing page with what was clicked on.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.4, and has been upgraded to 15.1.0.

## Development server environmental setup

0. Install [nvm](https://github.com/nvm-sh/nvm) if not already installed.

1. Install Node 18.x.x LTS

        nvm use lts/hydrogen

2. Install Angular CLI if not installed already.
    
        npm install -g @angular/cli@15.1.0

## run the app

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
