function p(){}function G(t,e){for(const n in e)t[n]=e[n];return t}function L(t){return t()}function M(){return Object.create(null)}function g(t){t.forEach(L)}function A(t){return typeof t=="function"}function ut(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let b;function lt(t,e){return b||(b=document.createElement("a")),b.href=e,t===b.href}function J(t){return Object.keys(t).length===0}function P(t,...e){if(t==null)return p;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function ft(t){let e;return P(t,n=>e=n)(),e}function at(t,e,n){t.$$.on_destroy.push(P(e,n))}function _t(t,e,n,i){if(t){const r=q(t,e,n,i);return t[0](r)}}function q(t,e,n,i){return t[1]&&i?G(n.ctx.slice(),t[1](i(e))):n.ctx}function dt(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const l=[],s=Math.max(e.dirty.length,r.length);for(let o=0;o<s;o+=1)l[o]=e.dirty[o]|r[o];return l}return e.dirty|r}return e.dirty}function ht(t,e,n,i,r,l){if(r){const s=q(e,n,i,l);t.p(s,r)}}function mt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function pt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function yt(t){return t&&A(t.destroy)?t.destroy:p}let w=!1;function K(){w=!0}function Q(){w=!1}function R(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function U(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const a=e[u];a.claim_order!==void 0&&c.push(a)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,a=(r>0&&e[n[r]].claim_order<=u?r+1:R(1,r,x=>e[n[x]].claim_order,u))-1;i[c]=n[a]+1;const f=a+1;n[f]=c,r=Math.max(f,r)}const l=[],s=[];let o=e.length-1;for(let c=n[r]+1;c!=0;c=i[c-1]){for(l.push(e[c-1]);o>=c;o--)s.push(e[o]);o--}for(;o>=0;o--)s.push(e[o]);l.reverse(),s.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<s.length;c++){for(;u<l.length&&s[c].claim_order>=l[u].claim_order;)u++;const a=u<l.length?l[u]:null;t.insertBefore(s[c],a)}}function V(t,e){if(w){for(U(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function gt(t,e,n){w&&!n?V(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function X(t){t.parentNode&&t.parentNode.removeChild(t)}function xt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function Y(t){return document.createElement(t)}function Z(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function S(t){return document.createTextNode(t)}function bt(){return S(" ")}function $t(){return S("")}function vt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function B(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function wt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set?t[i]=e[i]:B(t,i,e[i])}function Et(t,e){for(const n in e)B(t,n,e[n])}function tt(t){return Array.from(t.childNodes)}function et(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function D(t,e,n,i,r=!1){et(t);const l=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const o=t[s];if(e(o)){const c=n(o);return c===void 0?t.splice(s,1):t[s]=c,r||(t.claim_info.last_index=s),o}}for(let s=t.claim_info.last_index-1;s>=0;s--){const o=t[s];if(e(o)){const c=n(o);return c===void 0?t.splice(s,1):t[s]=c,r?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,o}}return i()})();return l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,l}function z(t,e,n,i){return D(t,r=>r.nodeName===e,r=>{const l=[];for(let s=0;s<r.attributes.length;s++){const o=r.attributes[s];n[o.name]||l.push(o.name)}l.forEach(s=>r.removeAttribute(s))},()=>i(e))}function Nt(t,e,n){return z(t,e,n,Y)}function kt(t,e,n){return z(t,e,n,Z)}function nt(t,e){return D(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>S(e),!0)}function At(t){return nt(t," ")}function St(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function jt(t,e){t.value=e??""}function Ct(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Mt(t,e,n){t.classList[n?"add":"remove"](e)}function Ot(t,e){return new t(e)}let y;function m(t){y=t}function F(){if(!y)throw new Error("Function called outside component initialization");return y}function Tt(t){F().$$.on_mount.push(t)}function Lt(t){F().$$.after_update.push(t)}const h=[],O=[],$=[],T=[],H=Promise.resolve();let N=!1;function I(){N||(N=!0,H.then(W))}function Pt(){return I(),H}function k(t){$.push(t)}const E=new Set;let d=0;function W(){if(d!==0)return;const t=y;do{try{for(;d<h.length;){const e=h[d];d++,m(e),it(e.$$)}}catch(e){throw h.length=0,d=0,e}for(m(null),h.length=0,d=0;O.length;)O.pop()();for(let e=0;e<$.length;e+=1){const n=$[e];E.has(n)||(E.add(n),n())}$.length=0}while(h.length);for(;T.length;)T.pop()();N=!1,E.clear(),m(t)}function it(t){if(t.fragment!==null){t.update(),g(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(k)}}const v=new Set;let _;function qt(){_={r:0,c:[],p:_}}function Bt(){_.r||g(_.c),_=_.p}function rt(t,e){t&&t.i&&(v.delete(t),t.i(e))}function Dt(t,e,n,i){if(t&&t.o){if(v.has(t))return;v.add(t),_.c.push(()=>{v.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}function zt(t,e){const n={},i={},r={$$scope:1};let l=t.length;for(;l--;){const s=t[l],o=e[l];if(o){for(const c in s)c in o||(i[c]=1);for(const c in o)r[c]||(n[c]=o[c],r[c]=1);t[l]=o}else for(const c in s)r[c]=1}for(const s in i)s in n||(n[s]=void 0);return n}function Ft(t){t&&t.c()}function Ht(t,e){t&&t.l(e)}function ct(t,e,n,i){const{fragment:r,after_update:l}=t.$$;r&&r.m(e,n),i||k(()=>{const s=t.$$.on_mount.map(L).filter(A);t.$$.on_destroy?t.$$.on_destroy.push(...s):g(s),t.$$.on_mount=[]}),l.forEach(k)}function st(t,e){const n=t.$$;n.fragment!==null&&(g(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ot(t,e){t.$$.dirty[0]===-1&&(h.push(t),I(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function It(t,e,n,i,r,l,s,o=[-1]){const c=y;m(t);const u=t.$$={fragment:null,ctx:[],props:l,update:p,not_equal:r,bound:M(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:M(),dirty:o,skip_bound:!1,root:e.target||c.$$.root};s&&s(u.root);let a=!1;if(u.ctx=n?n(t,e.props||{},(f,x,...j)=>{const C=j.length?j[0]:x;return u.ctx&&r(u.ctx[f],u.ctx[f]=C)&&(!u.skip_bound&&u.bound[f]&&u.bound[f](C),a&&ot(t,f)),x}):[],u.update(),a=!0,g(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){K();const f=tt(e.target);u.fragment&&u.fragment.l(f),f.forEach(X)}else u.fragment&&u.fragment.c();e.intro&&rt(t.$$.fragment),ct(t,e.target,e.anchor,e.customElement),Q(),W()}m(c)}class Wt{$destroy(){st(this,1),this.$destroy=p}$on(e,n){if(!A(n))return p;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!J(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{ct as A,st as B,_t as C,ht as D,mt as E,dt as F,V as G,p as H,at as I,lt as J,vt as K,ft as L,G as M,pt as N,wt as O,zt as P,Z as Q,kt as R,Wt as S,Et as T,xt as U,Mt as V,jt as W,yt as X,g as Y,P as Z,A as _,bt as a,gt as b,At as c,Dt as d,$t as e,Bt as f,rt as g,X as h,It as i,Lt as j,Y as k,Nt as l,tt as m,B as n,Tt as o,Ct as p,S as q,nt as r,ut as s,Pt as t,St as u,qt as v,O as w,Ot as x,Ft as y,Ht as z};
