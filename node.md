# Writing Node.js applications at NodeZA in 2018

 - Intro
 - Managing Node.js version
 - Keeping packages up-to-date
 - Deployment and keeping the app running
 - Our preferred JS features
   - Async / await
   - Promises
   - (Variables) const, let
   - Fat arrow functions for selected methods
   - Destructuring assignment
   - Data structures - we like the new array methods, don't like the object syntax, don't like Classes introduction, don't like module import.

- Our favourite major packages
  - knex, (Still using bookshelf but have fallen our of favour), express,passport,handlebars
- Application structure
- Testing
- Managing Configuration
- Logging
- Sending Emails / Image processing
- Extras - (bots)

At NodeZA we eat our own dog food. We are a community of Node.js developers and we have built our platform on 100% Node.js technologies. After 2 years of little to no development, we are now back in full swing. A lot has has happened , Node.js and JavaScript are a living organism that changes everyday, we are node in 2018 and this is how we are developing our node.js applications.

In this post we are going to break down into a sub-topics focusing on specific aspects of our development processes.

### Ain't your grandpa's JS
JavaScript bashing has been something of a populist hipster trend used to solicit hearts and thumps up. Just go through the comments of popular dev communities like hackernews and you will soon see what I mean. To a large extent the earlier versions of JavaScript had their quirks, especially on the browser. In 2018, JavaScript is cleaner, sexier, faster, and elegant.

Developing Node.js applications requires JavaScript, let us look at how JS is helping us to build good Node.js apps.

### ES17
ES17 JS version that is supported is currently stable LTS Node.js version.

###### Promises

```
function getPost(id) {
  let post = new Promise(function (resolve, reject) {
    DB.where({id: id}).fetch(function (error, res) {
      if (error) {
        reject(error);
      }
      else {
        resolve(res);
      }
    });
  });
}
```

###### Async / Await
```
async function showPost() {
  let post = await getPost();

  return post;
}
```

###### Destructuring assignment
```
let {title, body, create_at} = showPost();
```

###### Variables
```
const modelue = {}  // cannot be reassigned

let variable = {}  // exists within scope, respects braces scope
```

###### Fat arrow => functions
```
// solves the this reference headache
```

### Managing Node.js version
One of the most tedious tasks in maintaining Node.js application is keeping them up-to-date, not only through package updates but also Node.js versions.

Node.js updates always aim to be backward compatible, so upgrading is to the latest stable LTS version is quite a smooth process.

At NodeZA we `n` to manage Node.js versions. Our strategy is to always have the latest LTS version running.

###
