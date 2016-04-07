// ----- On render -----
$(function() {
  
  setTimeout(function(){
    $('#newPage').removeClass('loading')
  }, 10);
  
  var tip;
  
  var defaultBehavior = {
    url: 'https://www.google.com/search?q=',
    firstHit: 'https://www.google.com/search?btnI&q='
  };
  // You can easily switch from Google to other default search engines here
  /*defaultBehavior = {
    url: 'https://duckduckgo.com/?q=',
    firstHit: 'https://duckduckgo.com/?q=!'
  }*/
  var keywords = [{
    keyword: 'Facebook',
    url: 'https://facebook.com/search/?q='
  }, {
    keyword: 'YouTube',
    url: 'https://www.youtube.com/results?search_query='
  }, {
    keyword: 'the noun project',
    url: 'https://thenounproject.com/search/?q='
  }, {
    keyword: 'HBO Go',
    url: 'http://www.hbogo.com/#search&browseMode=browseGrid?searchTerm=',
    suffix: '/'

  }, {
    keyword: 'define',
    url: 'http://dictionary.reference.com/browse/'
  }, {
    keyword: 'soundcloud',
    url: 'https://soundcloud.com/search?q='
  }, {
    keyword: 'rdio',
    url: 'http://www.rdio.com/search/',
    suffix: '/'
  }, {
    keyword: [
      'watch the show',
      'watch the tv show',
      'the show',
      'the tv show',
      'tv shows with',
      'shows with',
      'tv shows by',
      'shows by',
      'television with',
      'television by',
      'television'],
    url: 'https://www.justwatch.com/us/search?content_type=show&q='
  }, {
    keyword: [
      'watch movies with', 
      'watch movies by',
      'movies with',
      'movies by', 
      'the movie',
      'movies'
    ],
    url: 'https://www.justwatch.com/us/search?q=',
    suffix: '&content_type=movie'
    
  }, {
    keyword: ['weather be like', 'weather going to be like', 'weather going to be', 'weather going to be', 'weather like', 'weather be', 'weather'],
    url: defaultBehavior.url + 'weather%20'
  }, {
    keyword: ['watch', 'stream', 'where can i watch'],
    url: 'https://www.justwatch.com/us/search?q='
  }, {
    keyword: 'Evernote',
    url: 'https://www.evernote.com/Home.action?#ses=1&sh=5&sds=3&x=',
    suffix: '&'
  }, {
    keyword: 'Hulu',
    url: 'http://www.hulu.com/search?q='
  }, {
    keyword: 'Netflix',
    url: 'http://www.netflix.com/search/'
  }, {
    keyword: ['Twitter', 'Twitter account', 'Twitter page'],
    url: 'https://twitter.com/search?src=typd&q='
  }, {
    keyword: 'Gmail',
    url: 'https://mail.google.com/mail/u/0/#search/'
  }, {
    keyword: 'Google Keep',
    url: 'https://keep.google.com/#search/text='
  }, {
    keyword: 'Google Photos',
    url: 'https://photos.google.com/search/'
  }, {
    keyword: 'Google Drive',
    url: 'https://drive.google.com/drive/u/0/search?q='
  }, {
    keyword: 'Dropbox',
    url: 'https://www.dropbox.com/search/personal?query_unnormalized='
  }, {
    keyword: 'Google',
    url: 'https://google.com/search?q='
  }, {
    keyword: ['Wikipedia', 'wiki'],
    url: 'https://en.wikipedia.org/w/index.php?search='
  }, {
    keyword: 'Amazon',
    url: 'http://www.amazon.com/s/?field-keywords='
  }, {
    keyword: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q='
  }, {
    keyword: 'Pinterest',
    url: 'https://www.pinterest.com/search/?q='
  }, {
    keyword: 'ebay',
    url: 'http://m.ebay.com/sch/i.html?_nkw='
  }, {
    keyword: 'imdb',
    url: 'http://www.imdb.com/find?ref_=nv_sr_fn&s=all&q='
  }, {
    keyword: ['Stackoverflow', 'stack overflow'],
    url: defaultBehavior.url + 'site:stackoverflow.com+'
  }];
  var precursors = [
    'on',
    'on my',
    'in',
    'in my',
    'from',
    'from my',
    "'",
    "'s"
  ];
  var worthlessPrefixes = [
    "what's the",
    "what is the",
    "what will the",
    "find",
    "show me",
    "show",
    "i want to",
    "give me",
    "let me",
    "search for",
    "look up",
    "look for",
    "search"
  ];
  var final_transcript = '';
  var recognizing = false;
  var cancel = false;

  if (!('webkitSpeechRecognition' in window)) {
    unsupported();
  } else {
    var recognition = new webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onstart = function() {}
    recognition.onresult = function(e) {
      var interim_transcript = '';

      for (var i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          final_transcript = final_transcript + e.results[i][0].transcript;
        } else {
          interim_transcript = interim_transcript + e.results[i][0].transcript;
        }
      }
      final_transcript = capitalize(final_transcript);
      $('#final_span').empty().html(linebreak(final_transcript));
      $('#interim_span').empty().html(linebreak(interim_transcript));
    };
  }
  recognition.onerror = function(e) {}

  function startButton(event) {
    final_transcript = '';
    //recognition.lang = select_dialect.value;
    recognition.start();
  }

  function unsupported() {
    console.log('Webkit speech api not supported in your browser');
  }

  // Main start event
  $('#button').on('mousedown touchstart', function() {
    if (cancel) {
      TweenMax.killAll();
      reset();
    } else {
      startRecog();
    }
  });

  function startRecog() {
    if (!recognizing) {
      recognition.start();
      final_transcript = '';
      $('#final_span').empty();
      $('#interim_span').empty();
      $(this).text('done');
      recognizing = true;
    }
  };

  $(document).on('touchend mouseup', function() {
    endRecog();
  })

  function endRecog() {
    if (recognizing) {
      recognizing = false;
      recognition.stop();
    }
  }

  recognition.onend = function() {
    var string = final_transcript.toLowerCase(); 
    if (string.trim() != '') {
      recognizing = false;
      cancel = true;
      var counter = {
          t: 0
        },
        border = '2px solid white',
        loading = $('<div class="element"><div class="loading"></div><div class="slice"></div></div>'),
        fill = $('<div class="loading ring">')
      $('#button #contents').append(loading).append(fill);
      $('#button').addClass('cancel');
      TweenMax.to(counter, 2, {
        t: 100,
        ease: Linear.easeNone,
        onUpdate: function() {
          TweenMax.set($('#button .element .loading'), {
            rotation: (counter.t * 3.6) - 45
          });
          if (counter.t >= 25) {
            $('#button > #contents > .loading.ring').css('border-top', border);
          };
          if (counter.t >= 50) {
            $('#button > #contents > .loading.ring').css('border-right', border);
            $('#button .element .slice').remove();
          }
          if (counter.t >= 75) {
            $('#button > #contents > .loading.ring').css('border-bottom', border);
          }
        },
        onComplete: function() {
          process(string);
          $('#newPage').addClass('going');
        }
      });
    } else {
      showTip();
    }
  }

  function process(string) {
    string = string.toLowerCase();
    success = false;
    var foundKeywords = [];
    $.each(keywords, function() {
      if ($.isArray(this.keyword)) {
        var self = this;
        $(this.keyword).each(function() {
          var keyword = this.toLowerCase(),
              keywordIndex = String(string).indexOf(keyword);
          if (keywordIndex > -1) {
            foundKeywords.push({
              'keywordIndex': keywordIndex,
              'keywordObject': self,
              'keyword': keyword
            });
          }
        });
      } else {
        var keyword = this.keyword.toLowerCase(),
          keywordIndex = String(string).indexOf(keyword);
        if (keywordIndex > -1) {
          foundKeywords.push({
            'keywordIndex': keywordIndex,
            'keywordObject': this,
            'keyword': this.keyword
          });
        }
      }
    });
    if (!foundKeywords.length) {
      noKeyword(string);
    } else if (foundKeywords.length == 1) {
      // String ops
      var passIt = foundKeywords[0].keywordObject;
      passIt.foundKeyword = foundKeywords[0].keyword;
      parseString(string, passIt);
    } else {
      // At this point, we know more than one keyword is in here.
      // Now we need to determine which is the command
      // and which is part of a query.
      var youngestKeyword,
          youngestIndex = 10000000000000000000000000000,
          finished = false;
      $.each(foundKeywords, function() {
        if (youngestIndex > this.keywordIndex) {
          youngestKeyword = this.keywordObject;
          youngestKeyword.foundKeyword = this.keyword;
          youngestIndex = this.keywordIndex;
        }
        var currentKeywordObject = this.keywordObject;
        var currentKeyword = this.keyword
        $.each(precursors, function(){
          var thisString = String(string).toLowerCase();
          var precursorIndex = thisString.indexOf(String(this).toLowerCase()),
              proposedIndex = precursorIndex + String(this).length,
              actualIndex = thisString.indexOf(String(currentKeyword).toLowerCase());
          if (precursorIndex > 0){
            if (proposedIndex == actualIndex || proposedIndex + 1 == actualIndex) {
              currentKeywordObject.foundKeyword = currentKeyword;
              parseString(string, currentKeywordObject);
              finished = true;
              return false;
            }
          }
        })
        if (finished) {
          return false;
        }
      })
      if (!finished) {
        parseString(string, youngestKeyword);
      }
    }
  }

  function noKeyword(string) {
    // "Go to"/"Open" command
    if (string.indexOf('go to') == 0) {
      string = string.substring('go to'.length + 1);
      getThat(defaultBehavior, string.trim(), 'firstHit')
    } else if (string.indexOf('goto') == 0) {
      string = string.substring('goto'.length + 1);
      getThat(defaultBehavior, string.trim(), 'firstHit')
    } else if (string.indexOf('open') == 0) {
      string = string.substring('open'.length + 1);
      openInNewTab(string);
      getThat(defaultBehavior, string.trim(), 'firstHit')
    } else {
      $(worthlessPrefixes).each(function() {
        if (string.indexOf(this.toLowerCase()) == 0) {
          string = string.substring(this.length + 1);
          return false;
        }
      });
      getThat(defaultBehavior, string.trim());
    }
  }

  function parseString(string, keyword) {
    var found = false;
    // strip out useless human context
    $(worthlessPrefixes).each(function() {
      if (string.indexOf(this) == 0) {
        string = string.substring(this.length + 1);
        return false;
      }
    });
    if (string.trim() == String(keyword.foundKeyword).toLowerCase()) {
        // There is no string here, so go to the root domain
      var pathArray = keyword.url.split('/'),
        protocol = pathArray[0],
        host = pathArray[2],
        url = protocol + '//' + host;
      newKeyword = {
        url: url
      };
      getThat(newKeyword, '');
    } else {
      // There is a string here, so query it
      console.log(keyword)
      $(precursors).each(function() {
        var onKeyword = String(this) + ' ' + keyword.foundKeyword.toLowerCase();
        if (string.indexOf(onKeyword) > -1 && string.indexOf(onKeyword) == string.length - onKeyword.length) {
          string = string.substring(0, string.length - onKeyword.length).trim();
          found = true;
          return false
        }
      });

      var searchXFor = keyword.foundKeyword.toLowerCase() + ' for';
      if (string.indexOf(searchXFor) == 0 && !found) {
        string = string.substring(searchXFor.length + 1);
      }

      if (!found) {
        string = string.replace(keyword.foundKeyword.toLowerCase(), '')
      }
      getThat(keyword, string.trim());
    }
  }

  function getThat(command, query, firstHit) {
    var suffix = '';
    if (command.suffix) {
      suffix = command.suffix
    }
    if (firstHit) {
      openInNewTab(defaultBehavior.firstHit + encodeURIComponent(query) + suffix);
    } else {
      openInNewTab(command.url + encodeURIComponent(query) + suffix);
    }
  }

  function openInNewTab(url) {
    /*
    var win = window.open(url, '_blank');
    win.focus(); */
    
    window.location.href = url;
  }

  function reset() {
    TweenMax.set($("#button .loading"), {
      clearProps: "all"
    });
    $('#button').removeClass('cancel');
    $('#button #contents').empty();
    cancel = false;
    final_transcript = '';
    $('#final_span').text('');
  }

  function showTip() {
    reset();
    $('#tip').addClass('show');
    if (tip) {
      window.clearTimeout(tip);
    }
    tip = setTimeout(function() {
      $('#tip').removeClass('show');
    }, 3000);

  }

  /// ##### VISUALIZATION STUFF #####

  var liveSource;
  var analyser;
  var frequencyData;
  var scaling = 1.5;

  function update() {
      requestAnimationFrame(update);

      if (recognizing) {
        analyser.getByteFrequencyData(frequencyData);
        TweenMax.set($('.visual'), {
          autoAlpha: 0.75
        });

        TweenMax.set($('#viz1'), {
          scale: (((frequencyData[8] + 1) / 100) / scaling)
        });
        TweenMax.set($('#viz2'), {
          scale: (((frequencyData[15] + 1) / 100) / scaling)
        });
        TweenMax.set($('#viz3'), {
          scale: (((frequencyData[21] + 1) / 100) / scaling)
        });
      } else {
        TweenMax.set($('.visual'), {
          autoAlpha: 0
        })
      }
    }
    // creates an audiocontext and hooks up the audio input
  var context = new AudioContext();
  navigator.webkitGetUserMedia({
    audio: true
  }, function(stream) {
    console.log("Connected live audio input");
    if (!analyser) {
      liveSource = context.createMediaStreamSource(stream);
      // Create the analyser
      analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 64;
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      liveSource.connect(analyser);
    };
    update();
  }, function() {
    console.log('Error connecting to audio')
  });

});

/// ##### BASIC UTILS #####

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function linebreak(s) {
  var two_line = /\n\n/g;
  var one_line = /\n/g;
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}