"use strict";

exports.up = function(knex, Promise) {
  return knex('messages')
  .where('from_id', '=', 1)
  .update({
    body: `Hi there,

    It's been quite a while since I updated NodeZA but this year I would like to add new features which I hope will add value for the users and help us build the community.

    The first major one is this :) internal messaging. You can now talk directly to other developers on this platform using the messaging feature.

    Please let me know if you have any suggestions on how we can improve our site or if you encounter any bugs.

    All the best for 2018, let's keep in touch :)`,
    html: `<p>Hi there,</p>
    <p>It's been quite a while since I updated NodeZA but this year I would like to add new features which I hope will add value for the users and help us build the community.</p>
    <p>The first major one this is this :) internal messaging. You can now talk directly to other developers on this platform using the messaging feature.</p>
    <p>Please let me know if you have any suggestions on how we can improve our site or if you encounter any bugs.</p>
    <p>All the best for 2018, let's keep in touch :)</p>`
  });
};

exports.down = function(knex, Promise) {
  return knex('messages')
  .where('from_id', '=', 1)
  .update({
    body: `Hi there,

    It's been quite a while since I updated NodeZA but this year I would like to add new features which I hope will add value for the users and help us build the community.

    The first major one is this :) internal messaging. You can now talk directly to other developers on this platform using the messaging feature.

    Please let me know if you have any suggestions on how we can improve our site or if you encounter any bugs.

    All the best for 2018, let's keep in touch :)`,
    html: `<p>Hi there,</p>
    <p>It's been quite a while since I updated NodeZA but this year I would like to add new features which I hope will add value for the users and help us build the community.</p>
    <p>The first major one this is this :) internal messaging. You can now talk directly to other developers on this platform using the messaging feature.</p>
    <p>Please let me know if you have any suggestions on how we can improve our site or if you encounter any bugs.</p>
    <p>All the best for 2018, let's keep in touch :)</p>`
  });
};
