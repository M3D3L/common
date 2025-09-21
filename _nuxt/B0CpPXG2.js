import{U as h,a1 as C,e as v,o as g,c as m,a as r,b as i,w as d,u as t,S as f,Q as k,R as V,d as w,t as N,n as q,q as B}from"./BN0B7Lbi.js";import{c as x}from"./DJUxloUB.js";/**
 * @license lucide-vue-next v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=x("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-vue-next v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=x("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]),$={key:0,class:"flex items-center justify-center"},L={class:"flex items-center gap-1"},S={__name:"Pagination",props:{totalPages:{type:Number,required:!0},maxVisiblePages:{type:Number,default:5},showPagination:{type:Boolean,default:!1}},setup(u){const a=u,P=h(),y=C(),n=v(()=>parseInt(P.query.page)||1),b=v(()=>{const o=[];let e=1,s=a.totalPages;if(a.totalPages>a.maxVisiblePages){const l=Math.floor(a.maxVisiblePages/2),p=Math.ceil(a.maxVisiblePages/2)-1;n.value<=l?s=a.maxVisiblePages:n.value+p>=a.totalPages?e=a.totalPages-a.maxVisiblePages+1:(e=n.value-l,s=n.value+p)}for(let l=e;l<=s;l++)o.push(l);return o}),c=o=>{o<1||o>a.totalPages||y.push({query:{...P.query,page:o}})};return(o,e)=>u.showPagination&&u.totalPages>1?(g(),m("nav",$,[r("ul",L,[r("li",null,[i(t(f),{variant:"outline",size:"sm",disabled:t(n)===1,onClick:e[0]||(e[0]=s=>c(t(n)-1))},{default:d(()=>[i(t(z),{class:"w-4 h-4"}),e[2]||(e[2]=r("span",{class:"sr-only"},"Previous page",-1))]),_:1},8,["disabled"])]),(g(!0),m(k,null,V(t(b),s=>(g(),m("li",{key:s},[i(t(f),{variant:"page",class:q(["px-4",t(n)===s?"bg-primary text-primary-foreground":""]),size:"sm",onClick:l=>c(s)},{default:d(()=>[w(N(s),1)]),_:2},1032,["class","onClick"])]))),128)),r("li",null,[i(t(f),{variant:"outline",size:"sm",disabled:t(n)===u.totalPages,onClick:e[1]||(e[1]=s=>c(t(n)+1))},{default:d(()=>[i(t(R),{class:"w-4 h-4"}),e[3]||(e[3]=r("span",{class:"sr-only"},"Next page",-1))]),_:1},8,["disabled"])])])])):B("",!0)}};export{S as _};
