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
   iunmap
   map
   mapkey
   searchSelectedWith
   settings
   tabOpenLink
   unmap
 */

Hints.characters = "htnsdcrbmwvz";
settings.hintAlign = "left";
settings.omnibarMaxResults = 20;

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

map("-", "X");
mapkey("w", "#3Close current tab", () => {
  RUNTIME("closeTab");
});
mapkey("q", "#3Close current tab", () => {
  RUNTIME("closeTab");
});

mapkey("p", "#8Open history", () => {
  Front.openOmnibar({ type: "History" });
});

// Tree Style Tabs

const tstId = "treestyletab@piro.sakura.ne.jp";

// 親のタブに移る
mapkey("b", "focus parent tab", async () => {
  const { id } = await browser.runtime.sendMessage(tstId, {
    type: "get-tree",
    tab: "current"
  });
  const tabs = await browser.runtime.sendMessage(tstId, {
    type: "get-tree",
    tabs: "*"
  });
  const parentTab = tabs.find(tab =>
    tab.children.find(child => child.id === id)
  );
  if (parentTab) {
    browser.runtime.sendMessage(tstId, {
      type: "focus",
      tab: parentTab.id
    });
  }
});

// タブを1段階上昇させる
mapkey("d", "outdent parent tab", () => {
  browser.runtime.sendMessage(tstId, {
    type: "outdent",
    tab: "current"
  });
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
    { tabbed: true, active: false }
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
  const selection = window.getSelection().toString();
  if (selection === "") {
    // 文字列選択してない場合はページ自体を翻訳にかける
    tabOpenLink(
      `http://translate.google.com/translate?u=${window.location.href}`
    );
  } else {
    // 選択している場合はそれを翻訳する
    tabOpenLink(`https://translate.google.com/?text=${selection}`);
  }
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

mapkey("m", "Copy title and link to markdown without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${document.title}](${url.href})`);
});

mapkey("l", "Copy title and link to human readable without hash", () => {
  const url = new URL(window.location.href);
  url.hash = "";
  Clipboard.write(`[${document.title}]: ${url.href}`);
});

// 絵文字
iunmap(":");

// zoom

mapkey("<Ctrl-=>", "#3zoom reset", () => {
  RUNTIME("setZoom", {
    zoomFactor: 0
  });
});
