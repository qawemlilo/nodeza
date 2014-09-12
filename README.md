# NodeZA
> A Node.js information portal and social platform for developers in South Africa.

Node.js is an exciting new technology that is changing the programming landscape. Being a new technology, it has been very hard to find companies or developers who also use Node.js in South Africa.

NodeZA, pronounced as Node Z A, is a platform that aims to make it easy to find information about Node.js, learn, share, and connect with other Node users in South Africa.
The long term goal is to become an information repository for all things that are related to Node.js in South Africa.

The information below is aimed at developers who would like to contribute to this platform.

Brief description
-----------------
The NodeZA platform is an express application that uses handlebars for templating, MySQL as the main application database, Bookshelf.js ORM, and MongoDB for session storage. It has a custom plugin system responsible for displaying content snippets, the plugins are called `widgets`.  


Table of Contents
-----------------

- [Software Requirements](#software-requirements)
- [Dependencies](#dependencies)
- [Getting Started](#getting-started)
- [Features](#features)
- [Architecture](#architecture)
- [Testing](#testing)
- [To-Do](#to-do)
- [Contributing](#contributing)
- [License](#license)



Software Requirements
-------------------
 - Node.js(with npm) 10.x
 - MySQL (Application database)
 - MongoDB (session store)
 - GraphicsMagick or ImageMagick (for resizing and optimising images)


Dependencies
------------
Some of the major dependencies are `express`, `mysql`, `knex`, `bookshelf`, and `mongoose`. Please checkout [the dependencies page](https://github.com/qawemlilo/nodeza/blob/master/docs/dependencies.md) for a complete list.

Getting started
---------------
Clone this repo to your local machine and install dependencies.

```
git clone https://github.com/qawemlilo/nodeza.git
cd nodeza && npm install
```

Once all the dependencies are installed we need to setup our database and create tables.

```
npm run setup
```
You will be prompted for your database information.

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
NodeZA is built on a MVC-like architecture. The main building blocks are `models`, `collections`, `views`, `controllers`, `widgets`, and `routes`.

      /
       collections/
       models/
       controllers/
       views/
       widgets/
       routes.js



The descriptions below are guidelines that have been used in the NodeZA project and should be followed as closely as possible.

### Routes
Routes are the entry point to the application, they are responsible for routing and determine which `controller` and method to call for each http request. 

All routes are located in the `routes` directory


### Controllers
Controllers contain the logical parts that work as a glue between `views` and `models`. They accept a request and response object, load data from a `model` or `collection`, pass the data to a `view` template and then render the `view`.

Each path base should have its own `controller`, e.g, the route `/events` should have a `controller` named `events.js`.

All controllers are located in the `controllers` directory.



### Models & Collections
A `model` is associated with a database table and its properties represent the table columns. The whole table is represented by the associated `collection` - which is basically a group of the same `model`. A `model` name should be a singular and a
`collection` name should be the plural version.

All `models` are located in the `models` folder and `collections` in the `collections` folder.


### Widgets
A `widget` is a special kind of module. It is self contained and is completely decoupled from other parts of the application.

A widget comprises of 3 files, `config.json`, `template.hbs`, and `index.js`.

`config.json` contains the configuration.

`template.hbs` contains the handlebars template.

`index.js` is the main program file.

[Read more >>](https://github.com/qawemlilo/nodeza/blob/master/docs/widgets.md)



Testing
-------

```
npm test
```


To-Do
-----
1. Images - Logo, Banners: home, events, meetups, Node.js Cape Town, Node.Jozi, Nodebots Capetown, blog list default image
2. Mail server - configure mailgun and create project emails
3. Mail admin - create mail ui in admin area
5. Newsletter - design & layout, topics/categories, operation plan, mailchimp integration, and functionality
6. Feedback - uservoice integration
7. Comments - for posts, meetup groups, and events - disqus integration
8. Add trello hooks to github repo
9. Build admin interface for widgets
10. Create companies feature
11. Create Jobs feature
12. Write more tests and improve existing ones
13. Add build tools
14. Create site content
15. Add newsletter functionality
16. Add rss feed
17. Add Google related stuff - analytics, sitemap, robots.txt, e.t.c
18. Create social pages - twitter and google+


Contributing
------------
Create a new branch, make changes, commit and push branch 
(Please run `npm test` before committing your code).


License
-------

(MIT License)

Copyright (c) 2014 Qawelesizwe Mlilo <qawemlilo@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.