import{_ as O}from"./rBYirHg8.js";import{_ as B}from"./BNifxBBp.js";import{c as I,_ as M}from"./DO1rN-p-.js";import{_ as R,m as z}from"./Cx3-yYNP.js";import{l as P,e as x,o as p,m as b,w as m,b as d,u as e,a as o,t as v,d as w,c as h,q as _,T as j,r as k,H as F,y as W,a3 as G,S as C,n as D,_ as L,p as N,k as A,Q as Y,R as H,U as E,a2 as J,f as Q}from"./DWH1ACXH.js";import{_ as V,a as q}from"./DMXWuP2W.js";import{u as S}from"./i6d1wBZU.js";import{_ as K}from"./BZ30tyNd.js";/**
 * @license lucide-vue-next v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=I("chevron-left",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-vue-next v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=I("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-vue-next v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=I("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-vue-next v0.488.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=I("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]),se={class:"w-full mt-6 md:w-3/4 md:pr-8 md:mt-0"},oe={class:"flex items-center gap-2 mb-2"},ie={class:"text-xs text-muted-foreground"},ne={class:"text-lg font-bold"},ae=["innerHTML"],le={key:0,class:"relative md:w-1/3 w-full aspect-[16/9] card-styles overflow-hidden min-h-[160px]"},re=["src","alt"],ce=P({__name:"BlogHorizontal",props:{title:{},description:{},created:{},slug:{},collectionId:{},id:{},coverImage:{},index:{},baseUrl:{}},setup(l){const s=l,r=j(),c=x(()=>new Date(s.created).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})),i=x(()=>`${s.baseUrl||""}/blog${s.slug}`),y=x(()=>`${r.public.pocketbaseUrl}api/files/${s.collectionId}/${s.id}/${s.coverImage}`),u=x(()=>{var n;return((n=s==null?void 0:s.description)==null?void 0:n.trim())||""});return(n,t)=>{const a=B;return p(),b(e(M),{class:"w-full"},{default:m(()=>[d(e(R),null,{default:m(()=>[d(a,{to:e(i),class:"flex flex-col-reverse items-start w-full h-full pt-6 md:flex-row"},{default:m(()=>[o("div",se,[o("div",oe,[o("span",ie,v(e(c)),1)]),o("h3",ne,[d(a,{to:e(i),class:"transition-colors hover:text-primary"},{default:m(()=>[w(v(n.title),1)]),_:1},8,["to"])]),o("p",{class:"mt-2 text-sm text-muted-foreground line-clamp-3",innerHTML:e(u)},null,8,ae)]),n.coverImage?(p(),h("div",le,[e(y)?(p(),h("img",{key:0,src:e(y),alt:n.title,width:"600",height:"338",loading:"lazy",class:"object-cover w-full h-full transition-transform duration-500",decoding:"async"},null,8,re)):_("",!0)])):_("",!0)]),_:1},8,["to"])]),_:1})]),_:1})}}}),de=`<section>
    <h2>1. Information I Collect</h2>
    <p>I collect information to provide and improve my services, communicate with you, and understand how my website is used. The types of information I collect include:</p>
    
    <h3>Personal Information You Voluntarily Provide</h3>
    <ul>
      <li><strong>Newsletter Subscription:</strong> I collect your email address. You may also provide your name.</li>
      <li><strong>Blog Comments:</strong> I collect your name, email address, comment content, and optionally your website URL.</li>
      <li><strong>Contact Forms/Direct Communication:</strong> I collect your name, email address, and message content.</li>
    </ul>

    <h3>Automatically Collected Information (Usage Data)</h3>
    <ul>
      <li>IP address</li>
      <li>Browser type and version</li>
      <li>Operating system</li>
      <li>Referring and exit pages</li>
      <li>Dates and times of access</li>
      <li>Time spent on pages</li>
      <li>Clickstream data</li>
    </ul>
  </section>

  <section>
    <h2>2. How I Use Your Information</h2>
    <ul>
      <li>To provide and maintain the website</li>
      <li>To send newsletter updates</li>
      <li>To enable blog commenting</li>
      <li>To respond to inquiries</li>
      <li>To improve the website and content</li>
      <li>To protect against fraud and enforce terms</li>
    </ul>
  </section>

  <section>
    <h2>3. Sharing Your Information</h2>
    <p>I do not sell, rent, or trade your personal information. I may share it only in the following cases:</p>
    <ul>
      <li><strong>With Service Providers:</strong> For website operation, email marketing, and analytics.</li>
      <li><strong>For Legal Reasons:</strong> To comply with law, protect rights, investigate wrongdoing, or ensure safety.</li>
      <li><strong>With Your Consent:</strong> Only for purposes you explicitly agree to.</li>
    </ul>
  </section>

  <section>
    <h2>4. Data Retention</h2>
    <p>I retain data only as long as needed for the purpose it was collected, or for legal/reporting reasons:</p>
    <ul>
      <li><strong>Newsletter:</strong> Retained until you unsubscribe.</li>
      <li><strong>Blog Comments:</strong> May be kept indefinitely unless removal is requested.</li>
      <li><strong>Contact Submissions:</strong> Retained for a reasonable response window.</li>
      <li><strong>Usage Data:</strong> Typically retained briefly for analytics.</li>
    </ul>
  </section>

  <section>
    <h2>5. Your Choices and Rights</h2>
    <p>Depending on applicable laws, you may have the right to:</p>
    <ul>
      <li>Access your personal information</li>
      <li>Request corrections</li>
      <li>Request deletion ("right to be forgotten")</li>
      <li>Unsubscribe from newsletters</li>
      <li>Object to certain data processing</li>
      <li>Withdraw consent at any time</li>
    </ul>
    <p>To exercise any of these rights, please contact me at the email listed below.</p>
  </section>

  <section>
    <h2>6. Cookies and Tracking Technologies</h2>
    <p>My website may use cookies and similar technologies:</p>
    <ul>
      <li><strong>Necessary Cookies:</strong> Enable core site functionality.</li>
      <li><strong>Analytics Cookies:</strong> Understand usage and performance (e.g., Google Analytics).</li>
    </ul>
    <p>You can manage cookie preferences through your browser settings. Disabling cookies may affect site functionality.</p>
  </section>

  <section>
    <h2>7. Links to Other Websites</h2>
    <p>This site may contain links to third-party websites. I am not responsible for their privacy practices or content. Always review their policies.</p>
  </section>

  <section>
    <h2>8. Security of Your Information</h2>
    <p>I use reasonable measures to protect your data but cannot guarantee absolute security. Transmission over the internet involves risk.</p>
  </section>

  <section>
    <h2>9. Children's Privacy</h2>
    <p>This site is not intended for children under 13. I do not knowingly collect data from them. If you believe a child has provided data, contact me for removal.</p>
  </section>

  <section>
    <h2>10. Changes to This Privacy Policy</h2>
    <p>I may update this Privacy Policy. Changes will be posted on this page with a revised "Last Updated" date. Review it periodically for updates.</p>
  </section>

  <section>
    <h2>11. Contact Me</h2>
    <p>If you have questions or concerns about this policy, reach out at:</p>
    <address>
      Guillermo Medel<br />
      <a href="mailto:guillermoantoniomedel@gmail.com">guillermoantoniomedel@gmail.com</a>
    </address>
  </section>`,ue={class:"space-y-2"},me={class:"space-y-2"},pe={class:"flex items-center"},ge={for:"newsletter-consent",class:"ml-2 text-sm"},fe={class:"border-t border-white/10"},ye={class:"flex flex-col items-center space-y-2 text-center"},he={class:"flex space-x-2"},be={class:"p-2 rounded-lg bg-primary-600/10"},_e={class:"p-2 rounded-lg bg-primary-600/10"},we=P({__name:"NewsletterHero",setup(l){const s={hidden:{opacity:0,y:40},visible:{opacity:1,y:0,transition:{duration:.8,ease:[.16,1,.3,1]}}},r=k({email:"",name:"",consent:!1}),c=k(!1),i=k(null),y=S(),u=async()=>{var n,t,a;if(!r.value.consent){i.value={type:"error",text:"Please agree to the privacy policy"};return}if(!r.value.email){i.value={type:"error",text:"Email is required"};return}c.value=!0,i.value=null;try{await y.createItem("newsletterSubs",{email:r.value.email,name:r.value.name||"",consent_given:!0,subscribed_at:new Date().toISOString()}),i.value={type:"success",text:"Thank you for subscribing!"},r.value={email:"",name:"",consent:!1}}catch(g){console.error("Subscription error:",g),((a=(t=(n=g==null?void 0:g.response)==null?void 0:n.data)==null?void 0:t.email)==null?void 0:a.code)==="validation_not_unique"?i.value={type:"error",text:"This email is already subscribed"}:i.value={type:"error",text:"Subscription failed. Please try again later."}}finally{c.value=!1}};return(n,t)=>(p(),b(e(z).div,{variants:s},{default:m(()=>[d(e(M),null,{default:m(()=>[d(e(R),{class:"p-6 space-y-6"},{default:m(()=>[o("form",{onSubmit:F(u,["prevent"]),class:"space-y-4"},[o("div",ue,[d(e(V),{for:"newsletter-email"},{default:m(()=>t[3]||(t[3]=[w("Email Address")])),_:1}),d(e(q),{id:"newsletter-email",modelValue:e(r).email,"onUpdate:modelValue":t[0]||(t[0]=a=>e(r).email=a),type:"email",placeholder:"your@email.com",required:"",class:"bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"},null,8,["modelValue"])]),o("div",me,[d(e(V),{for:"newsletter-name"},{default:m(()=>t[4]||(t[4]=[w("Name (Optional)")])),_:1}),d(e(q),{id:"newsletter-name",modelValue:e(r).name,"onUpdate:modelValue":t[1]||(t[1]=a=>e(r).name=a),type:"text",placeholder:"Your name",class:"bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"},null,8,["modelValue"])]),o("div",pe,[W(o("input",{id:"newsletter-consent","onUpdate:modelValue":t[2]||(t[2]=a=>e(r).consent=a),type:"checkbox",required:"",class:"w-4 h-4 rounded text-primary-600 bg-white/10 border-white/20 focus:ring-primary-500"},null,512),[[G,e(r).consent]]),o("label",ge,[t[6]||(t[6]=w(" I agree to receive emails and accept the ")),d(K,{title:"Privacy Policy",description:'`This Privacy Policy describes how Guillermo Medel ("I," "me," or "my") collects, uses, and discloses information when you visit my website, subscribe to my newsletter, or interact with my blog.`',htmlContent:e(de)},{button:m(()=>t[5]||(t[5]=[o("span",{class:"cursor-pointer text-primary-500 hover:underline"},"privacy policy",-1)])),_:1},8,["htmlContent"])])]),d(e(C),{size:"lg",class:"w-full",disabled:e(c)},{default:m(()=>[w(v(e(c)?"Subscribing...":"Subscribe Now"),1)]),_:1},8,["disabled"])],32),e(i)?(p(),h("div",{key:0,class:D(["p-4 text-sm rounded-lg",{"bg-green-900/50 text-green-300":e(i).type==="success","bg-red-900/50 text-red-300":e(i).type==="error"}])},v(e(i).text),3)):_("",!0),o("div",fe,[o("div",ye,[o("div",he,[o("div",be,[d(e(te),{class:"w-5 h-5 text-primary-400"})]),o("div",_e,[d(e(ee),{class:"w-5 h-5 text-primary-400"})])])])])]),_:1})]),_:1})]),_:1}))}}),ve=L(we,[["__scopeId","data-v-08047cdc"]]),xe={class:"flex flex-col w-full md:flex-row lg:flex-col"},Pe={class:"grid content-center w-full px-2 mb-8 md:w-1/2 lg:w-full md:pr-16 lg:pr-0 md:mb-4 md:px-0"},ke={class:"mb-2 text-2xl font-bold tracking-tight text-primary md:text-3xl lg:text-4xl"},$e={class:"mt-3 text-sm line-clamp-3"},Ce=P({__name:"Subscribe",props:{title:{type:String,default:"Join Newsletter"},description:{type:String,default:"Stay updated with the latest news, articles, and resources. Subscribe and never miss out!"}},setup(l){return(s,r)=>{const c=ve;return p(),h("div",xe,[o("div",Pe,[o("h2",ke,v(l.title),1),o("p",$e,v(l.description),1)]),d(c,{class:"w-full md:w-1/2 md:pl-2 lg:pl-0 lg:w-full"})])}}}),Ie={class:"flex flex-col w-full min-h-screen gap-8 pb-16 lg:pb-24 lg:flex-row",id:"main-content"},Se={id:"right-rail","aria-labelledby":"sidebar-heading",class:"w-full lg:w-1/3"},Te={class:"lg:z-10 lg:sticky top-24"},Ue=P({__name:"FixedRail",setup(l){const s={hidden:{opacity:0,y:40},visible:{opacity:1,y:0,transition:{duration:.8,ease:[.16,1,.3,1]}}};return(r,c)=>(p(),h("div",Ie,[d(e(z).section,{variants:s,"aria-labelledby":"main-content-heading",class:"w-full gap-4 lg:w-2/3"},{default:m(()=>[c[0]||(c[0]=o("h2",{id:"main-content-heading",class:"sr-only"},"Main content",-1)),N(r.$slots,"main")]),_:3}),o("aside",Se,[o("div",Te,[c[1]||(c[1]=o("h2",{id:"sidebar-heading",class:"sr-only"},"Additional content",-1)),N(r.$slots,"right")])])]))}}),Ne={class:"grid w-full gap-4"},Ve=P({__name:"Blog",props:{content:{type:Array,required:!0},baseUrl:{type:String},type:{type:String,default:"posts"}},setup(l){const s=l,r=S(),c=k([]),i=async()=>{try{return await r.fetchCollection(s.type,1,6,"","-created","")}catch(u){return console.error("Error fetching posts:",u),[]}},y=async()=>{c.value=await i()};return A(async()=>{await y()}),(u,n)=>{const t=ce,a=Ce,g=Ue;return p(),b(g,null,{main:m(()=>[o("div",Ne,[(p(!0),h(Y,null,H(l.content,(f,$)=>(p(),b(t,{key:f.id,title:f.title,description:f.description,created:f.created,slug:f.slug,"collection-id":f.collectionId,id:f.id,"cover-image":f.cover_image,index:$,"base-url":l.baseUrl},null,8,["title","description","created","slug","collection-id","id","cover-image","index","base-url"]))),128))])]),right:m(()=>[d(a,{class:"z-10 sticky-position top-24"})]),_:1})}}}),qe={key:0,class:"flex items-center justify-center"},Be={class:"flex items-center gap-1"},Me={__name:"Pagination",props:{totalPages:{type:Number,required:!0},maxVisiblePages:{type:Number,default:5},showPagination:{type:Boolean,default:!1}},setup(l){const s=l,r=E(),c=J(),i=x(()=>parseInt(r.query.page)||1),y=x(()=>{const n=[];let t=1,a=s.totalPages;if(s.totalPages>s.maxVisiblePages){const g=Math.floor(s.maxVisiblePages/2),f=Math.ceil(s.maxVisiblePages/2)-1;i.value<=g?a=s.maxVisiblePages:i.value+f>=s.totalPages?t=s.totalPages-s.maxVisiblePages+1:(t=i.value-g,a=i.value+f)}for(let g=t;g<=a;g++)n.push(g);return n}),u=n=>{n<1||n>s.totalPages||c.push({query:{...r.query,page:n}})};return(n,t)=>l.showPagination&&l.totalPages>1?(p(),h("nav",qe,[o("ul",Be,[o("li",null,[d(e(C),{variant:"outline",size:"sm",disabled:e(i)===1,onClick:t[0]||(t[0]=a=>u(e(i)-1))},{default:m(()=>[d(e(X),{class:"w-4 h-4"}),t[2]||(t[2]=o("span",{class:"sr-only"},"Previous page",-1))]),_:1},8,["disabled"])]),(p(!0),h(Y,null,H(e(y),a=>(p(),h("li",{key:a},[d(e(C),{variant:"page",class:D(["px-4",e(i)===a?"bg-primary text-primary-foreground":""]),size:"sm",onClick:g=>u(a)},{default:m(()=>[w(v(a),1)]),_:2},1032,["class","onClick"])]))),128)),o("li",null,[d(e(C),{variant:"outline",size:"sm",disabled:e(i)===l.totalPages,onClick:t[1]||(t[1]=a=>u(e(i)+1))},{default:m(()=>[d(e(Z),{class:"w-4 h-4"}),t[3]||(t[3]=o("span",{class:"sr-only"},"Next page",-1))]),_:1},8,["disabled"])])])])):_("",!0)}},Re={class:"container flex flex-col w-full mx-auto"},ze={class:"flex justify-start w-full mr-auto -mt-12 lg:-mt-20"},De=P({__name:"BlogColumn",props:{title:{type:String,default:"Blog Articles & Tutorials"},description:{type:String,default:"Explore my latest articles and insights on web development, design, and technology. Learn from practical tutorials and stay updated with industry trends."},perPage:{type:Number,default:6},content:{type:Object},showMore:{type:Boolean,default:!0},showPagination:{type:Boolean,default:!0},baseUrl:{type:String,default:""},h1:{type:Boolean,default:!1},type:{type:String,default:"posts"}},setup(l){const s=l,r=S(),c=k({items:[],page:1,perPage:s.perPage,totalItems:0,totalPages:0}),i=E(),y=async(u,n)=>{try{return await r.fetchCollection(s.type,u,n,"","-created","")}catch(t){return console.error("Error fetching posts:",t),{items:[],page:1,perPage:n,totalItems:0,totalPages:0}}};return Q(()=>i.query.page,async u=>{const n=u?parseInt(u,10):1;isNaN(n)||(c.value=await y(n,s.perPage))},{immediate:!0}),A(async()=>{const u=i.query.page?parseInt(i.query.page,10):1;c.value=await y(isNaN(u)?1:u,s.perPage)}),(u,n)=>{var $,T,U;const t=O,a=Ve,g=B,f=Me;return p(),h("div",Re,[l.title||l.description?(p(),b(t,{key:0,class:"pb-16",title:l.title,description:l.description,h1:l.h1},null,8,["title","description","h1"])):_("",!0),(T=($=e(c))==null?void 0:$.items)!=null&&T.length?(p(),b(a,{key:1,class:"flex w-full mt-6",content:e(c).items,baseUrl:l.baseUrl},null,8,["content","baseUrl"])):_("",!0),o("div",ze,[l.showMore?(p(),b(g,{key:0,to:"/blog/",class:"z-50 flex flex-row justify-end w-full cursor-pointer lg:pr-16 lg:w-2/3"},{default:m(()=>n[0]||(n[0]=[w(" View All Posts ")])),_:1})):_("",!0),l.showPagination?(p(),b(f,{key:1,"total-pages":(U=e(c))==null?void 0:U.totalPages},null,8,["total-pages"])):_("",!0)])])}}}),We=L(De,[["__scopeId","data-v-67f1c38f"]]);export{We as _};
