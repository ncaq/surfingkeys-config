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
 * scrollByの動作がFirefox 65で予測不可能になったのでscrollToで再実装する。
 * スムーズスクロールする。
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
 * 絶対位置スクロール。
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

// iと同じだし、C-iはページの情報を取得するのに使いたいので除外する。
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
      ).replaceAll("%2F", "\\%2F")}` // DeepLはスラッシュを特別扱いするためエスケープする。
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

/**
 * GitHubのPull Requestから開いたCommitのページのタイトルが、
 * コミットメッセージを一切含まないのを修正。
 */
function githubCommitInPullRequestTitle() {
  // GitHubによって勝手に長さによって省略されている。
  // しかし全体を取ると複数行全部取ることになる。
  // 最初の1行だけを取りたいが少しばかり複雑なロジックになりそうなので本格的に使いたくなるまで保留。
  const commitMessagePart =
    document.getElementsByClassName("commit-title")?.[0]?.innerText;
  if (typeof commitMessagePart !== "string") {
    return undefined;
  }
  // コミット単独のページだと既にタイトルに含まれているので追記しない。
  if (document.title.includes(commitMessagePart)) {
    return undefined;
  }
  return `${commitMessagePart} · ${document.title}`;
}

/**
 * [Backlog｜チームで使うプロジェクト管理・タスク管理ツール](https://backlog.com/ja/)
 * で妥当なtitleを整形して取得する。
 *
 * Backlogのtitleはそのまま`document.title`を利用すると、
 * タイトルの無意味なサフィックス部分がかなり長い問題がある。
 * またBacklogのMarkdownパーサーにはバグがあり、
 * タイトルをそのままMarkdownのリンク文字列にすると、
 * `[[]]`のパースに失敗して最初の括弧を削ってしまう。
 *
 * よってそれっぽいタイトルを整形する。
 * ヌーラボには、
 * `[Backlog-97500] お問い合わせ返信：一部文字が削られることについて`
 * としてメールで問い合わせを発信している。
 * しかし2022-06-16に問題を認識しているという返答がありましたが未だに修正されないので、
 * バッドノウハウとしてこちらで対処する。
 *
 * URLなどを見てBacklogかどうかは判定しない。
 * Backlogみたいなクラス名を持つページならば、
 * ダックタイピング的にBacklogとして扱う。
 * 深刻な問題に対応したり自動的に動くスクリプトではないので、
 * これぐらい雑に扱っても大丈夫なはず。
 */
function backlogTitle() {
  // 課題のキー。プロジェクトタイトルがプレフィックスに付くので純粋な数値ではない。
  const issueNumber =
    document.getElementsByClassName("ticket__key-number")?.[0]?.innerText;
  // 課題に設定されたタイトル。
  const issueTitle = document.getElementsByClassName(
    "title-group__title-text"
  )?.[0]?.innerText;
  // うまいこと取得できなかったら諦める。
  if (typeof issueNumber !== "string" || typeof issueTitle !== "string") {
    return undefined;
  }
  // 連続して角括弧を記述できないので、
  // 最初にスペースを入れることで誤魔化す。
  return ` [[${issueNumber}]] ${issueTitle}`;
}

/**
 * 適切なタイトルを状況に応じて取得する。
 * 特殊な状況でなければ`document.title`を利用する。
 */
function dwimTitle() {
  return githubCommitInPullRequestTitle() || backlogTitle() || document.title;
}

mapkey("f", "#7Copy title and link to markdown without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${dwimTitle()}](${url.href})`);
});

mapkey("F", "#7Copy title and link to markdown", () => {
  Clipboard.write(`[${dwimTitle()}](${window.location.href})`);
});

mapkey("l", "#7Copy title and link to human readable without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${dwimTitle()}]: ${url.href}`);
});

mapkey("L", "#7Copy title and link to human readable", () => {
  Clipboard.write(`[${dwimTitle()}]: ${window.location.href}`);
});

/**
 * Twitterの埋め込みスクリプトを取得する。
 */
async function getTwitterEmbed(url) {
  // TwitterのURLやツイートのURLじゃない場合は`undefined`を返す。
  if (
    !(
      (url.hostname === "twitter.com" ||
        url.hostname === "mobile.twitter.com") &&
      /^\/\w+\/status\/\d+/.exec(url.pathname)
    )
  ) {
    return undefined;
  }
  const publish = new URL("https://publish.twitter.com/oembed");
  publish.searchParams.set("url", url.href);
  // `script`タグは最後にまとめて入れるので取り除く。
  publish.searchParams.set("omit_script", "t");
  // ブラウザの言語設定を反映する。
  publish.searchParams.set("lang", navigator.language || "en");
  const response = await fetch(publish.href);
  if (!response.ok) {
    throw new Error(
      `${publish.href}: response is not ok ${JSON.stringify(
        response.statusText
      )}`
    );
  }
  return (await response.json()).html;
}

// ツイートを埋め込むボタンを押していちいちコピーして`script`タグを取り除くのが面倒なので、
// キーを入力するだけでコピーできるようにする。
mapkey("ye", "#7Copy Twitter embed", () => {
  async function f() {
    Clipboard.write(await getTwitterEmbed(new URL(window.location.href)));
  }
  f();
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
