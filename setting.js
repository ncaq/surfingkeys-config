/*
 * This setting include to copy code from Surfingkeys
 * Surfingkeys is MIT License
 * Surfingkeys create by brook hong
 * https://github.com/brookhong/Surfingkeys
 */

/*
   global
   api
   settings
 */

const {
  Clipboard,
  Front,
  Hints,
  RUNTIME,
  iunmap,
  map,
  mapkey,
  tabOpenLink,
  unmap,
} = api;

const hintsCharactersRight = "htnsdcrbmwvz";
const hintsCharactersLeft = "aoeui;qjkx";
const hintsCharactersAll = hintsCharactersRight + hintsCharactersLeft;

Hints.charactersUpper = false;
Hints.style("font-size: 16px !important;");
settings.hintAlign = "left";

settings.blocklistPattern = /tt-rss.ncaq.net/;

settings.historyMUOrder = false;
settings.tabsMRUOrder = false;
settings.omnibarMaxResults = 20;
settings.tabsThreshold = 0; // 常にomnibarを使う。

// scroll

/**
 * scrollByの動作がFirefox 65で予測不可能になったのでscrollToで再実装する
 * スムーズスクロールする
 * @param {number} size - スクロールするサイズ
 * @param {number} ward - 1か-1でスクロールする方向を制御
 */
function scrollBySmooth(size, ward) {
  window.scrollTo({
    top: window.scrollY + ward * size,
    left: 0,
    behavior: "smooth",
  });
}

/**
 * 絶対位置スクロール
 * @param {number} position - スクロールする位置
 */
function scrollToSmooth(position) {
  window.scrollTo({
    top: position,
    left: 0,
    behavior: "smooth",
  });
}

mapkey("o", "#2Scroll down of half", () => {
  scrollBySmooth(window.innerHeight / 2, 1);
});
mapkey("u", "#2Scroll up of half", () => {
  scrollBySmooth(window.innerHeight / 2, -1);
});

mapkey(",", "#2Scroll to beginning", () => {
  scrollToSmooth(0);
});
mapkey(".", "#2Scroll to ending", () => {
  scrollToSmooth(document.body.scrollHeight);
});

mapkey("t", "#2Scroll up of line", () => {
  scrollBySmooth(window.innerHeight / 10, -1);
});
mapkey("n", "#2Scroll down of line", () => {
  scrollBySmooth(window.innerHeight / 10, 1);
});

mapkey("k", "#2Scroll up of line", () => {
  scrollBySmooth(window.innerHeight / 10, -1);
});
mapkey("j", "#2Scroll down of line", () => {
  scrollBySmooth(window.innerHeight / 10, 1);
});

mapkey("v", "#2Scroll down of page", () => {
  scrollBySmooth(window.innerHeight * 0.9, 1);
});
mapkey("z", "#2Scroll up of page", () => {
  scrollBySmooth(window.innerHeight * 0.9, -1);
});

// tab

// フォーカスしているタブを移動。
map("h", "E");
map("a", "E");
map("s", "R");
map("e", "R");

// 閉じたタブを復帰させる。
map("-", "X");
// タブを閉じる。
mapkey("w", "#3Close current tab", () => {
  RUNTIME("closeTab");
});
mapkey("q", "#3Close current tab", () => {
  RUNTIME("closeTab");
});

// 最近閉じたタブや履歴を閲覧。
mapkey("<Alt-,>", "#8Open RecentlyClosed", () => {
  Front.openOmnibar({ type: "RecentlyClosed" });
});
mapkey("<Ctrl-Alt-,>", "#8Open History", () => {
  Front.openOmnibar({ type: "History" });
});

// Tree Style Tabs

const tstId = "treestyletab@piro.sakura.ne.jp";

// 親のタブに移る
mapkey("b", "#3Focus parent tab", async () => {
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
mapkey("d", "#3Outdent parent tab", () => {
  browser.runtime.sendMessage(tstId, {
    type: "outdent",
    tab: "current",
  });
});

// link

// iと同じだし、C-iはページの情報を取得するのに使いたいので除外します。
unmap("<Ctrl-i>");

// キーボードでリンクを移動。
mapkey("x", "#1Open a link", () => {
  Hints.setCharacters(hintsCharactersAll);
  Hints.create("", Hints.dispatchMouseClick);
});

mapkey("c", "#1Open a link in non-active new tab or click", () => {
  Hints.setCharacters(hintsCharactersAll);
  Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
});

mapkey("m", "#1Open a link by right key", () => {
  Hints.setCharacters(hintsCharactersRight);
  Hints.create("", Hints.dispatchMouseClick);
  Hints.setCharacters(hintsCharactersAll);
});

mapkey("g", "#1Open a link in non-active new tab or click by right key", () => {
  Hints.setCharacters(hintsCharactersRight);
  Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
  Hints.setCharacters(hintsCharactersAll);
});

mapkey(";", "#1Open a link by left key", () => {
  Hints.setCharacters(hintsCharactersLeft);
  Hints.create("", Hints.dispatchMouseClick);
  Hints.setCharacters(hintsCharactersAll);
});

mapkey("p", "#1Open a link in non-active new tab or click by left key", () => {
  Hints.setCharacters(hintsCharactersLeft);
  Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
  Hints.setCharacters(hintsCharactersAll);
});

// 戻る進む。

// 戻る。
map("H", "S");
map("A", "S");
// 進む。
map("S", "D");
map("E", "D");

// open with external service

mapkey("'", "Google", () => {
  const selection = window.getSelection().toString();
  if (selection !== "") {
    tabOpenLink(
      `https://www.google.com/search?client=firefox-b-d&q=${encodeURIComponent(
        selection
      )}`
    );
  }
});

mapkey("<Ctrl-'>", "DeepL", () => {
  const selection = window.getSelection().toString();
  if (selection !== "") {
    tabOpenLink(
      `https://www.deepl.com/translator#en/ja/${encodeURIComponent(
        selection
      ).replaceAll("%2F", "\\%2F")}` // DeepLはスラッシュを特別扱いするためエスケープします。
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
  const selection = window.getSelection().toString();
  if (selection !== "") {
    tabOpenLink(
      `https://eowf.alc.co.jp/search?q=${encodeURIComponent(selection)}`
    );
  }
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
    "https://twitter.com/search?q=%22ncaq%22%20OR%20%22%E3%82%A8%E3%83%8C%E3%83%A6%E3%83%AB%22%20OR%20%22%E3%81%88%E3%81%AC%E3%82%86%E3%82%8B%22%20OR%20twitter.com%2Fncaq%20-from%3Ancaq%20OR%20%40ncaq_do_not_exist&f=live"
  );
});

// copy

mapkey("f", "#7Copy title and link to markdown without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${document.title}](${url.href})`);
});

mapkey("F", "#7Copy title and link to markdown", () => {
  Clipboard.write(`[${document.title}](${window.location.href})`);
});

mapkey("l", "#7Copy title and link to human readable without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${document.title}]: ${url.href}`);
});

mapkey("L", "#7Copy title and link to human readable", () => {
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

// blacklistのキーはxkeysnailやKeyhacによって無効化されているけど誤爆しやすいので無効化
unmap("<Alt-s>");
