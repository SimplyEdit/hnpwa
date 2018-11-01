# Hackernews PWA - SimplyView/SimplyEdit example

![Lighthouse Score](https://github.com/SimplyEdit/hnpwa/raw/master/hnpwa.lighthouse.png)

[Live](https://hnpwa.simplyedit.io/) - [SimplyEdit/SimplyView reference](https://reference.simplyedit.io/)

This repository contains an example progressive web app (PWA) built with SimplyEdit/SimplyView. 
There are many versions of this application using different javascript frameworks, read more about it at https://hnpwa.com

## How we made it

SimplyEdit and SimplyView do not force any kind of structure to your application. Since the Hackernews PWA is so simple, and to make a point, we included all the HTML, CSS and javascript in the index.html. This has an actual advantage, since there are less files to fetch, the application will perform better.

There is a structure inside the index.html file, at the top is the head with all the usual metadata and the CSS. Below it is the HTML structure, which contains all the HTML that will ever be used, there is no HTML in the javascript part. At the bottom is all the javascript. There is no javascript in the HTML either.

We're fans of the `view source` feature, so we haven't minified or uglified anything, we're using relatively old school javascript, so no need for a transpiler either. You don't need the github repository and a plethora of tools to see the innards and copy it.

We've used the `api.hackerwebapp.com` service to get the list of articles, since it already nicely groups the articles in pages of 30, which is a requirement for the `hnpwa.com` website. There is a small API, which basically is a wrapper for the browsers `fetch` api, called `hnapi`. `hnapi.list` returns a page of articles from a specific section, `hnapi.get` returns a single article.

There's a simple application 'framework' included in SimplyView. We used that to add basic routing, as well as commands and actions. Commands is the way that SimplyView ties your javascript to HTML elements. In this case the 'Install to Homescreen' and its close button are the only commands used. The remainder is done using routing. There is a route for the homepage, which shows page 1 of the 'news' list. There is a route for a page of a section and a route for comments on an article.

Routes as well as commands have javascript functions tied to them. This code is tied fairly closely to your application and HTML structure. Then these call Actions to do the real work, to change the state of the application. Actions in turn call the `hnapi` functions to retrieve the data from the remote server. Actions always return a promise, so that commands and routes can do something with the asynchronous results.

## How we made it fast

As said above, we include all the code in the index.html, except where the PWA specification forbids it (serviceworker, manifest, etc).
The seperation of concerns - no code in the HTML and no HTML in the code - as well as the structure of routes/commands/actions, make it possible to do quite a lot of work in very few lines of code, so the code we do need is small as well.
Then we added a few preload links in the head so that the few resources we do need are preloaded as soon as possible.
Finally we put the PWA behind a Cloudflare proxy, which speeds everything up nicely.

The rest is just standard, no need to do any trickery to get the lighthouse score above.

## How to make it faster yet

But you can make it significantly faster yet, if you really want to. The most important thing to understand is that lighthouse tests as if you are using a mobile on a slow network. The single biggest slowdown is the latency of each request. Each request will take at least 600ms just to start sending data back. So fewer requests, especially chained requests, means better performance.

There are two javascript resources in the app, SimplyEdit and SimplyView, which could be inlined. They are already mentioned in a preload link, but that still means that the browser needs to retrieve the HTML and parse it before it can start preloading the javascript. By inlining it, you save 600ms. The same goes for the first page of data from the `api.hackerwebapp.com` website. If you could inline that data as well, you would have no need for additional requests for the first page view.

It turns out that you can, if you have a server which has support for Edge Side Includes, you can just do something like this:

```html
<script type="application/json" id="preloadedData"><esi:include src="https://api.hackerwebapp.com/news" /></script>
```

And now your server will make the request, instead of the browser. As the slowdown, the latency, is in the slow mobile network, this change will do the request on the fast network of your server instead.
