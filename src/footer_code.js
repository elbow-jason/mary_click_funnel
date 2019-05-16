// urlValue: link
var keyMapping = {
  "subid": "subid",
  "s1": "s1",
};

let targets = [
  { selector: "a", attribute: "href" },
  { selector: "img", attribute: "data-imagelink" },
];


function parseParams(url) {
  var a = document.createElement('a');
  a.href = url;
  let pairs = a.search.substring(1);
  let result = parseQueryString(pairs);
  return result
}

function parseQueryString(queryString) {
  // pair is "s1=123"
  let pairs = queryString.split("&");
  let obj = {};
  let pair;
  var parts;
  for (var index in pairs) {
    pair = pairs[index];
    // parts is ["s1", "123"]
    parts = pair.split("=")
    let key = parts[0];
    let value = parts[1];
    if (key && value) {
      obj[key] = value;
    }
    // {"s1": "123"}
  }
  return obj
}


function remapParams(original, urlParams, keyMapping) {
  obj = {}
  let dest_key;
  let value;
  for (var source_key in keyMapping) {
    value = null;
    dest_key = keyMapping[source_key];
    value = urlParams[source_key] || original[dest_key];
    if (value && dest_key) {
      obj[dest_key] = value;
    }
  }
  for (var key in original) {
    value = original[key];
    if (!obj[key] && value && key) {
      obj[key] = value;
    }
  }
  return obj
}

function applyQueryToFullUrl(url, queryObj) {
  var a = document.createElement('a');
  a.href = url;
  let port = a.port ? ":" + a.port : "";
  return a.protocol + "//" + a.hostname + port + a.pathname + "?" + $.param(queryObj)
}

function applyQueryToRelativeUrl(rel, queryObj) {
  var a = document.createElement('a');
  a.href = rel;
  return a.href.pathname + "?" + $.param(queryObj);
}


function updateTarget(el, attribute, urlParams, mapping) {
  let link = el.getAttribute(attribute);
  // console.log("el", el);
  // console.log("link", link);
  /* console.log("keys", Object.keys(el)); */
  /* console.log("data-imagelink", el.getAttribute("data-imagelink")); */
  /* console.log("dataImagelink", el.getAttribute("dataImagelink")); */
  /* console.log("imagelink", el["imagelink"]); */
  if (link) {
    let attrParams = parseParams(link);
    let newParams = remapParams(attrParams, urlParams, mapping);
    let changer = (link.startsWith("http")) ? applyQueryToFullUrl : applyQueryToRelativeUrl;
    let newLink = changer(link, newParams);
    el.setAttribute(attribute, newLink);
  }
}

$(document).ready(function () {
  let urlParams = parseParams(window.location.href);
  targets.forEach(function (target) {
    document.querySelectorAll(target.selector).forEach(function (el) {
      updateTarget(el, target.attribute, urlParams, keyMapping)
    })
  })
});