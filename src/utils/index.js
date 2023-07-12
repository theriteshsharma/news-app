const createCookieInHour = (cookieName, cookieValue, hourToExpire) => {
  let date = new Date();
  date.setTime(date.getTime() + hourToExpire * 60 * 60 * 1000);
  document.cookie =
    cookieName + " = " + cookieValue + "; expires = " + date.toGMTString();
};

const titleCase = (str) => {
  str = str
    .toLowerCase() // str = "i'm a little tea pot";

    // Step 2. Split the string into an array of strings
    .split(" ") // str = ["i'm", "a", "little", "tea", "pot"];

    // Step 3. Map over the array
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
      /* Map process
      1st word: "i'm" => word.replace(word[0], word[0].toUpperCase());
                         "i'm".replace("i", "I");
                         return word => "I'm"
      2nd word: "a" => word.replace(word[0], word[0].toUpperCase());
                       "a".replace("a", "A");
                        return word => "A"
      3rd word: "little" => word.replace(word[0], word[0].toUpperCase());
                            "little".replace("l", "L");
                            return word => "Little"
      4th word: "tea" => word.replace(word[0], word[0].toUpperCase());
                         "tea".replace("t", "T");
                         return word => "Tea"
      5th word: "pot" => word.replace(word[0], word[0].toUpperCase());
                         "pot".replace("p", "P");
                         return word => "Pot"                                                        
      End of the map() method */
    });

  // Step 4. Return the output
  return str.join(" "); // ["I'm", "A", "Little", "Tea", "Pot"].join(' ') => "I'm A Little Tea Pot"
};

function invertColor(hex) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}

function getColor(isAccent = true) {
  return (
    "hsl(" +
    360 * Math.random() +
    "," +
    (25 + (isAccent ? 70 : 100) * Math.random()) +
    "%," +
    (85 + 10 * Math.random()) +
    "%)"
  );
}

function setCookie(name, value) {
  document.cookie = name + "=" + value + "; Path=/;";
}
function deleteCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
export {
  createCookieInHour,
  titleCase,
  getColor,
  invertColor,
  setCookie,
  deleteCookie,
};
