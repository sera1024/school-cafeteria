import { crawl } from '../../../lib/crawler.js';
import {weekStart} from '../../../lib/week.js';
export const runtime='nodejs';
export async function GET(request){const date=new URL(request.url).searchParams.get('date');if(date!==null){try{weekStart(date);}catch(e){return Response.json({error:e.message},{status:400});}}try{return Response.json(await crawl(date),{headers:{'Cache-Control':'public, s-maxage=1800'}});}catch(e){return Response.json({error:e.message,source:'https://www.korea.ac.kr/ko/505/subview.do'},{status:502});}}
