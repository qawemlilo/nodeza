# Controllers
Controllers contain the logical parts that work as a glue between `views` and `models`. They accept a request and response object, load data from a `model` or `collection`, pass the data to a `view` template and then render the `view`.

Each path base should have its own `controller`, e.g, the route `/events` should have a `controller` named `events.js`.

All controllers are located in the `controllers` directory.