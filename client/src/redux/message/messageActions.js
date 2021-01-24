///////////// DISMISS MESSAGE ///////////
export function dismissMessageArticle() {
   return {
      type: "DISMISS_MESSAGE_ARTICLE",
      message: null
   };
}

export function dismissMessageUser() {
   return {
      type: "DISMISS_MESSAGE_USER",
      message: null
   };
}