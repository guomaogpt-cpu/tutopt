/** Readable bookmarklet source — collects listing data from an open Lalafo (or other) page. */
export function buildLalafoPageCollectorScript(adminImportUrl: string): string {
  return `(function(){
  var adminUrl=${JSON.stringify(adminImportUrl)};
  function meta(name){
    var n=document.querySelector('meta[property="'+name+'"],meta[name="'+name+'"]');
    return n?n.getAttribute('content'):null;
  }
  var h1El=document.querySelector('h1');
  var h1=h1El?h1El.textContent.trim():null;
  var bodyText=(document.body&&document.body.innerText)?document.body.innerText.slice(0,50000):'';
  var images=[];
  document.querySelectorAll('img[src]').forEach(function(img){
    var src=img.getAttribute('src');
    if(src&&/^https?:/.test(src)&&!/logo|icon|avatar|svg|favicon/i.test(src)) images.push(src);
  });
  document.querySelectorAll('picture source[srcset]').forEach(function(source){
    var srcset=source.getAttribute('srcset');
    if(!srcset) return;
    var first=srcset.split(',')[0].trim().split(/\\s+/)[0];
    if(first&&/^https?:/.test(first)&&!/logo|icon|avatar|svg/i.test(first)) images.push(first);
  });
  var priceMatch=bodyText.match(/(\\d[\\d\\s\\u00A0]{2,8})(?:\\s*(?:KGS|сом|USD|\\$|€))/i);
  var negotiable=/договорн/i.test(bodyText)?'Договорная':null;
  var description=meta('og:description')||meta('description');
  if(!description){
    var labels=document.querySelectorAll('dt,th,label,span,div,h2,h3');
    for(var i=0;i<labels.length;i++){
      if(/^описание$/i.test((labels[i].textContent||'').trim())){
        var sibling=labels[i].nextElementSibling;
        var text=sibling?sibling.textContent.trim():'';
        if(text.length>20){ description=text; break; }
      }
    }
  }
  var host=location.hostname;
  var platform=/lalafo\\.(kg|com|uz|az)/i.test(host)?'LALAFO':'WEBSITE';
  var city=location.pathname.indexOf('/bishkek/')>=0?'Бишкек':null;
  var payload={
    sourceUrl:location.href,
    sourcePlatform:platform,
    pageTitle:document.title,
    bodyText:bodyText,
    extracted:{
      title:h1||meta('og:title')||null,
      price:priceMatch?priceMatch[0].trim():negotiable,
      currency:/lalafo\\.kg/i.test(host)?'KGS':undefined,
      description:description,
      city:city,
      images:images.slice(0,10)
    }
  };
  var json=JSON.stringify(payload,null,2);
  function done(){
    try{ window.open(adminUrl,'_blank'); }catch(e){}
    alert('JSON скопирован. Вставьте его на странице импорта ВсеТут.');
  }
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(json).then(done).catch(function(){
      prompt('Скопируйте JSON:',json);
      done();
    });
  }else{
    prompt('Скопируйте JSON:',json);
    done();
  }
})();`;
}

export function buildLalafoBookmarkletHref(adminImportUrl: string): string {
  const script = buildLalafoPageCollectorScript(adminImportUrl);
  return `javascript:${encodeURIComponent(script)}`;
}

export const BOOKMARKLET_LABEL = "Импорт во ВсеТут";
