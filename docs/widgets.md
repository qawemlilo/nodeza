# Widgets
A `widget` is a special kind of module. It is self contained and is completely decoupled from other parts of the application.

A widget comprises of 3 files, `config.json`, `index.js`, and `template.hbs`.

`config.json` contains the configuration.

`index.js` is the main program file.

`template.hbs` contains the handlebars template.

config.json
-----------
Config.json contains basic configuration and metadata for the widget. You can turn the object on and off through the `active` property. 
The `pages` property is an array of paths telling the widget which pages it should be displayed on.

    {
      "name": "name-of-widget",
      "title": "ui-title",
      "version": "0.0.1",
      "pages": [
        "/view", 
        "/view/:any",
        "/view/subview/:any"
      ],
      "description": "widget description",
      "author": "Name of author",
      "authorEmail": "author email",
      "position": "ui-position",
      "order": Number,
      "active": Boolean,
      "repo": "repo-url"
    }


index.js
--------
This is the main program file. It loads the config file data, adds a methed named `exec` and then exports it. The `exec` method accepts the main Application object and returns a promise that resolves with the config and collection data as a single object. Use the Application `getCollection` method to retrieve any particular collection found in the `collections` directory.


    var config = require('./config.json');
    
    /*
     * fetches a collection of data
     * 
     * @param: {Object}App - main application object
     * @return: {Promise} - a promise that resolves with an object 
    **/
    config.exec = function (App) {
    
      var categories = App.getCollection('Categories');
    
      return categories.fetch({columns: ['slug', 'name']})
      .then(function (collection) {
        config.collection = collection;
        
        return config;
      });
    };

    module.exports = config;


template.hbs
------------
The application view uses handlebars and twitter bootstrap. The widget template has access to the collection fetched by the `exec` method.

    <div class="panel panel-default">
      <div class="panel-heading">
        Categories
      </div>
      <div class="panel-body">
        <ul class="list-unstyled">
          {{#if collection}}
            {{#each collection}}
              <li>
                <a href="/blog/category/{{slug}}">
                  {{name}}
                </a>
              </li>
            {{/each}}
          {{/if}}
        </ul>
      </div>
    </div>