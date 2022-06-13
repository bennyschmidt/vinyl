# Vinyl
A record store. Originals only!

#### What is Vinyl?

Vinyl is a simple Object Graph Mapper (OGM) designed for interfacing with static, immutable application objects. 


#### What does that mean?

Lets use a video game as an example use case: It doesn't make sense to save all the static game objects in a database along with users and other dynamic data. If it never changes throughout the lifecycle of the app, database work to retrieve it is unnecessary, and the database would grow unnecessarily large. Additionally, if many different users reference the same objects (say, 400 players in the game all have the "Sword of Destiny") you wouldn't want 400 copies of the "Sword of Destiny" saved in each user record, yet conventional NoSQL and most ORM caches work this way! So you end up with a lot of duplicated data. With Vinyl, there is only ever 1 "Sword of Destiny", and instead, the 400 players save a reference to it. Every key on every object is relational, so even assembling the "Sword of Destiny" record is a matter of composing other unique records.

#### Non-relational data

`id`, `name`, `description`, and `attributes` are reserved for non-relational data like a name, email address, etc. Any other property is treated as a reference.

#### Doesn't this already exist?

If you've used Ruby, it's kinda like ActiveRecord, except that the entire objects are not cached, only their relations, and the record is put together only when it's accessed. If you've used Neo4j, it's kinda like their OGM. The main difference between both of those technologies and Vinyl is that Vinyl is 100% database-agnostic, or you can run it without a database.

##### Card game example:

```
const { Record, RecordCollection } = require('vinyl-records');

new RecordCollection({
  rarities: [
    {
      id: 0,
      name: "Common"
    },
    {
      id: 1,
      name: "Rare"
    }
  ],
  types: [
    {
      id: 0,
      name: "Greater"
    },
    {
      id: 1,
      name: "Lesser"
    },
    {
      id: 2,
      name: "Mana"
    }
  ],
  cards: [
    {
      id: 0,
      name: "Boss",
      type: 0,
      rarity: 1
    },
    {
      id: 1,
      name: "Minion",
      type: 1,
      rarity: 0
    },
    {
      id: 2,
      name: "Field",
      type: 2,
      rarity: 0
    }
  ],
  currencies: [
    {
      id: 0,
      name: "Gold",
      rarity: 1
    },
    {
      id: 1,
      name: "Gems",
      rarity: 1
    }
  ]
});

```

All of the above data is kept in your application, and records are assembled only on an as-needed basis. A user of this card game might look like this in your NoSQL database:

```
{
  id: "12345",
  email: "test@example.com",
  cards: [0, 2],
  currencies: [0, 1],
  amounts: [246, 33]
}

```

That is a lot simpler than storing massive JSON trees with duplicate data everywhere! If you use an authentication provider like Auth0, and use Vinyl for app objects, you can very easily build something cool without needing a database at all.

#### Get started

`npm i vinyl-records` 
