"use strict";

const App = require('widget-cms');
const TagsController = App.getController('Tags');


App.get('/blog/tags/:slug', TagsController.getPosts);
