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
   isEditable
   iunmap
   map
   mapkey
   searchSelectedWith
   settings
   tabOpenLink
   unmap
 */

const hintsCharactersAll = "htnsdcrbmwvzaoeui;qjkx";
const hintsCharactersRight = "htnsdcrbmwvz";
const hintsCharactersLeft = "aoeui;qjkx";

Hints.characters = hintsCharactersAll;
Hints.charactersUpper = false;

settings.hintAlign = "left";
settings.omnibarMaxResults = 20;
settings.blacklistPattern = /tt-rss.ncaq.net/;
settings.tabsMRUOrder = false;
settings.historyMUOrder = false;

// scroll

/**
   scrollByの動作がFirefox 65で予測不可能になったのでscrollToで再実装する
   スムーズスクロールする
   @param {number} size - スクロールするサイズ
   @param {number} ward - 1か-1でスクロールする方向を制御
 */
function scrollBySmooth(size, ward) {
  window.scrollTo({
    top: window.scrollY + ward * size,
    left: 0,
    behavior: "smooth",
  });
}

/**
   絶対位置スクロール
   @param {number} position - スクロールする位置
 */
function scrollToSmooth(position) {
  window.scrollTo({
    top: position,
    left: 0,
    behavior: "smooth",
  });
}

unmap("o");
mapkey("o", "Scroll down of half", () => {
  scrollBySmooth(window.innerHeight / 2, 1);
});
unmap("u");
mapkey("u", "Scroll up of half", () => {
  scrollBySmooth(window.innerHeight / 2, -1);
});

unmap(",");
mapkey(",", "Scroll to beginning", () => {
  scrollToSmooth(0);
});
unmap(".");
mapkey(".", "Scroll to ending", () => {
  scrollToSmooth(document.body.scrollHeight);
});

unmap("t");
mapkey("t", "Scroll up of line", () => {
  scrollBySmooth(window.innerHeight / 10, -1);
});
unmap("n");
mapkey("n", "Scroll down of line", () => {
  scrollBySmooth(window.innerHeight / 10, 1);
});

unmap("k");
mapkey("k", "Scroll up of line", () => {
  scrollBySmooth(window.innerHeight / 10, -1);
});
unmap("j");
mapkey("j", "Scroll down of line", () => {
  scrollBySmooth(window.innerHeight / 10, 1);
});

unmap("v");
mapkey("v", "Scroll down of page", () => {
  scrollBySmooth(window.innerHeight * 0.9, 1);
});
unmap("z");
mapkey("z", "Scroll up of page", () => {
  scrollBySmooth(window.innerHeight * 0.9, -1);
});

// tab

map("h", "E");
map("a", "E");
map("s", "R");
map("e", "R");

map("-", "X");
unmap("w");
mapkey("w", "#3Close current tab", () => {
  RUNTIME("closeTab");
});
unmap("q");
mapkey("q", "#3Close current tab", () => {
  RUNTIME("closeTab");
});

// Tree Style Tabs

const tstId = "treestyletab@piro.sakura.ne.jp";

// 親のタブに移る
unmap("b");
mapkey("b", "focus parent tab", async () => {
  const { id } = await browser.runtime.sendMessage(tstId, {
    type: "get-tree",
    tab: "current",
  });
  const tabs = await browser.runtime.sendMessage(tstId, {
    type: "get-tree",
    tabs: "*",
  });
  const parentTab = tabs.find((tab) =>
    tab.children.find((child) => child.id === id)
  );
  if (parentTab) {
    browser.runtime.sendMessage(tstId, {
      type: "focus",
      tab: parentTab.id,
    });
  }
});

// タブを1段階上昇させる
unmap("d");
mapkey("d", "outdent parent tab", () => {
  browser.runtime.sendMessage(tstId, {
    type: "outdent",
    tab: "current",
  });
});

// link

unmap("m");
mapkey("m", "#1Open a link", () => {
  Hints.characters = hintsCharactersAll;
  Hints.create("", Hints.dispatchMouseClick);
});

