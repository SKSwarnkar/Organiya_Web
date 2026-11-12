import {initInquiry,syncInquiry} from './inquiry.js';
import {products,site,state,setState,setContent,readState,product,esc} from './runtime.js';
import {photo,link,emailPanel} from './components.js';
import {momentPanel} from './pages/home.js';
import {renderProducts} from './pages/catalog.js';
import {galleryClick,bindGallery} from './gallery.js';
setContent(JSON.parse(document.getElementById('site-content').textContent));setState(readState());
document.body.classList.replace('no-js','js');document.querySelectorAll('[data-enhancement]').forEach(e=>e.hidden=false);
let searchTerm='';const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.classList.toggle('menu-open',open)});
function contactContext(){const p=product();const aside=document.querySelector('.contact-product');if(aside)aside.innerHTML=photo(p)+`<div><p class="eyebrow">YOUR PRODUCT INTEREST</p><h2>${esc(p.name)}</h2>${link('catalog','Explore other snacks ↗','quiet-link')}</div>`;document.querySelectorAll('select[name=product]').forEach(e=>e.value=p.slug);document.querySelectorAll('[data-audience]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.audience===state.audience)));}
function updateQuery(){const q=new URLSearchParams(location.search);if(state.page==='catalog'){if(state.category==='All snacks')q.delete('category');else q.set('category',state.category);}if(state.page==='contact'){q.set('product',state.product);if(state.audience==='business')q.set('audience','business');else q.delete('audience');}history.replaceState(null,'',location.pathname+(q.size?'?'+q:''));}
function filterState(){document.querySelectorAll('[data-filter]').forEach(e=>{e.setAttribute('aria-pressed',String(e.dataset.filter===state.category));e.classList.toggle('selected',e.dataset.filter===state.category)});renderProducts(searchTerm);updateQuery();}
if(state.page==='catalog')filterState();if(state.page==='contact'||state.page==='distributors')contactContext();initInquiry();syncInquiry(state.page==='distributors'||state.audience==='business');bindGallery();
document.addEventListener('click',async e=>{
 if(state.page==='product'&&galleryClick(e))return;
 const m=e.target.closest('[data-moment]');if(m){document.querySelectorAll('[data-moment]').forEach(b=>b.setAttribute('aria-pressed',String(b===m)));document.getElementById('moment-panel').innerHTML=momentPanel(m.dataset.moment);return;}
 const filter=e.target.closest('[data-filter]');if(filter){state.category=filter.dataset.filter;filterState();return;}
 if(e.target.closest('[data-clear-search],[data-reset-search]')){searchTerm='';if(e.target.closest('[data-reset-search]'))state.category='All snacks';document.getElementById('product-search').value='';filterState();document.getElementById('product-search').focus();return;}
 const audience=e.target.closest('[data-audience]');if(audience){state.audience=audience.dataset.audience;syncInquiry(state.audience==='business');contactContext();updateQuery();return;}
});
document.getElementById('product-search')?.addEventListener('input',e=>{searchTerm=e.target.value;renderProducts(searchTerm)});
document.addEventListener('change',e=>{if(e.target.matches('select[name=product]')&&products.some(p=>p.slug===e.target.value)){state.product=e.target.value;contactContext();updateQuery();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){menu.click();menu.focus()}if(e.key===' '&&e.target.matches('a[data-gallery]')){e.preventDefault();e.target.click()}});
