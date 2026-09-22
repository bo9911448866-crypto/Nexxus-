export interface Game {
  id: string;
  title: string;
  path: string;
  aliases: string[];
  categories: string[];
  type: "html5" | "flash";
  thumbnail?: string;
  featured?: boolean;
}

export const GAMES: Game[] = [
  {
    "id": "10-minutes-till-dawn",
    "title": "10 minutes till dawn",
    "path": "10-minutes-till-dawn",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/10-minutes-till-dawn/background.png"
  },
  {
    "id": "1v1-lol",
    "title": "1v1.LOL",
    "path": "1v1-lol",
    "aliases": [],
    "categories": [
      "online",
      "battle",
      "action"
    ],
    "type": "html5",
    "featured": true,
    "thumbnail": "/games/1v1-lol/logo.png"
  },
  {
    "id": "2048",
    "title": "2048",
    "path": "2048",
    "aliases": [],
    "categories": [
      "puzzle"
    ],
    "type": "html5",
    "featured": true
  },
  {
    "id": "a-dark-room",
    "title": "A Dark Room",
    "path": "a-dark-room",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "abandoned",
    "title": "Abandoned",
    "path": "abandoned",
    "aliases": [],
    "categories": [
      "escape"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "abandoned-2",
    "title": "Abandoned 2",
    "path": "abandoned-2",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_achievement-unlocked",
    "title": "Achievement Unlocked",
    "path": "flash/?game=achievement-unlocked",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/achievement-unlocked.png",
    "featured": false
  },
  {
    "id": "flash__game_achievement-unlocked-2",
    "title": "Achievement Unlocked 2",
    "path": "flash/?game=achievement-unlocked-2",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/achievement-unlocked-2.png",
    "featured": false
  },
  {
    "id": "flash__game_achievement-unlocked-3",
    "title": "Achievement Unlocked 3",
    "path": "flash/?game=achievement-unlocked-3",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/achievement-unlocked-3.png",
    "featured": false
  },
  {
    "id": "flash__game_age-of-war",
    "title": "Age of War",
    "path": "flash/?game=age-of-war",
    "aliases": [],
    "categories": [
      "flash",
      "action"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/age-of-war.png",
    "featured": false
  },
  {
    "id": "flash__game_age-of-war-hacked",
    "title": "Age of War Hacked",
    "path": "flash/?game=age-of-war-hacked",
    "aliases": [],
    "categories": [
      "flash",
      "action"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/age-of-war-hacked.png",
    "featured": false
  },
  {
    "id": "ages-of-conflict",
    "title": "Ages of Conflict",
    "path": "ages-of-conflict",
    "aliases": [],
    "categories": [
      "escape"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "amidst-the-sky",
    "title": "Amidst The Sky",
    "path": "amidst-the-sky",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "another-gentlemans-adventure",
    "title": "Another Gentlemans Adventure",
    "path": "another-gentlemans-adventure",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/another-gentlemans-adventure/icon-256.png"
  },
  {
    "id": "awesome-tanks",
    "title": "Awesome Tanks",
    "path": "awesome-tanks",
    "aliases": [],
    "categories": [
      "action"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "awesome-tanks-2",
    "title": "Awesome Tanks 2",
    "path": "awesome-tanks-2",
    "aliases": [],
    "categories": [
      "action"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "babel-tower",
    "title": "Babel Tower",
    "path": "babel-tower",
    "aliases": [],
    "categories": [
      "strategy",
      "defense"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "basket-random",
    "title": "Basket Random",
    "path": "basket-random",
    "aliases": [],
    "categories": [
      "sports"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/basket-random/splash.jpeg"
  },
  {
    "id": "basketball-stars",
    "title": "Basketball Stars",
    "path": "basketball-stars",
    "aliases": [],
    "categories": [
      "sports"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "bit-life",
    "title": "Bit Life",
    "path": "bit-life",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": true,
    "thumbnail": "/games/bit-life/logo.png"
  },
  {
    "id": "flash__game_bloons",
    "title": "Bloons",
    "path": "flash/?game=bloons",
    "aliases": [],
    "categories": [
      "flash",
      "strategy",
      "defense"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/bloons.png",
    "featured": false
  },
  {
    "id": "flash__game_bloons-td-1",
    "title": "Bloons TD 1",
    "path": "flash/?game=bloons-td-1",
    "aliases": [],
    "categories": [
      "flash",
      "strategy",
      "defense"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/bloons-td-1.png",
    "featured": false
  },
  {
    "id": "flash__game_bloons-td-2",
    "title": "Bloons TD 2",
    "path": "flash/?game=bloons-td-2",
    "aliases": [],
    "categories": [
      "flash",
      "strategy",
      "defense"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/bloons-td-2.png",
    "featured": false
  },
  {
    "id": "flash__game_bloons-td-3",
    "title": "Bloons TD 3",
    "path": "flash/?game=bloons-td-3",
    "aliases": [],
    "categories": [
      "flash",
      "strategy",
      "defense"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/bloons-td-3.png",
    "featured": false
  },
  {
    "id": "flash__game_bloons-td-4",
    "title": "Bloons TD 4",
    "path": "flash/?game=bloons-td-4",
    "aliases": [],
    "categories": [
      "flash",
      "strategy",
      "defense"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/bloons-td-4.png",
    "featured": false
  },
  {
    "id": "flash__game_bloons-td-5",
    "title": "Bloons TD 5",
    "path": "flash/?game=bloons-td-5",
    "aliases": [],
    "categories": [
      "flash",
      "strategy",
      "defense"
    ],
    "type": "flash",
    "featured": true
  },
  {
    "id": "flash__game_bloxorz",
    "title": "Bloxorz",
    "path": "flash/?game=bloxorz",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/bloxorz.png",
    "featured": false
  },
  {
    "id": "boxing-random",
    "title": "Boxing Random",
    "path": "boxing-random",
    "aliases": [],
    "categories": [
      "sports"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/boxing-random/512x340.jpg"
  },
  {
    "id": "brawl-stars-project-laser",
    "title": "Brawl Stars Project Laser",
    "path": "brawl-stars-project-laser",
    "aliases": [],
    "categories": [
      "sports"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "breaklock",
    "title": "Breaklock",
    "path": "breaklock",
    "aliases": [],
    "categories": [
      "puzzle"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "w-flash__game_cat-ninja",
    "title": "Cat Ninja",
    "path": "w-flash/?game=cat-ninja",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "chrome-dino",
    "title": "Chrome Dino",
    "path": "chrome-dino",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/chrome-dino/dino.png"
  },
  {
    "id": "clicker-heroes",
    "title": "Clicker Heroes",
    "path": "clicker-heroes",
    "aliases": [],
    "categories": [
      "idle"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/clicker-heroes/clicker-heroes.png"
  },
  {
    "id": "clicker-heroes-updated",
    "title": "Clicker Heroes Updated",
    "path": "clicker-heroes-updated",
    "aliases": [],
    "categories": [
      "idle"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "conways-game-of-life",
    "title": "Conway's Game of Life",
    "path": "conways-game-of-life",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "cookie-clicker",
    "title": "Cookie Clicker",
    "path": "cookie-clicker",
    "aliases": [],
    "categories": [
      "idle"
    ],
    "type": "html5",
    "featured": true
  },
  {
    "id": "core-ball",
    "title": "Core Ball",
    "path": "core-ball",
    "aliases": [],
    "categories": [
      "puzzle"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/core-ball/pr_source.png"
  },
  {
    "id": "flash__game_creative-kill-chamber",
    "title": "Creative Kill Chamber",
    "path": "flash/?game=creative-kill-chamber",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/creative-kill-chamber.png",
    "featured": false
  },
  {
    "id": "crossy-road",
    "title": "Crossy Road",
    "path": "crossy-road",
    "aliases": [],
    "categories": [
      "arcade",
      "runner"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/crossy-road/crossyroad.png"
  },
  {
    "id": "flash__game_curveball",
    "title": "Curveball",
    "path": "flash/?game=curveball",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/curveball.png",
    "featured": false
  },
  {
    "id": "cut-the-rope",
    "title": "Cut The Rope",
    "path": "cut-the-rope",
    "aliases": [],
    "categories": [
      "puzzle"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "dadish",
    "title": "Dadish",
    "path": "dadish",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "dadish-2",
    "title": "Dadish 2",
    "path": "dadish-2",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "dadish-3",
    "title": "Dadish 3",
    "path": "dadish-3",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "doge-miner",
    "title": "Doge Miner",
    "path": "doge-miner",
    "aliases": [],
    "categories": [
      "idle"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_dont-escape",
    "title": "Don't Escape",
    "path": "flash/?game=dont-escape",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/dont-escape.png",
    "featured": false
  },
  {
    "id": "flash__game_dont-escape-2",
    "title": "Don't Escape 2",
    "path": "flash/?game=dont-escape-2",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/dont-escape-2.png",
    "featured": false
  },
  {
    "id": "flash__game_dont-escape-3",
    "title": "Don't Escape 3",
    "path": "flash/?game=dont-escape-3",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/dont-escape-3.png",
    "featured": false
  },
  {
    "id": "doodle-jump",
    "title": "Doodle Jump",
    "path": "doodle-jump",
    "aliases": [],
    "categories": [
      "arcade",
      "runner"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/doodle-jump/background.png"
  },
  {
    "id": "drift-boss",
    "title": "Drift Boss",
    "path": "drift-boss",
    "aliases": [],
    "categories": [
      "driving"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/drift-boss/drift-boss.png"
  },
  {
    "id": "drift-hunters",
    "title": "Drift Hunters",
    "path": "drift-hunters",
    "aliases": [],
    "categories": [
      "driving"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "drive-mad",
    "title": "Drive Mad",
    "path": "drive-mad",
    "aliases": [],
    "categories": [
      "driving"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_duck-life",
    "title": "Duck Life",
    "path": "flash/?game=duck-life",
    "aliases": [],
    "categories": [
      "flash",
      "upgrade",
      "arcade"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/duck-life.png",
    "featured": false
  },
  {
    "id": "flash__game_duck-life-2",
    "title": "Duck Life 2",
    "path": "flash/?game=duck-life-2",
    "aliases": [],
    "categories": [
      "flash",
      "upgrade",
      "arcade"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/duck-life-2.png",
    "featured": false
  },
  {
    "id": "flash__game_duck-life-3",
    "title": "Duck Life 3",
    "path": "flash/?game=duck-life-3",
    "aliases": [],
    "categories": [
      "flash",
      "upgrade",
      "arcade"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/duck-life-3.png",
    "featured": false
  },
  {
    "id": "duck-life-4",
    "title": "Duck Life 4",
    "path": "duck-life-4",
    "aliases": [],
    "categories": [
      "upgrade",
      "arcade"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/duck-life-4/duck-life-4.jpg"
  },
  {
    "id": "flash__game_duck-life-treasure-hunt",
    "title": "Duck Life Treasure Hunt",
    "path": "flash/?game=duck-life-treasure-hunt",
    "aliases": [],
    "categories": [
      "flash",
      "upgrade",
      "arcade"
    ],
    "type": "flash",
    "featured": false
  },
  {
    "id": "dune",
    "title": "Dune!",
    "path": "dune",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/dune/logo.jpg"
  },
  {
    "id": "eaglercraft",
    "title": "Eaglercraft 1.5.2",
    "path": "eaglercraft",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/eaglercraft/minecraft.png"
  },
  {
    "id": "eaglercraftx_",
    "title": "Eaglercraft 1.8.8 (Multiplayer Only)",
    "path": "eaglercraftx/",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": true,
    "thumbnail": "/games/eaglercraftx/splash.png"
  },
  {
    "id": "flash__game_escape-the-bathroom",
    "title": "Escape The Bathroom",
    "path": "flash/?game=escape-the-bathroom",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/escape-the-bathroom.png",
    "featured": false
  },
  {
    "id": "flash__game_escape-the-car",
    "title": "Escape The Car",
    "path": "flash/?game=escape-the-car",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/escape-the-car.png",
    "featured": false
  },
  {
    "id": "flash__game_escape-the-closet",
    "title": "Escape The Closet",
    "path": "flash/?game=escape-the-closet",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/escape-the-closet.png",
    "featured": false
  },
  {
    "id": "flash__game_escape-the-freezer",
    "title": "Escape The Freezer",
    "path": "flash/?game=escape-the-freezer",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/escape-the-freezer.png",
    "featured": false
  },
  {
    "id": "flash__game_escape-the-phonebooth",
    "title": "Escape The Phonebooth",
    "path": "flash/?game=escape-the-phonebooth",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/escape-the-phonebooth.png",
    "featured": false
  },
  {
    "id": "flash__game_escape-the-shack",
    "title": "Escape The Shack",
    "path": "flash/?game=escape-the-shack",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/escape-the-shack.png",
    "featured": false
  },
  {
    "id": "evowars",
    "title": "EvoWars",
    "path": "evowars",
    "aliases": [],
    "categories": [
      "action"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/evowars/buttonplay.png"
  },
  {
    "id": "flash__game_factory-balls",
    "title": "Factory Balls",
    "path": "flash/?game=factory-balls",
    "aliases": [],
    "categories": [
      "flash",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/factory-balls.png",
    "featured": false
  },
  {
    "id": "fireboy-and-watergirl-4",
    "title": "Fireboy and Watergirl in the Crystal Temple",
    "path": "fireboy-and-watergirl-4",
    "aliases": [
      "Fireboy and Watergirl 4"
    ],
    "categories": [
      "puzzle",
      "co-op"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/fireboy-and-watergirl-4/icon-60x60.png"
  },
  {
    "id": "fireboy-and-watergirl",
    "title": "Fireboy and Watergirl in the Forest Temple",
    "path": "fireboy-and-watergirl",
    "aliases": [
      "Fireboy and Watergirl",
      "Fireboy and Watergirl 1"
    ],
    "categories": [
      "puzzle",
      "co-op"
    ],
    "type": "html5",
    "featured": true,
    "thumbnail": "/games/fireboy-and-watergirl/icon-60x60.png"
  },
  {
    "id": "fireboy-and-watergirl-3",
    "title": "Fireboy and Watergirl in the Ice Temple",
    "path": "fireboy-and-watergirl-3",
    "aliases": [
      "Fireboy and Watergirl 3"
    ],
    "categories": [
      "puzzle",
      "co-op"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/fireboy-and-watergirl-3/icon-60x60.png"
  },
  {
    "id": "fireboy-and-watergirl-2",
    "title": "Fireboy and Watergirl in the Light Temple",
    "path": "fireboy-and-watergirl-2",
    "aliases": [
      "Fireboy and Watergirl 2"
    ],
    "categories": [
      "puzzle",
      "co-op"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/fireboy-and-watergirl-2/icon-60x60.png"
  },
  {
    "id": "flappy-bird",
    "title": "Flappy Bird",
    "path": "flappy-bird",
    "aliases": [],
    "categories": [
      "arcade",
      "runner"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_flash-chess",
    "title": "Flash Chess",
    "path": "flash/?game=flash-chess",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/flash-chess.png",
    "featured": false
  },
  {
    "id": "friday-night-funkin",
    "title": "Friday Night Funkin",
    "path": "friday-night-funkin",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "geometry-dash-lite",
    "title": "Geometry Dash Lite",
    "path": "geometry-dash-lite",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": true,
    "thumbnail": "/games/geometry-dash-lite/logo.png"
  },
  {
    "id": "getaway-shootout",
    "title": "Getaway Shootout",
    "path": "getaway-shootout",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "gons-io",
    "title": "Gons io",
    "path": "gons-io",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_gun-mayhem",
    "title": "Gun Mayhem",
    "path": "flash/?game=gun-mayhem",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/gun-mayhem.png",
    "featured": false
  },
  {
    "id": "flash__game_gun-mayhem-2",
    "title": "Gun Mayhem 2",
    "path": "flash/?game=gun-mayhem-2",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/gun-mayhem-2.png",
    "featured": false
  },
  {
    "id": "gunspin",
    "title": "Gun Spin",
    "path": "gunspin",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_breaking-the-bank",
    "title": "Henry Stickmin 0: Breaking The Bank",
    "path": "flash/?game=breaking-the-bank",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/breaking-the-bank.png",
    "featured": false
  },
  {
    "id": "flash__game_escaping-the-prison",
    "title": "Henry Stickmin 1: Escaping The Prison",
    "path": "flash/?game=escaping-the-prison",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/escaping-the-prison.png",
    "featured": true
  },
  {
    "id": "flash__game_stealing-the-diamond",
    "title": "Henry Stickmin 2: Stealing The Diamond",
    "path": "flash/?game=stealing-the-diamond",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/stealing-the-diamond.png",
    "featured": false
  },
  {
    "id": "flash__game_infiltrating-the-airship",
    "title": "Henry Stickmin 3: Infiltrating The Airship",
    "path": "flash/?game=infiltrating-the-airship",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/infiltrating-the-airship.png",
    "featured": false
  },
  {
    "id": "flash__game_fleeing-the-complex",
    "title": "Henry Stickmin 4: Fleeing the Complex",
    "path": "flash/?game=fleeing-the-complex",
    "aliases": [],
    "categories": [
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/fleeing-the-complex.png",
    "featured": false
  },
  {
    "id": "hextris",
    "title": "Hextris",
    "path": "hextris",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "idle-breakout",
    "title": "Idle Breakout",
    "path": "idle-breakout",
    "aliases": [],
    "categories": [
      "idle"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "incremancer",
    "title": "Incremancer",
    "path": "incremancer",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_learn-to-fly",
    "title": "Learn To Fly",
    "path": "flash/?game=learn-to-fly",
    "aliases": [],
    "categories": [
      "flash",
      "upgrade",
      "arcade"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/learn-to-fly.png",
    "featured": false
  },
  {
    "id": "flash__game_learn-to-fly-2",
    "title": "Learn To Fly 2",
    "path": "flash/?game=learn-to-fly-2",
    "aliases": [],
    "categories": [
      "flash",
      "upgrade",
      "arcade"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/learn-to-fly-2.png",
    "featured": true
  },
  {
    "id": "flash__game_learn-to-fly-3",
    "title": "Learn To Fly 3",
    "path": "flash/?game=learn-to-fly-3",
    "aliases": [],
    "categories": [
      "flash",
      "upgrade",
      "arcade"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/learn-to-fly-3.png",
    "featured": false
  },
  {
    "id": "flash__game_learn-to-fly-idle",
    "title": "Learn To Fly Idle",
    "path": "flash/?game=learn-to-fly-idle",
    "aliases": [],
    "categories": [
      "flash",
      "upgrade",
      "arcade"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/learn-to-fly-idle.png",
    "featured": false
  },
  {
    "id": "maptroid",
    "title": "Maptroid",
    "path": "maptroid",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "mario-game",
    "title": "Mario",
    "path": "mario-game",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "monkey-mart",
    "title": "Monkey Mart",
    "path": "monkey-mart",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": true,
    "thumbnail": "/games/monkey-mart/load_bar_bg.png"
  },
  {
    "id": "motox3m",
    "title": "MotoX3M",
    "path": "motox3m",
    "aliases": [],
    "categories": [
      "driving"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/motox3m/RedHeadTeaser.jpeg"
  },
  {
    "id": "n-step-steve-part-1",
    "title": "N Step Steve Part 1",
    "path": "n-step-steve-part-1",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "n-step-steve-part-2",
    "title": "N Step Steve Part 2",
    "path": "n-step-steve-part-2",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "n-gon",
    "title": "N-gon",
    "path": "n-gon",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "ovo_1_4_4",
    "title": "OvO",
    "path": "ovo/1.4.4",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": true
  },
  {
    "id": "ovo_2_0_2alpha",
    "title": "OvO 2",
    "path": "ovo/2.0.2alpha",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "pcraft",
    "title": "P.craft",
    "path": "pcraft",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "w-flash__game_papas-freezeria",
    "title": "Papas Freezeria",
    "path": "w-flash/?game=papas-freezeria",
    "aliases": [],
    "categories": [
      "simulation",
      "casual"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_papas-pizzaria",
    "title": "Papas Pizzeria",
    "path": "flash/?game=papas-pizzaria",
    "aliases": [],
    "categories": [
      "flash",
      "simulation",
      "casual"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/papas-pizzaria.png",
    "featured": false
  },
  {
    "id": "particle-clicker",
    "title": "Particle Clicker",
    "path": "particle-clicker",
    "aliases": [],
    "categories": [
      "idle"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "planet-life",
    "title": "Planet Life",
    "path": "planet-life",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "precision-client_",
    "title": "Precision Client (Eaglercraft 1.5.2)",
    "path": "precision-client/",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/precision-client/bg.png"
  },
  {
    "id": "progress-knight-quest",
    "title": "Progress Knight Quest",
    "path": "progress-knight-quest",
    "aliases": [],
    "categories": [
      "idle"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "progress-knight-reborn",
    "title": "Progress Knight Reborn",
    "path": "progress-knight-reborn",
    "aliases": [],
    "categories": [
      "idle"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "pull-of-war",
    "title": "Pull Of War",
    "path": "pull-of-war",
    "aliases": [],
    "categories": [
      "action"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_raft-wars",
    "title": "Raft Wars",
    "path": "flash/?game=raft-wars",
    "aliases": [],
    "categories": [
      "flash",
      "action"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/raft-wars.png",
    "featured": false
  },
  {
    "id": "flash__game_raft-wars-2",
    "title": "Raft Wars 2",
    "path": "flash/?game=raft-wars-2",
    "aliases": [],
    "categories": [
      "flash",
      "action"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/raft-wars-2.png",
    "featured": false
  },
  {
    "id": "reach-the-core",
    "title": "Reach The Core",
    "path": "reach-the-core",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "restless-wing-syndrome",
    "title": "Restless Wing Syndrome",
    "path": "restless-wing-syndrome",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "retro-bowl",
    "title": "Retro Bowl",
    "path": "retro-bowl",
    "aliases": [],
    "categories": [
      "sports"
    ],
    "type": "html5",
    "featured": true,
    "thumbnail": "/games/retro-bowl/retro-bowl.png"
  },
  {
    "id": "retro-bowl-old",
    "title": "Retro Bowl Old",
    "path": "retro-bowl-old",
    "aliases": [],
    "categories": [
      "sports"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_riddle-school",
    "title": "Riddle School",
    "path": "flash/?game=riddle-school",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/riddle-school.png",
    "featured": false
  },
  {
    "id": "flash__game_riddle-school-2",
    "title": "Riddle School 2",
    "path": "flash/?game=riddle-school-2",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/riddle-school-2.png",
    "featured": false
  },
  {
    "id": "flash__game_riddle-school-3",
    "title": "Riddle School 3",
    "path": "flash/?game=riddle-school-3",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/riddle-school-3.png",
    "featured": false
  },
  {
    "id": "flash__game_riddle-school-4",
    "title": "Riddle School 4",
    "path": "flash/?game=riddle-school-4",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/riddle-school-4.png",
    "featured": false
  },
  {
    "id": "flash__game_riddle-school-5",
    "title": "Riddle School 5",
    "path": "flash/?game=riddle-school-5",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/riddle-school-5.png",
    "featured": false
  },
  {
    "id": "flash__game_riddle-transfer",
    "title": "Riddle Transfer",
    "path": "flash/?game=riddle-transfer",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/riddle-transfer.png",
    "featured": false
  },
  {
    "id": "flash__game_riddle-transfer-2",
    "title": "Riddle Transfer 2",
    "path": "flash/?game=riddle-transfer-2",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/riddle-transfer-2.png",
    "featured": false
  },
  {
    "id": "rift-shift",
    "title": "Rift Shift",
    "path": "rift-shift",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_rogue-soul",
    "title": "Rogue Soul",
    "path": "flash/?game=rogue-soul",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/rogue-soul.png",
    "featured": false
  },
  {
    "id": "flash__game_rogue-soul-2",
    "title": "Rogue Soul 2",
    "path": "flash/?game=rogue-soul-2",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/rogue-soul-2.png",
    "featured": false
  },
  {
    "id": "rooftop-snipers",
    "title": "Rooftop Snipers",
    "path": "rooftop-snipers",
    "aliases": [],
    "categories": [
      "action"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "rookie-bowman",
    "title": "Rookie Bowman",
    "path": "rookie-bowman",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "run-3",
    "title": "Run 3",
    "path": "run-3",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": true
  },
  {
    "id": "sandspiel",
    "title": "Sandspiel",
    "path": "sandspiel",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "scuba-bear",
    "title": "Scuba Bear",
    "path": "scuba-bear",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/scuba-bear/icon-256.png"
  },
  {
    "id": "slope",
    "title": "Slope",
    "path": "slope",
    "aliases": [],
    "categories": [
      "arcade",
      "runner"
    ],
    "type": "html5",
    "featured": true
  },
  {
    "id": "smart_ball",
    "title": "Smart Ball",
    "path": "smart-ball",
    "aliases": [
      "smartball",
      "ball"
    ],
    "categories": [
      "puzzle",
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "smash-karts",
    "title": "Smash Karts",
    "path": "smash-karts",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_stick-war",
    "title": "Stick War",
    "path": "flash/?game=stick-war",
    "aliases": [],
    "categories": [
      "flash",
      "action"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/stick-war.png",
    "featured": false
  },
  {
    "id": "stickman-hook",
    "title": "Stickman Hook",
    "path": "stickman-hook",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_submachine",
    "title": "Submachine",
    "path": "flash/?game=submachine",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-0",
    "title": "Submachine 0",
    "path": "flash/?game=submachine-0",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-0.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-10",
    "title": "Submachine 10",
    "path": "flash/?game=submachine-10",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-10.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-2",
    "title": "Submachine 2",
    "path": "flash/?game=submachine-2",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-2.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-3",
    "title": "Submachine 3",
    "path": "flash/?game=submachine-3",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-3.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-32-chambers",
    "title": "Submachine 32 Chambers",
    "path": "flash/?game=submachine-32-chambers",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-32-chambers.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-4",
    "title": "Submachine 4",
    "path": "flash/?game=submachine-4",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-4.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-5",
    "title": "Submachine 5",
    "path": "flash/?game=submachine-5",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-5.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-6",
    "title": "Submachine 6",
    "path": "flash/?game=submachine-6",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-6.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-7",
    "title": "Submachine 7",
    "path": "flash/?game=submachine-7",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-7.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-8",
    "title": "Submachine 8",
    "path": "flash/?game=submachine-8",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-8.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-9",
    "title": "Submachine 9",
    "path": "flash/?game=submachine-9",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-9.png",
    "featured": false
  },
  {
    "id": "flash__game_submachine-flf",
    "title": "Submachine FLF",
    "path": "flash/?game=submachine-flf",
    "aliases": [],
    "categories": [
      "escape",
      "flash",
      "adventure",
      "puzzle"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/submachine-flf.png",
    "featured": false
  },
  {
    "id": "subway-surfers",
    "title": "Subway Surfers",
    "path": "subway-surfers",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": true
  },
  {
    "id": "subway-surfers-ny",
    "title": "Subway Surfers New York",
    "path": "subway-surfers-ny",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/subway-surfers-ny/NewYorkIcon.png"
  },
  {
    "id": "w-flash__game_sugar-sugar",
    "title": "Sugar Sugar",
    "path": "w-flash/?game=sugar-sugar",
    "aliases": [],
    "categories": [
      "puzzle"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "tanuki-sunset",
    "title": "Tanuki Sunset",
    "path": "tanuki-sunset",
    "aliases": [],
    "categories": [
      "driving"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "temple-run-2",
    "title": "Temple Run 2",
    "path": "temple-run-2",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/temple-run-2/079dea52d8f43464bedd59bc35cc7999.jpg"
  },
  {
    "id": "the-final-earth",
    "title": "The Final Earth",
    "path": "the-final-earth",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_the-impossible-quiz",
    "title": "The Impossible Quiz",
    "path": "flash/?game=the-impossible-quiz",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/the-impossible-quiz.png",
    "featured": false
  },
  {
    "id": "the-treasure",
    "title": "The Treasure",
    "path": "the-treasure",
    "aliases": [],
    "categories": [
      "escape"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "there-is-no-game",
    "title": "There Is No Game",
    "path": "there-is-no-game",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_this-is-the-only-level",
    "title": "This Is The Only Level",
    "path": "flash/?game=this-is-the-only-level",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/this-is-the-only-level.png",
    "featured": false
  },
  {
    "id": "flash__game_this-is-the-only-level-2",
    "title": "This Is The Only Level 2",
    "path": "flash/?game=this-is-the-only-level-2",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/this-is-the-only-level-2.png",
    "featured": false
  },
  {
    "id": "time-shooter",
    "title": "Time Shooter",
    "path": "time-shooter",
    "aliases": [],
    "categories": [
      "action"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/time-shooter/logo.png"
  },
  {
    "id": "time-shooter-3",
    "title": "Time Shooter 3",
    "path": "time-shooter-3",
    "aliases": [],
    "categories": [
      "action"
    ],
    "type": "html5",
    "featured": true,
    "thumbnail": "/games/time-shooter-3/logo.png"
  },
  {
    "id": "tiny-fishing",
    "title": "Tiny Fishing",
    "path": "tiny-fishing",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/tiny-fishing/thumb.png"
  },
  {
    "id": "trace",
    "title": "Trace",
    "path": "trace",
    "aliases": [],
    "categories": [
      "escape"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "tunnel-rush",
    "title": "Tunnel Rush",
    "path": "tunnel-rush",
    "aliases": [],
    "categories": [
      "arcade",
      "runner"
    ],
    "type": "html5",
    "featured": true
  },
  {
    "id": "two-ball-3d",
    "title": "Two Ball 3d",
    "path": "two-ball-3d",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "flash__game_ultimate-chess",
    "title": "Ultimate Chess",
    "path": "flash/?game=ultimate-chess",
    "aliases": [],
    "categories": [
      "flash"
    ],
    "type": "flash",
    "thumbnail": "/games/flash/images/ultimate-chess.png",
    "featured": false
  },
  {
    "id": "vex-3",
    "title": "Vex 3",
    "path": "vex-3",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "vex-4",
    "title": "Vex 4",
    "path": "vex-4",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "vex-5",
    "title": "Vex 5",
    "path": "vex-5",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/vex-5/f120262ab72743039fbce88c1f370df8-512x512.jpeg"
  },
  {
    "id": "vex-6",
    "title": "Vex 6",
    "path": "vex-6",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false,
    "thumbnail": "/games/vex-6/vex-6.png"
  },
  {
    "id": "vex-7",
    "title": "Vex 7",
    "path": "vex-7",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "web-osu",
    "title": "Web OSU",
    "path": "web-osu",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "where_is_the_water",
    "title": "Where Is The Water",
    "path": "where-is-the-water",
    "aliases": [
      "where is my water",
      "water"
    ],
    "categories": [
      "puzzle",
      "physics"
    ],
    "type": "html5",
    "thumbnail": "/games/where-is-the-water/icon-256.png",
    "featured": false
  },
  {
    "id": "x-trench-run",
    "title": "X Trench Run",
    "path": "x-trench-run",
    "aliases": [],
    "categories": [
      "platformer"
    ],
    "type": "html5",
    "featured": false
  },
  {
    "id": "yohoho",
    "title": "Yohoho",
    "path": "yohoho",
    "aliases": [],
    "categories": [
      "arcade"
    ],
    "type": "html5",
    "featured": false
  }
];
