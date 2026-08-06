// ==UserScript==
// @name        DLsiteTagDecensor
// @namespace   ForsakenRei
// @description Replaces DLsite's tag with the original ones.
// @match       *://*.dlsite.com/*
// @version     0.0.1
// @grant       none
// @icon        https://www.dlsite.com/favicon.ico
// @updateURL   https://github.com/ForsakenRei/DLsiteLink/raw/main/DLsiteDecensor.user.js
// @downloadURL https://github.com/ForsakenRei/DLsiteLink/raw/main/DLsiteDecensor.user.js
// @run-at      document-end
// ==/UserScript==

(function () {
  "use strict";
  const WORD_MAP = [
    { oldWord: "メスガキ", newWord: "ざぁ～こ♡" },
    { oldWord: "レイプ", newWord: "合意なし" },
    { oldWord: "ロリ", newWord: "つるぺた" },
    { oldWord: "ロリババア", newWord: "つるぺたババア" },
    { oldWord: "監禁", newWord: "閉じ込め" },
    { oldWord: "鬼畜", newWord: "超ひどい" },
    { oldWord: "逆レイプ", newWord: "逆レ" },
    { oldWord: "強制/無理矢理", newWord: "命令/無理矢理" },
    { oldWord: "近親相姦", newWord: "近親もの" },
    { oldWord: "拷問", newWord: "責め苦" },
    { oldWord: "催眠", newWord: "トランス/暗示" },
    { oldWord: "獣姦", newWord: "畜えち" },
    { oldWord: "洗脳", newWord: "精神支配" },
    { oldWord: "痴漢", newWord: "秘密さわさわ" },
    { oldWord: "調教", newWord: "しつけ" },
    { oldWord: "奴隷", newWord: "下僕" },
    { oldWord: "陵辱", newWord: "屈辱" },
    { oldWord: "輪姦", newWord: "回し" },
    { oldWord: "蟲姦", newWord: "虫えっち" },
    { oldWord: "モブ姦", newWord: "モブおじさん" },
    { oldWord: "異種姦", newWord: "異種えっち" },
    { oldWord: "機械姦", newWord: "機械責め" },
    { oldWord: "睡眠姦", newWord: "すやすやえっち" },
    { oldWord: "催眠音声", newWord: "トランス/暗示ボイス" },
  ];

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const sortedEntries = [...WORD_MAP].sort(
    (a, b) => b.newWord.length - a.newWord.length,
  );
  const replacementMap = new Map(
    sortedEntries.map((entry) => [entry.newWord, entry.oldWord]),
  );
  const replaceRegex = new RegExp(
    sortedEntries.map((entry) => escapeRegExp(entry.newWord)).join("|"),
    "g",
  );

  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT"]);

  function replaceInTextNode(node) {
    const original = node.nodeValue;
    if (!original || !replaceRegex.test(original)) return;
    replaceRegex.lastIndex = 0;
    node.nodeValue = original.replace(
      replaceRegex,
      (match) => replacementMap.get(match) ?? match,
    );
  }

  function walk(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (SKIP_TAGS.has(node.parentElement?.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let node;
    while ((node = walker.nextNode())) {
      replaceInTextNode(node);
    }
  }

  walk(document.body);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const added of mutation.addedNodes) {
        if (added.nodeType === Node.TEXT_NODE) {
          replaceInTextNode(added);
        } else if (added.nodeType === Node.ELEMENT_NODE) {
          walk(added);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
