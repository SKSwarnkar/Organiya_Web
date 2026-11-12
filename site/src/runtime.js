export let products=[],site={},copy={},inquiries={},snackMoments=[],categories=[],media={},state={};
export const validPages=['home','catalog','product','about','distributors','contact','privacy','notfound','retired'];
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const lines=a=>a.map(esc).join('<br>');
export const heading=a=>a.map(x=>x.emphasis?`<em>${esc(x.text)}</em>`:esc(x.text)).join('<br>');
export const arrow='<span aria-hidden="true">↗</span>';
export const product=()=>products.find(p=>p.slug===state.product)||products[0];
export function setState(value){state=value;}
export function setContent(data){({products,site,pages:copy,media,inquiries}=data);categories=site.categories;snackMoments=copy.moments;}
export function pathFor(page,slug){return ({home:'/',catalog:'/snacks/',about:'/our-story/',distributors:'/distributors/',contact:'/contact/',privacy:'/privacy/',notfound:'/404.html',retired:'/range-update/'})[page]||'/snacks/'+slug+'/';}
export function url(page,extra={}){let p=extra.product||state.product||products[0]?.slug;let q=new URLSearchParams();if(page==='contact'&&extra.product)q.set('product',extra.product);for(const key of ['purpose','scope','cta'])if(extra[key])q.set(key,extra[key]);return pathFor(page,p)+(q.size?'?'+q:'');}
export function readState(){const q=new URLSearchParams(location.search);let page=document.body.dataset.page,slug=document.body.dataset.product;return {design:'o',page,product:products.some(p=>p.slug===q.get('product'))?q.get('product'):slug||products[0].slug,category:categories.includes(q.get('category'))?q.get('category'):'All snacks'};}
export function notifyParent(){} // Shared templates also run at build time; no iframe dependency.
export function imageSize(src){const m=media[src];return m?`width="${m.width}" height="${m.height}"`:'';}
export function imageRatio(src){const m=media[src];return m?`${m.width}/${m.height}`:'auto';}
export function imageSources(src,sizes='(max-width: 700px) 100vw, 50vw'){const m=media[src];return m?.variants?`srcset="${m.variants.map(v=>'/assets/'+v.file+' '+v.width+'w').join(', ')}" sizes="${sizes}"`:'';}
