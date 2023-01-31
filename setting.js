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

/**
 * `map`する上で`unmap`も同時に行う。
 * @see {@link https://github.com/brookhong/Surfingkeys/blob/3999da774f409f3756b5f6109be8092eda8dd9b8/src/content_scripts/common/api.js#L136}
 * @param {string} new_keystroke
 * @param {string} old_keystroke
 * @param {regex} [domain=null]
 * @param {string} [new_annotation=null]
 *
 */
// eslint-disable-next-line camelcase
function mapAndUnmap(new_keystroke, old_keystroke, domain, new_annotation) {
  unmap(new_keystroke, domain);
  map(new_keystroke, old_keystroke, domain, new_annotation);
}

/**
 * `mapkey`する上で`unmap`も同時に行う。
 * 基本的に同時に行っている。
 * helpに古いキーバインドの内容が残らないことも期待している。
 * @see {@link https://github.com/brookhong/Surfingkeys/blob/3999da774f409f3756b5f6109be8092eda8dd9b8/src/content_scripts/common/api.js#L93}
 * @param {string} keys
 * @param {string} annotation
 * @param {function} jscode
 * @param {object} [options=null] `domain`
 */
function mapkeyAndUnmap(keys, annotation, jscode, options) {
  unmap(keys, options?.domain);
  mapkey(keys, annotation, jscode, options);
}

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

mapkeyAndUnmap("o", "#2Scroll down of half", () => {
  scrollBySmooth(window.innerHeight / 2, 1);
});
mapkeyAndUnmap("u", "#2Scroll up of half", () => {
  scrollBySmooth(window.innerHeight / 2, -1);
});

mapkeyAndUnmap(",", "#2Scroll to beginning", () => {
  scrollToSmooth(0);
});
mapkeyAndUnmap(".", "#2Scroll to ending", () => {
  scrollToSmooth(document.body.scrollHeight);
});

mapkeyAndUnmap("t", "#2Scroll up of line", () => {
  scrollBySmooth(window.innerHeight / 10, -1);
});
mapkeyAndUnmap("n", "#2Scroll down of line", () => {
  scrollBySmooth(window.innerHeight / 10, 1);
});

mapkeyAndUnmap("k", "#2Scroll up of line", () => {
  scrollBySmooth(window.innerHeight / 10, -1);
});
mapkeyAndUnmap("j", "#2Scroll down of line", () => {
  scrollBySmooth(window.innerHeight / 10, 1);
});

mapkeyAndUnmap("v", "#2Scroll down of page", () => {
  scrollBySmooth(window.innerHeight * 0.9, 1);
});
mapkeyAndUnmap("z", "#2Scroll up of page", () => {
  scrollBySmooth(window.innerHeight * 0.9, -1);
});

// tab

// フォーカスしているタブを移動。
mapAndUnmap("h", "E");
mapAndUnmap("a", "E");
mapAndUnmap("s", "R");
mapAndUnmap("e", "R");

// 閉じたタブを復帰させる。
mapAndUnmap("-", "X");
// タブを閉じる。
mapkeyAndUnmap("w", "#3Close current tab", () => {
  RUNTIME("closeTab");
});
mapkeyAndUnmap("q", "#3Close current tab", () => {
  RUNTIME("closeTab");
});

// 最近閉じたタブや履歴を閲覧。
mapkeyAndUnmap("M-,", "#8Open RecentlyClosed", () => {
  Front.openOmnibar({ type: "RecentlyClosed" });
});
mapkeyAndUnmap("C-M-,", "#8Open History", () => {
  Front.openOmnibar({ type: "History" });
});

// Tree Style Tabs

const tstId = "treestyletab@piro.sakura.ne.jp";

