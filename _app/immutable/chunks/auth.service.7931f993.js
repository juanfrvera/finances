var c=Object.defineProperty;var g=(o,t,e)=>t in o?c(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var n=(o,t,e)=>(g(o,typeof t!="symbol"?t+"":t,e),e);import{j as a}from"./singletons.fc1e7930.js";class l{static setSyncEnabled(t){localStorage.setItem(r.syncEnabled,JSON.stringify(t))}static isSyncEnabled(){return!!localStorage.getItem(r.syncEnabled)}static hasLocalData(){return!!localStorage.getItem(r.hasLocalData)}}const r={syncEnabled:"SYNC_ENABLED",hasLocalData:"LOCAL_DATA"};a.disable_scroll_handling;const p=a.goto;a.invalidate;a.invalidateAll;a.preload_data;a.preload_code;a.before_navigate;a.after_navigate;const k="https://vubf56t0ih.execute-api.us-east-1.amazonaws.com/dev";class i{static async logIn(t){const e=await fetch(`${this.url}/login`,{method:"POST",body:JSON.stringify(t)}),s=await e.json();if(e.status!==200)throw new Error(s);this.setToken(s),l.setSyncEnabled(!0)}static async register(t){const e=await fetch(`${this.url}/register`,{method:"POST",body:JSON.stringify(t)}),s=await e.json();if(e.status!==200)throw new Error(s);this.setToken(s),l.setSyncEnabled(!0)}static getToken(){return this.token||(this.token=localStorage.getItem(this.tokenStorageKey)),this.token}static hasValidToken(){if(!this.getToken())return!1;const e=this.getTokenExpirationDate();return!(e&&Date.now()>e.getTime())}static removeToken(){this.token=null,localStorage.setItem(this.tokenStorageKey,""),localStorage.setItem(this.tokenExpirationDateKey,"")}static setToken(t){this.token=t.token,localStorage.setItem(this.tokenStorageKey,t.token),this.tokenExpirationDate=new Date(t.expirationDate),localStorage.setItem(this.tokenExpirationDateKey,t.expirationDate)}static getTokenExpirationDate(){if(!this.tokenExpirationDate){const t=localStorage.getItem(this.tokenExpirationDateKey);t&&(this.tokenExpirationDate=new Date(t))}return this.tokenExpirationDate}}n(i,"url",`${k}/auth`),n(i,"token"),n(i,"tokenStorageKey","token"),n(i,"tokenExpirationDateKey","token_expiration"),n(i,"tokenExpirationDate");export{i as A,k as P,l as U,p as g};
