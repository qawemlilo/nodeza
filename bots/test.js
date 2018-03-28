"use strict";

const gh = require('ghreleases');
const auth = {
  token: '5c8b280818bb1f396f4b4e77d4b82a76bd805464',
  user: 'qawemlilo'
};


gh.list(auth, 'nodejs', 'node', (err, list) => {
  console.log(list[0].published_at +  ' - ' + list[0].tag_name + ' ' + list[0].url)
})
