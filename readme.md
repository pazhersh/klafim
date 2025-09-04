# pazhersh/klafim

Imagine this: you and your pals sit down to play a trivia game. You open your favorite game's box, take out the trivia cards deck, and draw one. But avoy! You've heard this question before! You take the next card and it's the same.

Who of us haven't been through this? I know I've been too many times.

This project lets you create and manage decks of cards from an uploaded Excel files (and other formats), and to open and play with said decks in a 3D sim, all within your browser.

## Running

The simplest way to run is with docker

```bash
docker run pazhersh/klafim:latest
```

Running from source is an entire line longer:

```bash
npm install
npm run serve
```

## Building

To build run the following commands:

```bash
npm install
npm run build
docker run build . -t pazhersh/klafim:latest
```

## What it's really about

Ever since a friend showed me Bruno Simon's [portfolio](https://bruno-simon.com/), I've been enchanted by THREE.js. I wanted to make a project in it for quite some time before this.

When my buddy got the game [Things in Rings](https://boardgamegeek.com/boardgame/408547/things-in-rings) and we've seen that each level of definition has only around 3~4 cards per deck, he mentioned that there are already community made Excels with new definitions.

That's when I thought "hey, how hard could it be?", I mean I'd only need as taking an Excel reading library, take the data from that and passing it to Three.js with custom models I'll make in blender.
Well if you'd try to look at the project's commit history you'd see it wasn't that simple.

### Things I learned

I had to learn quite a bit more than I expected for this project. This includes:

- Three.js - This one's actually been the simple part. I already was familiar with 3D rendering from fiddling with blender, and the concept are pretty much the same.
- Rapier - As it turns out Three.js does basically nothing except renderring 3D meshes and handling mouse events. Rapier is the physics library I used. And it's way more complicated the I expected.
- Math - I had to read quite a bit about math that was relevant for the usage with Rapier and a bit for Three.js. And nothing was intuitive. I still don't fully understand how Quaternions work under the hood.

And I learned an important lesson from it:

#### Start Big or Stay Small

For side projects such as this keeping the scale small is imporant. One must take all means necessary to avoid Feature Creep!
I did not avoid feature creep at all. This project was originally planned for a weekend or two. Looking at the commit history at the point of writting this I worked on it on 9 different weekends. and quite a few weekdays.

The main time sinker here was the migration to React via React Three Fiber (R3F). Before that most of my efforts went on integrating the Three.js with Rapier. R3F does this with for you with minimal configuration.
But migrating to it meant re-writing most of my existing code! And what for? The only "new feature" this enabled me was reusing the 3D renderer. And the only other useage of it is in the deck editor preview.

If I would have started with React it would have saved a whole lot of time.
On the other hand though, if I wouldn't have migrated to React in the middle it would also have saved me a whole lot of time!

For this project the second option would have been better - most of the learing I did was for the Three.js-Rapier integration - and that would have been completely hidden away from me with React-R3F.
