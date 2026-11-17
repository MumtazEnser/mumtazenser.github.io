/* Shared progressive enhancement. All factual content comes from /data/*.json. */
(() => {
  "use strict";
  const PLACEHOLDERS = new Set(["[BURAYA YAZ]", "[TR KARŞILIĞI?]"]);
  const lang = document.documentElement.lang === "tr" ? "tr" : "en";
  const isKnown = value => value !== null && value !== undefined &&
    (typeof value !== "string" || (value.trim() !== "" && !PLACEHOLDERS.has(value.trim())));
  const labels = {
    en: {published:"Published", "under review":"Under review",preprint:"Preprint","rejected-revising":"Rejected — revising",abstract:"Abstract",cite:"Cite",copied:"Copied",copyFailed:"Copy unavailable",preprint:"Preprint",pdf:"PDF",doi:"DOI",english:"English",all:"All",empty:"No entries match the filters.",year:"Year",status:"Status"},
    tr: {published:"Yayımlandı", "under review":"Değerlendirmede",preprint:"Ön baskı","rejected-revising":"Ret sonrası revizyonda",abstract:"Özet",cite:"Atıfı kopyala",copied:"Kopyalandı",copyFailed:"Kopyalanamadı",pdf:"PDF",doi:"DOI",english:"İngilizce",all:"Tümü",empty:"Filtreye uygun kayıt yok.",year:"Yıl",status:"Durum"}
  }[lang];
  const el = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = String(content);
    return node;
  };
  const append = (parent, ...children) => { children.filter(Boolean).forEach(child => parent.appendChild(child)); return parent; };
  const url = raw => {
    if (!isKnown(raw)) return null;
    try {
      const parsed = new URL(raw, location.origin);
      return ["https:", "http:", "mailto:"].includes(parsed.protocol) ? parsed.href : null;
    } catch { return null; }
  };
  const a = (text, href, cls) => {
    const safe = url(href);
    if (!safe) return null;
    const link = el("a", cls, text);
    link.href = safe;
    if (link.origin !== location.origin && link.protocol !== "mailto:") {
      link.target = "_blank"; link.rel = "noopener noreferrer";
    }
    return link;
  };
  const doiLink = paper => isKnown(paper.doi) ? url("https://doi.org/" + paper.doi.trim()) : null;
  const validPaper = p => p && isKnown(p.title) && isKnown(p.venue) &&
    isKnown(p.year) && Number.isInteger(Number(p.year)) &&
    ["published","under review","preprint","rejected-revising"].includes(p.status);
  const ordered = papers => papers.filter(validPaper).sort((a,b) =>
    Number(b.year) - Number(a.year) || a.title.localeCompare(b.title));
  const statusText = status => labels[status] || status;
  const addLinks = (parent, paper) => {
    const row = el("div", "paper-links");
    const doi = doiLink(paper);
    if (doi) append(row, a(labels.doi + ": " + paper.doi, doi));
    const preprint = url(paper.preprint_url), pdf = url(paper.pdf_url);
    if (preprint) append(row, a(labels.preprint, preprint));
    if (pdf) append(row, a(labels.pdf, pdf));
    for (const [field,title] of [["zenodo_url","Zenodo"],["philarchive_url","PhilArchive"],["philpapers_url","PhilPapers"]]) {
      const link = url(paper[field]);
      if (link && ![doi, preprint, pdf].includes(link)) append(row, a(title, link));
    }
    if (row.childNodes.length) append(parent,row);
  };
  const articleElement = (paper, small = false) => {
    const article = el("article",small ? "selected-paper" : "paper-entry");
    article.dataset.year = String(paper.year);
    article.dataset.status = paper.status;
    const meta = el("p","paper-meta",paper.venue + " · " + paper.year + " · " + statusText(paper.status));
    const heading = el(small ? "h3" : "h2","paper-title");
    const doi = doiLink(paper);
    append(heading,doi ? a(paper.title,doi) : el("span",null,paper.title));
    append(article,meta,heading);
    addLinks(article,paper);
    if (!small) {
      const abstract = isKnown(paper["abstract_" + lang]) ? paper["abstract_" + lang] : (lang==="tr" && isKnown(paper.abstract_en) ? paper.abstract_en : null);
      if (abstract) {
        const details = el("details","abstract-details");
        const summary = el("summary",null,labels.abstract);
        append(details,summary,el("p",null,abstract));
        if (lang==="tr" && !isKnown(paper.abstract_tr)) append(details,el("small","language-note",labels.english));
        append(article,details);
      }
      if (isKnown(paper.bibtex)) {
        const copy = el("button","cite-button",labels.cite);
        copy.type="button"; copy.dataset.bibtex=paper.bibtex;
        append(article,copy);
      }
    }
    return article;
  };
  const ld = papers => ({
    "@context":"https://schema.org", "@graph":papers.map(p => {
      const obj={"@type":"ScholarlyArticle",headline:p.title,author:{"@type":"Person",name:"Mümtaz Enser"}};
      if (isKnown(p.venue) && p.venue!=="Zenodo") obj.isPartOf={"@type":"Periodical",name:p.venue};
      if (p.status==="published") obj.datePublished=String(p.year);
      if (isKnown(p.doi)) { obj.identifier=p.doi; obj.url=doiLink(p); }
      if (isKnown(p.abstract_en)) obj.abstract=p.abstract_en;
      if (isKnown(p.keywords)) obj.keywords=p.keywords;
      return obj;
    })
  });
  const writeLD = papers => {
    const node=document.getElementById("papers-jsonld");
    if (node) node.textContent=JSON.stringify(ld(papers));
  };
  const buildPapers = papers => {
    const container=document.getElementById("papers-list");
    if (!container) return;
    const list=ordered(papers);
    container.replaceChildren();
    for (const paper of list) container.appendChild(articleElement(paper));
    writeLD(list);
    initFilters(list);
  };
  function initFilters(papers) {
    const controls=document.getElementById("paper-filters");
    if (!controls) return;
    const yearSelect=document.getElementById("filter-year"), statusSelect=document.getElementById("filter-status");
    if (!yearSelect || !statusSelect) return;
    const currentYear=yearSelect.value, currentStatus=statusSelect.value;
    yearSelect.replaceChildren(new Option(labels.all,"all"));
    [...new Set(papers.map(p=>String(p.year)))].sort((a,b)=>Number(b)-Number(a)).forEach(year=>yearSelect.add(new Option(year,year)));
    statusSelect.replaceChildren(new Option(labels.all,"all"));
    [...new Set(papers.map(p=>p.status))].forEach(status=>statusSelect.add(new Option(statusText(status),status)));
    if ([...yearSelect.options].some(o=>o.value===currentYear)) yearSelect.value=currentYear;
    if ([...statusSelect.options].some(o=>o.value===currentStatus)) statusSelect.value=currentStatus;
    const apply=()=>{
      let count=0;
      for (const item of document.querySelectorAll("#papers-list .paper-entry")) {
        const show=(yearSelect.value==="all"||item.dataset.year===yearSelect.value) &&
          (statusSelect.value==="all"||item.dataset.status===statusSelect.value);
        item.hidden=!show;if(show)count++;
      }
      const empty=document.getElementById("filter-empty");
      if(empty) empty.hidden=count!==0;
    };
    yearSelect.addEventListener("change",apply);
    statusSelect.addEventListener("change",apply);
    controls.hidden=false;
    apply();
  }
  const renderSelected = papers => {
    const slot=document.getElementById("selected-publications");
    if (!slot) return;
    const list=ordered(papers).filter(p=>p.featured===true);
    slot.replaceChildren(...list.map(p=>articleElement(p,true)));
    const section=document.getElementById("selected-section");
    if(section) section.hidden=list.length===0;
  };
  const renderSite = info => {
    if(!info) return;
    const thesis=info["thesis_"+lang], target=document.getElementById("thesis");
    if (target && isKnown(thesis)) { target.textContent=thesis;target.closest("section").hidden=false; }
    const grid=document.getElementById("concept-grid");
    if(!grid||!Array.isArray(info.concepts))return;
    // The untranslated marker is never displayed; preserve the original English concept term.
    const cards=info.concepts.filter(c=>isKnown(c.name_en));
    if (!cards.length) return;
    grid.replaceChildren(...cards.map(c=>{
      const card=el("article","concept-card");
      const name=lang==="tr" && isKnown(c.name_tr) ? c.name_tr : c.name_en;
      const description=isKnown(c["definition_"+lang]) ? c["definition_"+lang] : null;
      if (isKnown(c.image)) {
        const imageSrc=url(c.image);
        if(imageSrc) {
          const figure=el("figure","concept-art"), img=el("img");
          img.src=imageSrc;
          img.alt=isKnown(c["alt_"+lang])?c["alt_"+lang]:name;
          img.loading="lazy";
          img.decoding="async";
          img.width=1200;
          img.height=900;
          append(figure,img);
          append(card,figure);
        }
      }
      const body=el("div","concept-content");
      append(body,el("h3",null,name));
      if(description)append(body,el("p",null,description));
      append(body,a(lang==="tr"?"Kavramlar":"Concepts",lang==="tr"?"/tr/concepts/":c.url));
      append(card,body);
      return card;
    }));
    document.getElementById("concept-section").hidden=false;
  };
  const locale=lang==="tr"?"tr-TR":"en-GB";
  const dateText=value => {
    const parts=value.split("-").map(Number);
    if (parts.length!==3 || parts.some(Number.isNaN)) return value;
    return new Intl.DateTimeFormat(locale,{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(parts[0],parts[1]-1,parts[2])));
  };
  const validEvent=e=>e && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && isKnown(e.title) &&
    ["talk","news"].includes(e.type);
  const renderEvents=events=>{
    const past=document.getElementById("events-past"), upcoming=document.getElementById("events-upcoming");
    if (!past||!upcoming||!Array.isArray(events)) return;
    const current=new Date();
    const today=[current.getFullYear(),String(current.getMonth()+1).padStart(2,"0"),String(current.getDate()).padStart(2,"0")].join("-");
    const upcomingRecords=[], pastRecords=[];
    for(const ev of events.filter(validEvent).sort((a,b)=>a.date.localeCompare(b.date))){
      const category=ev.type==="talk" ? (lang==="tr"?"Konuşma":"Talk") : (lang==="tr"?"Haber":"News");
      const item=el("li","event-entry");
      const eventName=lang==="tr" && isKnown(ev.event_title_tr) ? ev.event_title_tr : ev.event_title_en;
      const title=lang==="tr" && isKnown(ev.title_tr) ? ev.title_tr : (isKnown(ev.title_en) ? ev.title_en : ev.title);
      const info=el("div","event-information");
      if(isKnown(eventName)) append(info,el("strong","event-name",eventName));
      append(info,el("span","event-title",title));
      // Only quote verbatim original-site English detail in the English rendering.
      if(lang==="en"){
        if(isKnown(ev.theme_en)) append(info,el("span","event-detail",ev.theme_en));
        if(isKnown(ev.speaker)) append(info,el("span","event-detail",ev.speaker));
        if(isKnown(ev.place)) append(info,el("span","event-detail",ev.place));
        if(isKnown(ev.adviser_en)) append(info,el("span","event-detail",ev.adviser_en));
      }
      const time=el("time",null,dateText(ev.date));time.dateTime=ev.date;
      append(item,time,info,el("span","event-type",category));
      (ev.date>today?upcomingRecords:pastRecords).push(item);
    }
    past.replaceChildren(...pastRecords.reverse());
    upcoming.replaceChildren(...upcomingRecords);
    document.getElementById("events-past-section").hidden=pastRecords.length===0;
    document.getElementById("events-upcoming-section").hidden=upcomingRecords.length===0;
    // The one-list static fallback is retained if JS is disabled or event data fails.
    const fallback=document.getElementById("events-all-section");
    if(fallback)fallback.hidden=true;
  };
  document.addEventListener("click",async event=>{
    const button=event.target.closest(".cite-button");
    if (!button||!isKnown(button.dataset.bibtex))return;
    try {await navigator.clipboard.writeText(button.dataset.bibtex);button.textContent=labels.copied;}
    catch {button.textContent=labels.copyFailed;}
  });
  const json=path=>fetch(path,{cache:"no-store"}).then(response=>{if(!response.ok)throw Error("Data unavailable");return response.json();});
  Promise.allSettled([json("/data/papers.json"),json("/data/events.json"),json("/data/site.json")]).then(results=>{
    if(results[0].status==="fulfilled"){buildPapers(results[0].value);renderSelected(results[0].value);}
    else initFilters([...document.querySelectorAll("#papers-list .paper-entry")].map(x=>({year:Number(x.dataset.year),status:x.dataset.status})));
    if(results[1].status==="fulfilled")renderEvents(results[1].value);
    if(results[2].status==="fulfilled")renderSite(results[2].value);
  });
})();