/*
 * This setting include to copy code from Surfingkeys
 * Surfingkeys is MIT License
 * Surfingkeys create by brook hong
 * https://github.com/brookhong/Surfingkeys
 */

/* global
   Clipboard
   Front
   Hints
   Insert
   Normal
   RUNTIME
   event
   isEditable
   map
   mapkey
   searchSelectedWith
   settings
   tabOpenLink
   unmap
 */

Hints.characters = "htnsdcrbmwvz";
settings.hintAlign = "left";

// scroll

function scrollInSmooth(size, step) {
  function scroll(already) {
    window.scrollBy(0, step);
    if (Math.abs(already) < size) {
      window.setTimeout(() => scroll(already + step), 1);
    }
  }
  scroll(0);
}

mapkey("o", "Scroll down of half", () => {
  scrollInSmooth(window.innerHeight / 2, 16);
});

mapkey("u", "Scroll up of half", () => {
  scrollInSmooth(window.innerHeight / 2, -16);
});

map(",", "gg");
map(".", "G");

mapkey("t", "Scroll up of line", () => {
  scrollInSmooth(window.innerHeight / 10, -4);
});
mapkey("k", "Scroll up of line", () => {
  scrollInSmooth(window.innerHeight / 10, -4);
});
mapkey("j", "Scroll down of line", () => {
  scrollInSmooth(window.innerHeight / 10, 4);
});
mapkey("n", "Scroll down of line", () => {
  scrollInSmooth(window.innerHeight / 10, 4);
});

mapkey("v", "Scroll down of page", () => {
  scrollInSmooth(window.innerHeight * 0.9, 20);
});
mapkey("z", "Scroll up of page", () => {
  scrollInSmooth(window.innerHeight * 0.9, -20);
});

// tab

map("h", "E");
map("a", "E");
map("s", "R");
map("e", "R");

map("<Alt-o>", "X");
map("-", "X");
mapkey("w", "#3Close current tab", () => {
  RUNTIME("closeTab");
});
mapkey("q", "#3Close current tab", () => {
  RUNTIME("closeTab");
});

// link

map("g", "f");

mapkey("c", "#1Open a link in non-active new tab or click", () => {
  Hints.create(
    "",
    element => {
      Hints.flashPressedLink(element);
      if (isEditable(element)) {
        Hints.exit();
        Normal.passFocus(true);
        element.focus();
        Insert.enter(element);
      } else if (element.href) {
        RUNTIME("openLink", {
          tab: {
            tabbed: true,
            active: false
          },
          url: element.href
        });
      } else {
        element.click();
      }
    },
    {}
  );
});

mapkey("x", "#3Choose a tab", () => {
  Front.chooseTab();
});

// move

map("H", "S");
map("S", "D");

// open with external service

unmap("'");
mapkey("'", "google", () => {
  searchSelectedWith("https://www.google.com/search?q=", false, false, "");
});

unmap("<Ctrl-'>");
mapkey("<Ctrl-'>", "eowf", () => {
  searchSelectedWith("https://eowf.alc.co.jp/search?q=", false, false, "");
});

mapkey("<Alt-'>", "google translate", () => {
  tabOpenLink(
    `http://translate.google.com/translate?u=${window.location.href}`
  );
});

mapkey("<Ctrl-,>", "hatena bookmark", () => {
  const { location } = window;
  switch (location.protocol) {
    case "http:": {
      tabOpenLink(
        `http://b.hatena.ne.jp/entry/${location.href.replace("http://", "")}`
      );
      break;
    }
    case "https:": {
      tabOpenLink(
        `http://b.hatena.ne.jp/entry/s/${location.href.replace("https://", "")}`
      );
      break;
    }
    default: {
      throw new Error("はてなブックマークに対応していないページ");
    }
  }
});

// copy

mapkey("m", "Copy title and link to markdown without query", () => {
  Clipboard.write(
    `[${document.title}](${window.location.origin}${window.location.pathname})`
  );
});

mapkey("l", "Copy title and link to human readable without query", () => {
  Clipboard.write(
    `[${document.title}]: ${window.location.origin}${window.location.pathname}`
  );
});
