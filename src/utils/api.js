import { deleteCookie } from ".";

/* eslint-disable no-async-promise-executor */
const URL = "http://localhost:4000/api/v1";
const get = async (path, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        URL + path + new URLSearchParams(payload).toString(),
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: "Bearer " + document.cookie.split("=")[1],
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
        }
      );
      let resJson = await response.json();
      if (resJson.status == 401) {
        deleteCookie("token");
        throw Error(resJson.message);
      }
      resolve(resJson);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};
const post = (path, payload, isJSON = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(URL + path, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          ...(isJSON && { "Content-Type": "application/json" }),

          // "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + document.cookie.split("=")[1],
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: isJSON ? JSON.stringify(payload) : payload,
      });

      resolve(response.json());
    } catch (err) {
      reject(err);
    }
  });
};

const put = async (path, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(URL + path, {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(payload),
      });

      resolve(response.json());
    } catch (err) {
      reject(err);
    }
  });
};

const remove = async (path, payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(URL + path, {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(payload),
      });
      resolve(response.json());
    } catch (err) {
      reject(err);
    }
  });
};

export { get, post, put, remove };
