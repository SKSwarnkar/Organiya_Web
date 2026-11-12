import fs from 'node:fs';import path from 'node:path';import sharp from 'sharp';
export async function validate(){
 const data=Object.fromEntries(['site','products','pages','media','inquiries'].map(k=>[k,JSON.parse(fs.readFileSync('content/'+k+'.json','utf8'))]));const {site,products,pages}=data;
 if(site.launchPhase!=='upcoming'||site.commerceEnabled!==false)throw Error('This release supports upcoming catalog only; commerce requires a separate implementation.');
 if(site.mode!=='production'||site.contactMode!=='form'||!/^https:\/\//.test(site.canonicalOrigin)||Object.hasOwn(site,'email'))throw Error('Invalid production site settings');
 if(site.inquiry?.endpoint!=='/api/inquiry'||!/^0x[\w-]+$/.test(site.inquiry?.siteKey||''))throw Error('Missing production inquiry configuration');
 const seen=new Set();
 for(const p of products){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||seen.has(p.slug))throw Error('Invalid or duplicate slug');seen.add(p.slug);if(p.status!=='upcoming'||p.sku!==null||p.price!==null||p.claims.length||p.detailsApproved)throw Error('Upcoming product exposes sale-ready facts: '+p.slug);if(!p.name||!p.description||!p.gallery?.length)throw Error('Incomplete product: '+p.slug);const m=await sharp(path.join('assets',p.image)).metadata();if(Math.abs(m.width/m.height-.8)>.008)throw Error('Card image must be composed at 4:5: '+p.image);for(const g of p.gallery){if(!g.alt||!g.label||!g.caption||!['approved','illustrative'].includes(g.status))throw Error('Incomplete gallery record');if(g.status==='illustrative'&&!['styled','pairing','lifestyle'].includes(g.kind))throw Error('Illustrative packaging/label image is forbidden');}}
 const assets=new Set([...products.flatMap(p=>[p.image,...p.gallery.map(g=>g.src)]),pages.home.image+'.webp',pages.story.image+'.webp',...pages.story.occasions.map(o=>o.image+'.webp'),site.logo,site.mark,site.productLogo]);
 for(const f of assets){if(!/^[a-z0-9._-]+$/.test(f)||!fs.existsSync(path.join('assets',f)))throw Error('Missing or invalid asset '+f);}
 if(products.length!==6)throw Error('Expected six upcoming product introductions.');return{data,assets};
}
if(process.argv[1]?.endsWith('/validate.mjs')){const r=await validate();console.log(`Validated ${r.data.products.length} upcoming products and ${r.assets.size} source assets.`);}