// 親のタブに移る
mapkeyAndUnmap("b", "#3Focus parent tab", async () => {
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
mapkeyAndUnmap("d", "#3Outdent parent tab", () => {
  browser.runtime.sendMessage(tstId, {
    type: "outdent",
    tab: "current",
  });
});

// link

// iと同じだし、C-iはページの情報を取得するのに使いたいので除外します。
unmap("<Ctrl-i>");

// キーボードでリンクを移動。
mapkeyAndUnmap("x", "#1Open a link", () => {
  Hints.setCharacters(hintsCharactersAll);
  Hints.create("", Hints.dispatchMouseClick);
});

mapkeyAndUnmap("c", "#1Open a link in non-active new tab or click", () => {
  Hints.setCharacters(hintsCharactersAll);
  Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
});

mapkeyAndUnmap("m", "#1Open a link by right key", () => {
  Hints.setCharacters(hintsCharactersRight);
  Hints.create("", Hints.dispatchMouseClick);
  Hints.setCharacters(hintsCharactersAll);
});

mapkeyAndUnmap(
  "g",
  "#1Open a link in non-active new tab or click by right key",
  () => {
    Hints.setCharacters(hintsCharactersRight);
    Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
    Hints.setCharacters(hintsCharactersAll);
  }
);

mapkeyAndUnmap(";", "#1Open a link by left key", () => {
  Hints.setCharacters(hintsCharactersLeft);
  Hints.create("", Hints.dispatchMouseClick);
  Hints.setCharacters(hintsCharactersAll);
});

mapkeyAndUnmap(
  "p",
  "#1Open a link in non-active new tab or click by left key",
  () => {
    Hints.setCharacters(hintsCharactersLeft);
    Hints.create("", Hints.dispatchMouseClick, { tabbed: true, active: false });
    Hints.setCharacters(hintsCharactersAll);
  }
);

// 戻る進む。

// 戻る。
map("H", "S");
map("A", "S");
// 進む。
map("S", "D");
map("E", "D");

// open with external service

mapkeyAndUnmap("'", "Google", () => {
  const selection = window.getSelection().toString();
  if (selection !== "") {
    tabOpenLink(
      `https://www.google.com/search?client=firefox-b-d&q=${encodeURIComponent(
        selection
      )}`
    );
  }
});

mapkeyAndUnmap("<Ctrl-'>", "DeepL", () => {
  const selection = window.getSelection().toString();
  if (selection !== "") {
    tabOpenLink(
      `https://www.deepl.com/translator#en/ja/${encodeURIComponent(
        selection
      ).replaceAll("%2F", "\\%2F")}` // DeepLはスラッシュを特別扱いするためエスケープします。
    );
  }
});

mapkeyAndUnmap("<Alt-'>", "Google 翻訳", () => {
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

mapkeyAndUnmap("<Ctrl-Alt-'>", "英辞郎 on the WEB Pro Lite", () => {
  const selection = window.getSelection().toString();
  if (selection !== "") {
    tabOpenLink(
      `https://eowf.alc.co.jp/search?q=${encodeURIComponent(selection)}`
    );
  }
});

mapkeyAndUnmap("<Ctrl-;>", "はてなブックマーク", () => {
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

mapkeyAndUnmap("<Alt-;>", "通知 / Twitter", () => {
  tabOpenLink("https://twitter.com/notifications");
});

mapkeyAndUnmap("<Ctrl-Alt-;>", "エゴサーチ / Twitter", () => {
  tabOpenLink(
    "https://twitter.com/search?q=%22ncaq%22%20OR%20%22%E3%82%A8%E3%83%8C%E3%83%A6%E3%83%AB%22%20OR%20%22%E3%81%88%E3%81%AC%E3%82%86%E3%82%8B%22%20OR%20twitter.com%2Fncaq%20-from%3Ancaq%20OR%20%40ncaq_do_not_exist&f=live"
  );
});

// copy

mapkeyAndUnmap("f", "#7Copy title and link to markdown without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${document.title}](${url.href})`);
});

mapkeyAndUnmap("F", "#7Copy title and link to markdown", () => {
  Clipboard.write(`[${document.title}](${window.location.href})`);
});

mapkeyAndUnmap(
  "l",
  "#7Copy title and link to human readable without hash",
  () => {
    const url = new URL(window.location.href);
    url.hash = "";
    Clipboard.write(`[${document.title}]: ${url.href}`);
  }
);

mapkeyAndUnmap("L", "#7Copy title and link to human readable", () => {
  Clipboard.write(`[${document.title}]: ${window.location.href}`);
});

// 絵文字
iunmap(":");

// zoom

mapkeyAndUnmap("<Ctrl-=>", "#3zoom reset", () => {
  RUNTIME("setZoom", {
    zoomFactor: 0,
  });
});

// blacklistのキーはxkeysnailやKeyhacによって無効化されているけど誤爆しやすいので無効化
unmap("<Alt-s>");
