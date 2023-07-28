import{d as B,u as E,m as $,n as O,r as L,s as V,o as j,p as x,j as F,H as Q,q as P,b as r,c as u,f as e,w as I,F as m,h as z,x as n,I as _,e as l,J as S,A as v,t as c,K as k,L as b,M as g,N as U,O as y,Q as p,a as A,C as J,T as K,U as G,V as W}from"./index-f1976898.js";const a=h=>(K("data-v-fa24e866"),h=h(),G(),h),X={class:"checkout"},Y={class:"checkout__list mb-3 bg-gray-200"},Z={class:"flex px-6 py-2 items-center cartItem"},ee={class:"flex-1 flex items-center"},te=a(()=>e("div",{class:"w-full"}," 商品 ",-1)),se=a(()=>e("div",{class:"w-full"}," 單價 ",-1)),ie=a(()=>e("div",{class:"w-full"}," 數量 ",-1)),oe=a(()=>e("div",{class:"w-full"}," 總價 ",-1)),le=["src"],ae={class:"flex-1 flex items-center"},ne={class:"w-full"},ce={class:"w-full"},de={class:"w-full"},re={class:"w-full"},ue={class:"checkout__detail px-6 bg-gray-200"},_e={class:"checkout__item checkout__item--payment pb-3"},ve=a(()=>e("div",{class:"checkout__title text-lg -mx-6"}," 付款方式 ",-1)),pe={class:"checkout__content flex py-6"},me={class:"payment__item mr-4"},ye=["value"],he=a(()=>e("label",{class:"text-base",for:"PaymentCreditCard"},"信用卡",-1)),fe={class:"payment__item"},xe=["value"],be=a(()=>e("label",{class:"text-base",for:"PaymentCash"},"貨到付款",-1)),ge={class:"checkout__msg"},ke={class:"text-red-500"},Ce={class:"checkout__item checkout__item--invoice pb-3"},we=a(()=>e("div",{class:"checkout__title text-lg -mx-6"}," 發票 ",-1)),Ve={class:"checkout__content py-6"},Pe={class:"flex"},Ie={class:"invoice__item mr-4"},Se=["value"],Ue=a(()=>e("label",{class:"text-base",for:"InvoicePersonal"},"個人發票",-1)),De={class:"invoice__item"},Re=["value"],qe=a(()=>e("label",{class:"text-base",for:"InvoiceCompany"},"公司統編",-1)),He={class:"invoice__detail"},Me={key:0},Te=["value"],Ne=a(()=>e("label",{class:"text-base",for:"MemberCarrier"},"會員載具",-1)),Be=["value"],Ee=a(()=>e("label",{class:"text-base",for:"Barcode"},"手機條碼",-1)),$e={key:1},Oe=a(()=>e("label",{class:"text-base",for:"TaxId"},"公司統編：",-1)),Le={class:"checkout__msg"},je={class:"text-red-500"},Fe={class:"checkout__item checkout__item--delivery pb-3"},Qe=a(()=>e("div",{class:"checkout__title text-lg -mx-6"}," 配送方式 ",-1)),ze={class:"checkout__content py-6"},Ae={class:"flex"},Je={class:"delivery__item mr-4"},Ke=["value"],Ge=a(()=>e("label",{class:"text-base",for:"DeliveryHome"},"宅配",-1)),We={class:"delivery__item"},Xe=["value"],Ye=a(()=>e("label",{class:"text-base",for:"DeliveryConvenienceStore"},"超商取貨",-1)),Ze={class:"delivery__detail"},et={class:"checkout__msg"},tt={class:"text-red-500"},st={class:"checkout__item checkout__item--recipient pb-3"},it=a(()=>e("div",{class:"checkout__title text-lg -mx-6"}," 收件資訊 ",-1)),ot={class:"checkout__content py-6"},lt={class:"delivery__item"},at={class:"mb-4"},nt=a(()=>e("label",{class:"text-base",for:"RecipientName"},"收件人：",-1)),ct=a(()=>e("label",{class:"text-base",for:"RecipientPhone"},"行動電話：",-1)),dt={class:"checkout__msg"},rt={class:"text-red-500"},ut={class:"checkout__item checkout__item--result pb-3 border-t-2 border-gray-300"},_t={class:"flex flex-col items-end"},vt={class:"flex"},pt=a(()=>e("h3",null,"商品總金額：",-1)),mt={class:"flex"},yt=a(()=>e("h3",null,"運費總金額：",-1)),ht={class:"flex"},ft=a(()=>e("h3",null,"訂單總金額：",-1)),xt=B({__name:"CheckoutView",setup(h){const D=E(),R=$(),q=O(),C=L(D.mobile),{isLogin:H,user:M}=V(R),{cart:T}=V(q),f=T.value.filter(o=>o.isCheck);j(()=>{H.value||x.push({name:"login"}),f.length===0&&x.replace({name:"cart"})});const t=F({products:f,totalPrice:f.reduce((o,s)=>o+s.price*s.quantity,0),totalQuantity:f.length,payment:0,invoice:{type:0,value:{type:0,value:""}},delivery:{type:0,address:"",cost:0},recipient:{name:"",phone:""},member:M.value});Q(()=>t.delivery.type,o=>{t.delivery.cost=o===p.Home?120:60});const w=P(()=>{const o=t.totalPrice,s=t.delivery.cost;return o+s}),d=P(()=>{const o={products:{status:!1,message:""},payment:{status:!1,message:""},invoice:{status:!1,message:""},delivery:{status:!1,message:""},recipient:{status:!1,message:""}};return(!t.products.length||t.products.filter(s=>s.quantity<=0).length||t.products.filter(s=>!s.onSell).length)&&(o.products.status=!0,o.products.message="沒有可結帳的商品"),t.payment||(o.payment.status=!0,o.payment.message="請選擇付款方式"),t.invoice.type?t.invoice.value.value||(o.invoice.status=!0,o.invoice.message="請輸入發票詳細資料"):(o.invoice.status=!0,o.invoice.message="請選擇發票類型"),t.delivery.type?t.delivery.type===p.ConvenienceStore&&!t.delivery.address?(o.delivery.status=!0,o.delivery.message="請輸入取貨門市"):t.delivery.type===p.Home&&!t.delivery.address&&(o.delivery.status=!0,o.delivery.message="請輸入收件地址"):(o.delivery.status=!0,o.delivery.message="請選擇取貨方式"),t.recipient.name?t.recipient.phone||(o.recipient.status=!0,o.recipient.message="請輸入收件人電話"):(o.recipient.status=!0,o.recipient.message="請輸入收件人姓名"),{result:o,isValid:!Object.values(o).some(s=>s.status)}}),N=async()=>{t.totalPrice=w.value;const{isValid:o}=d.value;if(!o){alert("請填寫訂單資訊");return}try{const s=await A.createOrder(t);await x.push({name:"checkoutResult",query:{orderId:s.data.orderId,isSuccess:"true"}})}catch{await x.push({name:"checkoutResult",query:{orderId:0,isSuccess:"false"}})}};return(o,s)=>(r(),u("div",X,[e("div",Y,[e("div",Z,[e("div",ee,[e("div",{class:I(["w-20 flex-none",[C.value?"mr-0":"mr-10"]])},null,2),te,se,ie,oe])]),(r(!0),u(m,null,z(t.products,i=>(r(),u("div",{class:"flex px-6 py-4 items-center cartItem",key:i.productId},[e("div",{class:I(["w-20 h-20 flex-none",[C.value?"mr-0":"mr-10"]])},[e("img",{src:i.image?i.image:l(J),alt:"",class:"w-full h-full"},null,8,le)],2),e("div",ae,[e("div",ne,c(i.name),1),e("div",ce," $"+c(i.price),1),e("div",de,c(i.quantity),1),e("div",re," $"+c(i.price*i.quantity),1)])]))),128))]),e("div",ue,[e("form",null,[e("div",_e,[ve,e("div",pe,[e("div",me,[n(e("input",{"onUpdate:modelValue":s[0]||(s[0]=i=>t.payment=i),value:l(S).CreditCard,type:"radio",name:"payment",id:"PaymentCreditCard"},null,8,ye),[[_,t.payment]]),he]),e("div",fe,[n(e("input",{"onUpdate:modelValue":s[1]||(s[1]=i=>t.payment=i),value:l(S).Cash,type:"radio",name:"payment",id:"PaymentCash"},null,8,xe),[[_,t.payment]]),be])]),n(e("div",ge,[e("span",ke,c(l(d).result.payment.message),1)],512),[[v,l(d).result.payment.status]])]),e("div",Ce,[we,e("div",Ve,[e("div",Pe,[e("div",Ie,[n(e("input",{"onUpdate:modelValue":s[2]||(s[2]=i=>t.invoice.type=i),value:l(k).Personal,type:"radio",name:"Invoice",id:"InvoicePersonal"},null,8,Se),[[_,t.invoice.type]]),Ue]),e("div",De,[n(e("input",{"onUpdate:modelValue":s[3]||(s[3]=i=>t.invoice.type=i),value:l(k).Company,type:"radio",name:"Invoice",id:"InvoiceCompany"},null,8,Re),[[_,t.invoice.type]]),qe])]),n(e("div",He,[t.invoice.type===l(k).Personal?(r(),u("div",Me,[n(e("input",{"onUpdate:modelValue":s[4]||(s[4]=i=>t.invoice.value.type=i),value:l(b).member,type:"radio",name:"PersonalInvoice",id:"MemberCarrier"},null,8,Te),[[_,t.invoice.value.type]]),Ne,n(e("input",{"onUpdate:modelValue":s[5]||(s[5]=i=>t.invoice.value.type=i),value:l(b).barcode,type:"radio",name:"PersonalInvoice",id:"Barcode"},null,8,Be),[[_,t.invoice.value.type]]),Ee,n(e("div",null,[t.invoice.value.type===l(b).member?(r(),u(m,{key:0},[g(" 中獎發票寄送地址： ")],64)):t.invoice.value.type===l(b).barcode?(r(),u(m,{key:1},[g(" 手機條碼： ")],64)):U("",!0),n(e("input",{class:"rounded w-full h-8 px-3 py-2 focus:outline-none",type:"text","onUpdate:modelValue":s[6]||(s[6]=i=>t.invoice.value.value=i)},null,512),[[y,t.invoice.value.value]])],512),[[v,t.invoice.value.type]])])):(r(),u("div",$e,[Oe,n(e("input",{class:"rounded w-full h-6 px-3 py-4 focus:outline-none","onUpdate:modelValue":s[7]||(s[7]=i=>t.invoice.value.value=i),type:"text",name:"TaxId",id:"TaxId"},null,512),[[y,t.invoice.value.value]])]))],512),[[v,t.invoice.type]])]),n(e("div",Le,[e("span",je,c(l(d).result.invoice.message),1)],512),[[v,l(d).result.invoice.status]])]),e("div",Fe,[Qe,e("div",ze,[e("div",Ae,[e("div",Je,[n(e("input",{"onUpdate:modelValue":s[8]||(s[8]=i=>t.delivery.type=i),value:l(p).Home,type:"radio",name:"delivery",id:"DeliveryHome"},null,8,Ke),[[_,t.delivery.type]]),Ge]),e("div",We,[n(e("input",{"onUpdate:modelValue":s[9]||(s[9]=i=>t.delivery.type=i),value:l(p).ConvenienceStore,type:"radio",name:"delivery",id:"DeliveryConvenienceStore"},null,8,Xe),[[_,t.delivery.type]]),Ye])]),n(e("div",Ze,[t.delivery.type===l(p).Home?(r(),u(m,{key:0},[g(" 宅配地址： ")],64)):t.delivery.type===l(p).ConvenienceStore?(r(),u(m,{key:1},[g(" 取貨超商： ")],64)):U("",!0),n(e("input",{class:"rounded w-full h-8 px-3 py-2 focus:outline-none",type:"text","onUpdate:modelValue":s[10]||(s[10]=i=>t.delivery.address=i)},null,512),[[y,t.delivery.address]])],512),[[v,t.delivery.type]])]),n(e("div",et,[e("span",tt,c(l(d).result.delivery.message),1)],512),[[v,l(d).result.delivery.status]])]),e("div",st,[it,e("div",ot,[e("div",lt,[e("div",at,[nt,n(e("input",{class:"rounded w-full h-8 px-3 py-2 focus:outline-none","onUpdate:modelValue":s[11]||(s[11]=i=>t.recipient.name=i),type:"text",id:"RecipientName"},null,512),[[y,t.recipient.name]])]),e("div",null,[ct,n(e("input",{class:"rounded w-full h-8 px-3 py-2 focus:outline-none","onUpdate:modelValue":s[12]||(s[12]=i=>t.recipient.phone=i),type:"tel",id:"RecipientPhone"},null,512),[[y,t.recipient.phone]])])])]),n(e("div",dt,[e("span",rt,c(l(d).result.recipient.message),1)],512),[[v,l(d).result.recipient.status]])]),e("div",ut,[e("div",_t,[e("div",vt,[pt,e("div",null,"$ "+c(t.totalPrice),1)]),e("div",mt,[yt,e("div",null,"$ "+c(t.delivery.cost),1)]),e("div",ht,[ft,e("div",null,"$ "+c(l(w)),1)]),e("div",null,[e("button",{class:"rounded bg-gray-700 text-white p-2",type:"button",onClick:N},"下訂單")])])])])])]))}});const gt=W(xt,[["__scopeId","data-v-fa24e866"]]);export{gt as default};