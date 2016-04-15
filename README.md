# Voice Command
##### Extensible Chrome voice command tool


### <a href="https://truthlabs.github.io/voice-command/: target="_blank">View demo page</a>
###### (Chrome only, requires microphone permissions).


Voice command uses Google's [Web Speech API](https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API) to turn speech into text, then uses an easily editable list of keywords to direct the search to the correct page.  Integrating new sites with keywords is simple and takes seconds, with basically no research and very little coding knowledge.

I personally use a fork of this as my [new tab page](https://s.codepen.io/drewvosburg/debug/rOqdjj).

## Keyword objects
The code uses and array of keyword objects to search for what the user wants to do. Keyword objects are simple JSON objects with three properties: `keyword`, `url`, and an optional `suffix`.  The average keyword object looks like this: 
```javascript
{ keyword: 'Google', url: 'https://google.com/search?q=' }
```

The three components are fairly straightforward, but it's worth exploring in further detail.

#### Keyword
The `keyword` is either a string or an array of strings.  Arrays of strings can be in any order and may include spaces.

#### URL
The purpose of the `url` parameter is to provide a URL with the parameter name for a query for that specific page, which is often `?q=` at the end of a URL.  These can be easily reverse engineered from almost every website by performing a search on the target website and reducing the parameters in the resulting URL to only include the query.

#### Suffix
For some reason, some sites insist on having certain characters or parameters at the end of the URL to work properly.  For this reason, there is an optional `suffix` parameter.  If this is required, often it is a `/` or `&` character.

## Language parsing
I wrote the string parsing myself.  The parsing happens in two main steps

#### Worthless prefixes
Imperative English sentences often begin with words that provide context to English speakers that the sentence is a command.  Usually this includes a verb.  I have created an array of common phrases that I have used to make commands that provide the script with no helpful information about context.  These are stripped out of the user's spoken sentence if they appear at the beginning.

These are stored in an array of strings called `worthlessPrefixes`, which can easily be modified.

#### Keyword detection
Next in the process, the script goes through the keywords array and searches for each of the listed keyword strings in each keyword object.  If it finds one, it makes a note of it and stores it in an array called `foundKeywords`.

If no keywords are found, then the default behavior is passed the query string.

If one keyword is found, then its URL is passed the query string.

If more than one is found, then the algorithm tries to find a precursor, which is found in the `precursors` array. if a keyword occurs after a precursor, then the query string is passed to that keyword's URL. Otherwise, it is passed to the first keyword to appear in the user's spoken sentence.

## Design Considerations
One key choice was to make the user hold the microphone button to begin recording and release when they are complete. This eliminate false stopping due to "stagefright." If the user can't think of what to say or pauses when they aren't complete, the script will wait until the user is done and releases the button.

There is also a two second delay where the microphone icon turns to a cancel icon, which gives the user a chance to review the transcribed sentence and stop it from going down the wrong path based on a misheard word.