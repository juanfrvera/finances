import{S as De,i as Ve,d as re,s as Le,v as Ue,o as Ee,p as o,q as u,r as _,l as a,u as r,x as c,g as X,N as ye,y as T,c as H,z as q,f as S,H as n,Z,R as K,W as Ie,A as Be}from"../chunks/index.a52e887e.js";import{A as ce,g as fe}from"../chunks/auth.service.ca74416e.js";import{e as de}from"../chunks/singletons.572cdfa7.js";function pe(l){return l instanceof Error?l.message:"An unexpected error has occurred :("}const f="src/routes/auth/[slug]/+page.svelte";function ke(l){let s,i,b,t,p,e,g,m,w,z,k,I,F,P,E,G,d,A,Q,O,U,B,D,$,Y,R,N,M,te,y=l[0].login.error&&ve(l);const j={c:function(){s=o("p"),i=T("Please enter your credentials:"),b=H(),t=o("div"),p=o("div"),e=o("label"),g=T(`Username
					`),m=o("div"),w=o("input"),z=H(),k=o("div"),I=o("label"),F=T(`Password
					`),P=o("div"),E=o("input"),G=H(),d=o("button"),A=T("Log in"),O=H(),y&&y.c(),U=H(),B=o("div"),D=o("p"),$=T("Want to register instead?"),Y=H(),R=o("button"),N=T("Register"),this.h()},l:function(v){s=u(v,"P",{class:!0});var V=_(s);i=q(V,"Please enter your credentials:"),V.forEach(a),b=S(v),t=u(v,"DIV",{class:!0});var W=_(t);p=u(W,"DIV",{class:!0});var x=_(p);e=u(x,"LABEL",{class:!0});var h=_(e);g=q(h,`Username
					`),m=u(h,"DIV",{class:!0});var L=_(m);w=u(L,"INPUT",{class:!0,type:!0}),L.forEach(a),h.forEach(a),x.forEach(a),z=S(W),k=u(W,"DIV",{class:!0});var C=_(k);I=u(C,"LABEL",{class:!0});var se=_(I);F=q(se,`Password
					`),P=u(se,"DIV",{class:!0});var ne=_(P);E=u(ne,"INPUT",{class:!0,type:!0}),ne.forEach(a),se.forEach(a),C.forEach(a),G=S(W),d=u(W,"BUTTON",{class:!0});var le=_(d);A=q(le,"Log in"),le.forEach(a),O=S(W),y&&y.l(W),W.forEach(a),U=S(v),B=u(v,"DIV",{class:!0});var ee=_(B);D=u(ee,"P",{});var ae=_(D);$=q(ae,"Want to register instead?"),ae.forEach(a),Y=S(ee),R=u(ee,"BUTTON",{class:!0});var ie=_(R);N=q(ie,"Register"),ie.forEach(a),ee.forEach(a),this.h()},h:function(){r(s,"class","main-info s-siqcw1kXeHxI"),c(s,f,103,2,2602),r(w,"class","input"),r(w,"type","username"),c(w,f,110,6,2801),r(m,"class","control"),c(m,f,109,5,2773),r(e,"class","label"),c(e,f,107,4,2732),r(p,"class","field"),c(p,f,106,3,2708),r(E,"class","input"),r(E,"type","password"),c(E,f,120,6,3019),r(P,"class","control"),c(P,f,119,5,2991),r(I,"class","label"),c(I,f,117,4,2950),r(k,"class","field"),c(k,f,116,3,2926),r(d,"class",Q="button is-link is-fullwidth "+(l[0].sending?"is-loading":"")),c(d,f,124,3,3122),r(t,"class","auth-form s-siqcw1kXeHxI"),c(t,f,104,2,2660),c(D,f,132,3,3360),r(R,"class","button is-success"),c(R,f,133,3,3396),r(B,"class","alternative s-siqcw1kXeHxI"),c(B,f,131,2,3331)},m:function(v,V){X(v,s,V),n(s,i),X(v,b,V),X(v,t,V),n(t,p),n(p,e),n(e,g),n(e,m),n(m,w),Z(w,l[0].username),n(t,z),n(t,k),n(k,I),n(I,F),n(I,P),n(P,E),Z(E,l[0].password),n(t,G),n(t,d),n(d,A),n(t,O),y&&y.m(t,null),X(v,U,V),X(v,B,V),n(B,D),n(D,$),n(B,Y),n(B,R),n(R,N),M||(te=[K(w,"input",l[9]),K(E,"input",l[10]),K(d,"click",l[3],!1,!1,!1,!1),K(R,"click",l[2],!1,!1,!1,!1)],M=!0)},p:function(v,V){V&1&&Z(w,v[0].username),V&1&&E.value!==v[0].password&&Z(E,v[0].password),V&1&&Q!==(Q="button is-link is-fullwidth "+(v[0].sending?"is-loading":""))&&r(d,"class",Q),v[0].login.error?y?y.p(v,V):(y=ve(v),y.c(),y.m(t,null)):y&&(y.d(1),y=null)},d:function(v){v&&a(s),v&&a(b),v&&a(t),y&&y.d(),v&&a(U),v&&a(B),M=!1,Ie(te)}};return re("SvelteRegisterBlock",{block:j,id:ke.name,type:"if",source:"(103:20) ",ctx:l}),j}function Pe(l){let s,i,b,t,p,e,g,m,w,z,k,I,F,P,E,G,d,A,Q,O,U,B,D,$,Y,R,N,M,te,y,j,J,v,V;const W={c:function(){s=o("p"),i=T("Please fill the following fields to create your account:"),b=H(),t=o("div"),p=o("div"),e=o("label"),g=T(`Name
					`),m=o("div"),w=o("input"),z=H(),k=o("div"),I=o("label"),F=T(`Username
					`),P=o("div"),E=o("input"),G=H(),d=o("div"),A=o("label"),Q=T(`Password
					`),O=o("div"),U=o("input"),B=H(),D=o("button"),$=T("Register"),R=H(),N=o("div"),M=o("p"),te=T("Do you have an account already?"),y=H(),j=o("button"),J=T("Log in"),this.h()},l:function(h){s=u(h,"P",{class:!0});var L=_(s);i=q(L,"Please fill the following fields to create your account:"),L.forEach(a),b=S(h),t=u(h,"DIV",{class:!0});var C=_(t);p=u(C,"DIV",{class:!0});var se=_(p);e=u(se,"LABEL",{class:!0});var ne=_(e);g=q(ne,`Name
					`),m=u(ne,"DIV",{class:!0});var le=_(m);w=u(le,"INPUT",{class:!0,type:!0}),le.forEach(a),ne.forEach(a),se.forEach(a),z=S(C),k=u(C,"DIV",{class:!0});var ee=_(k);I=u(ee,"LABEL",{class:!0});var ae=_(I);F=q(ae,`Username
					`),P=u(ae,"DIV",{class:!0});var ie=_(P);E=u(ie,"INPUT",{class:!0,type:!0}),ie.forEach(a),ae.forEach(a),ee.forEach(a),G=S(C),d=u(C,"DIV",{class:!0});var ge=_(d);A=u(ge,"LABEL",{class:!0});var ue=_(A);Q=q(ue,`Password
					`),O=u(ue,"DIV",{class:!0});var he=_(O);U=u(he,"INPUT",{class:!0,type:!0}),he.forEach(a),ue.forEach(a),ge.forEach(a),B=S(C),D=u(C,"BUTTON",{class:!0});var me=_(D);$=q(me,"Register"),me.forEach(a),C.forEach(a),R=S(h),N=u(h,"DIV",{class:!0});var oe=_(N);M=u(oe,"P",{});var be=_(M);te=q(be,"Do you have an account already?"),be.forEach(a),y=S(oe),j=u(oe,"BUTTON",{class:!0});var we=_(j);J=q(we,"Log in"),we.forEach(a),oe.forEach(a),this.h()},h:function(){r(s,"class","main-info s-siqcw1kXeHxI"),c(s,f,61,2,1526),r(w,"class","input"),r(w,"type","text"),c(w,f,68,6,1743),r(m,"class","control"),c(m,f,67,5,1715),r(e,"class","label"),c(e,f,65,4,1678),r(p,"class","field"),c(p,f,64,3,1654),r(E,"class","input"),r(E,"type","username"),c(E,f,78,6,1965),r(P,"class","control"),c(P,f,77,5,1937),r(I,"class","label"),c(I,f,75,4,1896),r(k,"class","field"),c(k,f,74,3,1872),r(U,"class","input"),r(U,"type","password"),c(U,f,88,6,2183),r(O,"class","control"),c(O,f,87,5,2155),r(A,"class","label"),c(A,f,85,4,2114),r(d,"class","field"),c(d,f,84,3,2090),r(D,"class",Y="button is-primary is-fullwidth "+(l[0].sending?"is-loading":"")),c(D,f,93,3,2287),r(t,"class","auth-form s-siqcw1kXeHxI"),c(t,f,62,2,1610),c(M,f,99,3,2457),r(j,"class","button is-info"),c(j,f,100,3,2499),r(N,"class","alternative s-siqcw1kXeHxI"),c(N,f,98,2,2428)},m:function(h,L){X(h,s,L),n(s,i),X(h,b,L),X(h,t,L),n(t,p),n(p,e),n(e,g),n(e,m),n(m,w),Z(w,l[0].registering.name),n(t,z),n(t,k),n(k,I),n(I,F),n(I,P),n(P,E),Z(E,l[0].username),n(t,G),n(t,d),n(d,A),n(A,Q),n(A,O),n(O,U),Z(U,l[0].password),n(t,B),n(t,D),n(D,$),X(h,R,L),X(h,N,L),n(N,M),n(M,te),n(N,y),n(N,j),n(j,J),v||(V=[K(w,"input",l[6]),K(E,"input",l[7]),K(U,"input",l[8]),K(D,"click",l[4],!1,!1,!1,!1),K(j,"click",l[1],!1,!1,!1,!1)],v=!0)},p:function(h,L){L&1&&w.value!==h[0].registering.name&&Z(w,h[0].registering.name),L&1&&Z(E,h[0].username),L&1&&U.value!==h[0].password&&Z(U,h[0].password),L&1&&Y!==(Y="button is-primary is-fullwidth "+(h[0].sending?"is-loading":""))&&r(D,"class",Y)},d:function(h){h&&a(s),h&&a(b),h&&a(t),h&&a(R),h&&a(N),v=!1,Ie(V)}};return re("SvelteRegisterBlock",{block:W,id:Pe.name,type:"if",source:"(61:1) {#if ui.registering}",ctx:l}),W}function ve(l){let s,i=l[0].login.error+"",b;const t={c:function(){s=o("div"),b=T(i),this.h()},l:function(e){s=u(e,"DIV",{class:!0});var g=_(s);b=q(g,i),g.forEach(a),this.h()},h:function(){r(s,"class","error s-siqcw1kXeHxI"),c(s,f,128,4,3269)},m:function(e,g){X(e,s,g),n(s,b)},p:function(e,g){g&1&&i!==(i=e[0].login.error+"")&&Be(b,i)},d:function(e){e&&a(s)}};return re("SvelteRegisterBlock",{block:t,id:ve.name,type:"if",source:"(128:3) {#if ui.login.error}",ctx:l}),t}function _e(l){let s;function i(e,g){if(e[0].registering)return Pe;if(e[0].login)return ke}let b=i(l),t=b&&b(l);const p={c:function(){s=o("div"),t&&t.c(),this.h()},l:function(g){s=u(g,"DIV",{class:!0});var m=_(s);t&&t.l(m),m.forEach(a),this.h()},h:function(){r(s,"class","auth s-siqcw1kXeHxI"),c(s,f,59,0,1483)},m:function(g,m){X(g,s,m),t&&t.m(s,null)},p:function(g,[m]){b===(b=i(g))&&t?t.p(g,m):(t&&t.d(1),t=b&&b(g),t&&(t.c(),t.m(s,null)))},i:ye,o:ye,d:function(g){g&&a(s),t&&t.d()}};return re("SvelteRegisterBlock",{block:p,id:_e.name,type:"component",source:"",ctx:l}),p}function Ne(l,s,i){let{$$slots:b={},$$scope:t}=s;Ue("Page",b,[]);let{data:p}=s;const e={};Ee(()=>{p.startWith==="creation"?i(0,e.registering={},e):i(0,e.login={},e)});function g(){i(0,e.registering=void 0,e),i(0,e.login={},e),i(0,e.sending=!1,e)}function m(){i(0,e.login=void 0,e),i(0,e.registering={},e),i(0,e.sending=!1,e)}async function w(){if(!(!e.username||!e.password||!e.login||e.sending)){i(0,e.login.error=void 0,e),i(0,e.sending=!0,e);try{await ce.logIn({username:e.username,password:e.password}),fe(de)}catch(d){i(0,e.login.error=pe(d),e)}i(0,e.sending=!1,e)}}async function z(){if(!(!e.username||!e.password||!e.registering||e.sending)){i(0,e.registering.error=void 0,e),i(0,e.sending=!0,e);try{await ce.register({username:e.username,password:e.password,name:e.registering.name}),fe(de)}catch(d){i(0,e.registering.error=pe(d),e)}i(0,e.sending=!1,e)}}l.$$.on_mount.push(function(){p===void 0&&!("data"in s||l.$$.bound[l.$$.props.data])&&console.warn("<Page> was created without expected prop 'data'")});const k=["data"];Object.keys(s).forEach(d=>{!~k.indexOf(d)&&d.slice(0,2)!=="$$"&&d!=="slot"&&console.warn(`<Page> was created with unknown prop '${d}'`)});function I(){e.registering.name=this.value,i(0,e)}function F(){e.username=this.value,i(0,e)}function P(){e.password=this.value,i(0,e)}function E(){e.username=this.value,i(0,e)}function G(){e.password=this.value,i(0,e)}return l.$$set=d=>{"data"in d&&i(5,p=d.data)},l.$capture_state=()=>({onMount:Ee,AuthService:ce,getUIErrorString:pe,goto:fe,base:de,data:p,ui:e,logInInstead:g,registerInstead:m,logIn:w,register:z}),l.$inject_state=d=>{"data"in d&&i(5,p=d.data)},s&&"$$inject"in s&&l.$inject_state(s.$$inject),[e,g,m,w,z,p,I,F,P,E,G]}class Ae extends De{constructor(s){super(s),Ve(this,s,Ne,_e,Le,{data:5}),re("SvelteRegisterComponent",{component:this,tagName:"Page",options:s,id:_e.name})}get data(){throw new Error("<Page>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'")}set data(s){throw new Error("<Page>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'")}}export{Ae as default};