unmap("c");
mapkey("c", "#1Open a link in non-active new tab or click", () => {
  Hints.characters = hintsCharactersAll;
  Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
});

unmap("g");
mapkey("g", "#1Open a link in non-active new tab or click by right key", () => {
  Hints.characters = hintsCharactersRight;
  Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
  Hints.characters = hintsCharactersAll;
});

unmap("p");
mapkey("p", "#1Open a link in non-active new tab or click by left key", () => {
  Hints.characters = hintsCharactersLeft;
  Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
  Hints.characters = hintsCharactersAll;
});

unmap("x");
mapkey("x", "#3Choose a tab", () => {
  Front.chooseTab();
});

// move

map("H", "S");
map("S", "D");

// open with external service

unmap("'");
mapkey("'", "Google", () => {
  searchSelectedWith("https://www.google.com/search?q=", false, false, "");
});

unmap("<Ctrl-'>");
mapkey("<Ctrl-'>", "DeepL", () => {
  const selection = window.getSelection().toString();
  if (selection !== "") {
    tabOpenLink(
      `https://www.deepl.com/translator#en/ja/${encodeURIComponent(selection)}`
    );
  }
});

mapkey("<Alt-'>", "Google 翻訳", () => {
  const selection = window.getSelection().toString();
  if (selection === "") {
    // 文字列選択してない場合はページ自体を翻訳にかける
    tabOpenLink(
      `https://translate.google.com/translate?hl=&sl=auto&tl=ja&u=${window.location.href}&sandbox=1`
    );
  } else {
    // 選択している場合はそれを翻訳する
    tabOpenLink(
      `https://translate.google.com/?sl=auto&tl=ja&text=${encodeURIComponent(
        selection
      )}`
    );
  }
});

mapkey("<Ctrl-Alt-'>", "英辞郎 on the WEB Pro Lite", () => {
  searchSelectedWith("https://eowf.alc.co.jp/search?q=", false, false, "");
});

mapkey("<Ctrl-;>", "はてなブックマーク", () => {
  const { location } = window;
  switch (location.protocol) {
    case "http:": {
      tabOpenLink(
        `https://b.hatena.ne.jp/entry/${location.href.replace("http://", "")}`
      );
      break;
    }
    case "https:": {
      tabOpenLink(
        `https://b.hatena.ne.jp/entry/s/${location.href.replace(
          "https://",
          ""
        )}`
      );
      break;
    }
    default: {
      throw new Error("はてなブックマークに対応していないページ");
    }
  }
});

// open the Twitter

mapkey("<Alt-;>", "通知 / Twitter", () => {
  tabOpenLink("https://twitter.com/notifications");
});

mapkey("<Ctrl-Alt-;>", "エゴサーチ / Twitter", () => {
  tabOpenLink(
    "https://twitter.com/search?q=%22ncaq%22%20OR%20%22%E3%82%A8%E3%83%8C%E3%83%A6%E3%83%AB%22%20OR%20%22%E3%81%88%E3%81%AC%E3%82%86%E3%82%8B%22%20OR%20twitter.com%2Fncaq%20-from%3Ancaq%20lang%3Aen%20OR%20lang%3Aja&f=live"
  );
});

// copy

unmap("f");
mapkey("f", "Copy title and link to markdown without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${document.title}](${url.href})`);
});

unmap("F");
mapkey("F", "Copy title and link to markdown", () => {
  Clipboard.write(`[${document.title}](${window.location.href})`);
});

unmap("l");
mapkey("l", "Copy title and link to human readable without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${document.title}]: ${url.href}`);
});

unmap("L");
mapkey("L", "Copy title and link to human readable", () => {
  Clipboard.write(`[${document.title}]: ${window.location.href}`);
});

// 絵文字
iunmap(":");

// zoom

mapkey("<Ctrl-=>", "#3zoom reset", () => {
  RUNTIME("setZoom", {
    zoomFactor: 0,
  });
});
