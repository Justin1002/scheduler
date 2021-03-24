# Interview Scheduler

## Final Product

!["gif of application capabilities"](https://github.com/Justin1002/scheduler/blob/master/docs/scheduler-app.gif?raw=true)

!["edit feature screenshot"](https://github.com/Justin1002/scheduler/blob/master/docs/lhl-scheduler-app-edit.png?raw=true)

!["delete image screenshot"](https://github.com/Justin1002/scheduler/blob/master/docs/lhl-scheduler-app-delete.png?raw=true)

## Setup

### Development Mode ###

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. For the API server, fork and clone the repository found at https://github.com/Justin1002/scheduler-api
4. Follow the instructions in the API server README to set-up the local database
5. start up the API server, and start up the scheduler app using npm start
6. Go to http://localhost:8000 in your browser.


### Hosted Website for Production ###

1. Visit https://lhl-scheduler-app.netlify.app/ for a hosted version of the application


## Running Jest Test Framework
Run the jest framework using the following command:
```sh
npm test
```

## Running Storybook Visual Testbed
Run the Storybook visual component views using the following command:
```sh
npm run storybook
```

## Running Cypress end-to-end testing framework

Ensure the API server is running in test mode with the following command in your schedulerapi folder.
```sh
npm run test:server
```

Make sure the development server is ran with npm start in a separate terminal, then run the cypress testing framework using the following command:
```sh
npm run cypress
```

## Dependencies
- Axios
- Classnames
- React
- react-dom
- react-scripts

Full list of dependencies details can be found in the package.json file

## Extras

Added extras include:

1. Web socket capabilities (dynamic updates for multiple users, this can be tested by having multiple browsers open on the same page)