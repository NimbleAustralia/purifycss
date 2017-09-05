var addWord = function (words, word) {
  if (word.length > 0) {
    words.push(word);
  }
};

var markAsUsed = function (used, word) {
  used[word] = true;
  if (word === 'amp-img') {
    used.img = true;
  } else if (word === 'amp-form') {
    used['amp-form-submitting'] = true;
    used['amp-form-submit-success'] = true;
    used['amp-form-submit-error'] = true;
    used['user-valid'] = true;
    used['user-invalid'] = true;
  } else if (word === 'amp-user-notification' || word === 'amp-live-list') {
    used['amp-active'] = true;
    used['amp-hidden'] = true;
  }
};

var ExtractWordsUtil = {
  getAllWordsInContent: function (content) {
    var used = {
      // Always include html and body.
      html: true,
      body: true
    };
    var word = '';

    for (var i = 0; i < content.length; i++) {
      var chr = content[i];

      if (chr.match(/[_a-z0-9-]+/)) {
        word += chr;
      } else {
        markAsUsed(used, word);
        word = '';
      }
    }

    markAsUsed(used, word);

    return used;
  },

  getAllWordsInSelector: function (selector) {
    // Remove attr selectors. "a[href...]"" will become "a".
    selector = selector.replace(/\[(.+?)\]/g, '').toLowerCase();

    // If complex attr selector (has a bracket in it) just leave
    // the selector in. ¯\_(ツ)_/¯
    if (selector.indexOf('[') !== -1 || selector.indexOf(']') !== -1) {
      return [];
    }

    var words = [];
    var word = '';
    var skipNextWord = false;

    for (var i = 0; i < selector.length; i++) {
      var letter = selector[i];

      if (skipNextWord && (letter !== '.' || letter !== '#' || letter !== ' ')) {
        continue;
      }

      // If pseudoclass or universal selector, skip the next word
      if (letter === ':' || letter === '*') {
        addWord(words, word);
        word = '';
        skipNextWord = true;
        continue;
      }

      if (letter.match(/[_a-z0-9-]+/)) {
        word += letter;
      } else {
        addWord(words, word);
        word = '';
        skipNextWord = false;
      }
    }

    addWord(words, word);
    return words;
  }
};

module.exports = ExtractWordsUtil;
