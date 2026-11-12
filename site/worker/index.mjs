import {handleInquiry} from './handler.mjs';
import catalog from '../content/products.json';
export {InquiryGuard} from './guard.mjs';
const products=Object.fromEntries(catalog.map(p=>[p.slug,p.name]));
export default {fetch(request,env){return handleInquiry(request,env,{products});}};
