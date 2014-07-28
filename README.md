# NodeZA
> A Node.js portal for developers in South Africa.

Node.js is an exciting new technology that is changing the programming landscape. Being a new technology, it has been very hard to find companies or developers who also use Node.js in South Africa.

NodeZA, pronounced as Node Z A, is a platform that aims to make it easy to find information about Node.js, learn, and connect with other Node users in South Africa.

The information below is aimed at developers who would like to contribute to this platform.


Table of Contents
-----------------

- [System Requirements](#system-requirements)
- [Dependencies](#dependencies)
- [Getting Started](#getting-started)
- [Features](#features)
- [Architecture](#architecture)
- [Testing](#testing)
- [To-Do](#to-do)
- [Contributing](#contributing) 
- [License](#license)



System Requirements
-------------------
 - Node.js(with npm) 10.x
 - MySQL (Application database)
 - MongoDB (session store)


Dependencies
------------

| Package                         | Description   |
| ------------------------------- |:-------------:|
| async                           | Utility library that provides asynchronous control flow. |
| bcrypt-nodejs                   | Library for hashing and salting user passwords. |
| connect-mongo                   | MongoDB session store for Express. |
| express                         | Node.js web framework. |
| body-parser                     | Express 4.0 middleware. |
| cookie-parser                   | Express 4.0 middleware. |
| express-session                 | Express 4.0 middleware. |
| morgan                          | Express 4.0 middleware. |
| compression                     | Express 4.0 middleware. |
| errorhandler                    | Express 4.0 middleware. |
| method-override                 | Express 4.0 middleware. |
| express-flash                   | Provides flash messages for Express. |
| express-validator               | Easy form validation for Express. |
| github-api                      | GitHub API library. |
| handlebars                      | Template engine for Express. |
| lusca                           | CSRF middleware.        |
| mongoose                        | MongoDB ODM. |
| nodemailer                      | Node.js library for sending emails. |
| passport                        | Simple and elegant authentication library for node.js |
| passport-github                 | Sign-in with GitHub plugin. |
| passport-google-oauth           | Sign-in with Google plugin. |
| passport-twitter                | Sign-in with Twitter plugin. |
| passport-local                  | Sign-in with Username and Password plugin. |
| passport-oauth                  | Allows you to set up your own OAuth 1.0a and OAuth 2.0 strategies. |
| lodash                          | Handy JavaScript utlities library. |
| uglify-js                       | Dependency for connect-assets library to minify JS. |
| validator                       | Used in conjunction with express-validator in **controllers/api.js**. |
| markdown                        | Converting Markdown to HTML |
| multer                          | For handling image uploads. |
| bookshelf                       | SQL ORM |
| knex                       | SQL Query builder (bookshelf dependency) |
| mysql                           | mysql node.js api (bookshelf dependency) |
| unidecode                       | for cleaning up slug variables |
| when                            | promises library |
| mocha                           | Test framework. |
| chai                            | BDD/TDD assertion library. |
| supertest                       | HTTP assertion library. |
| jshint                          | JavaScript linting |
| gulp                            | build tool |
| simple-prompt                   | commandline prompts |
| gulp-changed                    | gulp dependency |
| gulp-image-resize               | gulp dependency |
| gulp-imagemin                   | gulp dependency |


Getting started
---------------
Clone this repo to your local machine and install dependencies.

```
git clone https://github.com/qawemlilo/nodeza.git
cd nodeza && git checkout dev && npm install
```

Once all the dependencies are installed we need to setup our database and create tables.

```
npm run setup
```
You will be prompted for a your database information.

Features
--------

- Events
- Meetups
- Newsletters
- Blog
 - Tutorials
 - Reviews
 - News
 - Articles
- Member registration and login
- Company profiles (for companies using Node)
- Jobs



Architecture
------------
NodeZA is build on a MVC-like architecture. The main building blocks are `models`, `collections`, `views`, `controllers`, `widgets`, and `routes`.

      /
       collections/
       models/
       controllers/
       views/
       widgets/



The descriptions below are guidelines that have been used in the NodeZA project and should be followed as closely as possible.

### Routes
Routes are responsible for routing, they determine which `controller` and method to call for each route. The NodeZA project has only one routing file(`routes.js`) which is found in the root directory.


### Controllers
Controllers contain the logical parts that work as a glue between `views` and `models`. They accept a request and response object, load data from a `model` or `collection`, pass the data to a `view` template and then render the `view`.

Each path base should have its own `controller`, e.g, the route `/events` should have a `controller` named `events.js`.

All controller are located in the `controllers` directory.



### Model & Collections
A `model` is associated with a database table and its properties represent the table columns. The whole table is represented by the associated `collection` - which is basically a group of the same `model`. A `model` name should be a singular and a
`collection` name should be the plural version.

All `models` are located in the `models` folder and `collections` in the `collections` folder.


### Widgets
A `widget` is a special kind of module. It is self contained and is completely decoupled from other parts of the application.

A widget comprises of 3 files, `config.json`, `template.hbs`, and `index.js`

`config.json` contains the configuration.

`template.hbs` contains the handlebars template.

`index.js` is the main program file.



Testing
-------

```
npm test
```


To-Do
-----
1. Create application Admin
2. Create company profiles section
3. Create Jobs section
4. Remove tests against database and use stubs
5. UI - colour scheme, logo, images and typography
6. Optimise and resize uploaded images with gulp using a separate process
7. Create content
8. Add news letter functionality
9. Add rss feed
10. Add site map and other google SEO files
9. Port application to WidGet CMS


Contributing
------------

First open an issue on Github and then create a new branch on your local repo. The branch name should be the issue number prefixed with `fix-`. Commit your changes and push the branch.

### Style Guide
 - All indents should use 2 spaces, no tabs
 - wrap the body of `if` conditionals with curly braces
 - all variables should be defined with their own `var` keyword
 - all variable should be defined at the top of a scope
 - use comments
 - use camelCases
 - in controllers, each method name should start with the http method it is handling, e.g, postEvent or getEvent
 - use underscores to seperate words in filenames
 - Last but not least run `npm test` before commiting any changes



License
-------

(MIT License)

Copyright (c) 2014 Qawelesizwe Mlilo <qawemlilo@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.