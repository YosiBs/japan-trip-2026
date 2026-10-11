(() => {
  'use strict';
  const types={all:['הכל','✦'],city:['ערים ואזורים','⌖'],attraction:['אטרקציות','🎡'],food:['מסעדות','🍜'],hotel:['לינה','🏨'],transport:['תחבורה','🚆']};
  const statuses={confirmed:'הוזמן / אושר',planned:'מתוכנן',idea:'רעיון לביקור',pending:'שולם · ממתין לאישור'};
  const $=s=>document.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const d=s=>new Date(s+'T12:00:00');
  const iso=x=>[x.getFullYear(),String(x.getMonth()+1).padStart(2,'0'),String(x.getDate()).padStart(2,'0')].join('-');
  const fmt=s=>s?new Intl.DateTimeFormat('he-IL',{day:'numeric',month:'long'}).format(d(s)):'';
  const weekday=s=>new Intl.DateTimeFormat('he-IL',{weekday:'short'}).format(d(s));
  const dateText=e=>e.startDate?(e.endDate&&e.endDate!==e.startDate?fmt(e.startDate)+' – '+fmt(e.endDate):fmt(e.startDate)):(e.dateNote||'התאריך טרם נקבע');
  const safeUrl=x=>{try{const u=new URL(x);return /^https?:$/.test(u.protocol)?u.href:null}catch{return null}};
  let trip,events=[],days=[],map,markers;
  const f={category:'all',city:'all',query:'',day:null};
  const el={chips:$('#category-filters'),city:$('#city-filter'),search:$('#search-input'),days:$('#day-strip'),timeline:$('#timeline'),dialog:$('#event-dialog'),grid:$('.content-grid')};
  const match=(e,day=true)=>(f.category==='all'||e.category===f.category)&&(f.city==='all'||e.city===f.city)&&(!f.query||[e.title,e.city,e.location,e.description].join(' ').toLocaleLowerCase().includes(f.query))&&(!day||!f.day||(e.startDate&&e.startDate<=f.day&&(e.endDate||e.startDate)>=f.day));
  function chips(){el.chips.innerHTML=Object.entries(types).filter(([k])=>k==='all'||events.some(e=>e.category===k)).map(([k,v])=>'<button class="chip '+(f.category===k?'active':'')+'" type="button" data-cat="'+k+'" aria-pressed="'+(f.category===k)+'"><span>'+v[1]+'</span>'+v[0]+'</button>').join('');el.chips.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>{f.category=b.dataset.cat;render()})}
  function dateButtons(){let last=-1;el.days.innerHTML=days.map(s=>{const m=d(s).getMonth();const divider=last>=0&&m!==last?'<span class="month-divider">נוב׳</span>':'';last=m;const active=events.some(e=>e.startDate&&e.startDate<=s&&(e.endDate||e.startDate)>=s&&match(e,false));return divider+'<button type="button" class="day '+(f.day===s?'active ':'')+(active?'has-event':'')+'" data-day="'+s+'" aria-pressed="'+(f.day===s)+'"><span class="weekday">'+esc(weekday(s))+'</span><span class="daynum">'+d(s).getDate()+'</span><span class="daydot"></span></button>'}).join('');el.days.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{f.day=f.day===b.dataset.day?null:b.dataset.day;render()})}
  function card(e){return '<button type="button" class="event-card" data-event="'+esc(e.id)+'"><span class="event-icon '+esc(e.category)+'">'+(types[e.category]?.[1]||'📍')+'</span><span class="event-copy"><span class="event-heading"><strong>'+esc(e.title)+'</strong><span class="event-arrow">↖</span></span><span class="event-meta"><span>⌖ '+esc(e.city||e.location||'יפן')+'</span><span class="event-status '+esc(e.status)+'">'+(statuses[e.status]||'מתוכנן')+'</span></span><span class="event-description">'+esc(dateText(e))+(e.time?' · '+esc(e.time):'')+'</span></span></button>'}
  function timeline(rows){$('#visible-count').textContent=rows.length+' '+(rows.length===1?'מקום':'מקומות');if(!rows.length){el.timeline.innerHTML='<div class="empty-state"><span class="empty-icon">🗓️</span><strong>אין עדיין תוכניות כאן</strong><p>אפשר לבחור תאריך או סינון אחר.</p></div>';return}const grouped=new Map();rows.forEach(e=>{const key=f.day||e.startDate||'undated';if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(e)});el.timeline.innerHTML=[...grouped].sort(([a],[b])=>a==='undated'?1:b==='undated'?-1:a.localeCompare(b)).map(([k,list])=>'<section class="date-section"><div class="date-label">'+(k==='undated'?'רעיונות בלי תאריך':esc(weekday(k)+' · '+fmt(k)))+'</div>'+list.sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')).map(card).join('')+'</section>').join('');el.timeline.querySelectorAll('[data-event]').forEach(b=>b.onclick=()=>show(events.find(e=>e.id===b.dataset.event)))}
  // Country geometry © Natural Earth / johan/world.geo.json (public domain).
  // Render only Japan rather than using world basemap tiles with Japanese labels.
  const japanGeometry={"type":"MultiPolygon","coordinates":[[[[134.638428,34.149234],[134.766379,33.806335],[134.203416,33.201178],[133.79295,33.521985],[133.280268,33.28957],[133.014858,32.704567],[132.363115,32.989382],[132.371176,33.463642],[132.924373,34.060299],[133.492968,33.944621],[133.904106,34.364931],[134.638428,34.149234]]],[[[140.976388,37.142074],[140.59977,36.343983],[140.774074,35.842877],[140.253279,35.138114],[138.975528,34.6676],[137.217599,34.606286],[135.792983,33.464805],[135.120983,33.849071],[135.079435,34.596545],[133.340316,34.375938],[132.156771,33.904933],[130.986145,33.885761],[132.000036,33.149992],[131.33279,31.450355],[130.686318,31.029579],[130.20242,31.418238],[130.447676,32.319475],[129.814692,32.61031],[129.408463,33.296056],[130.353935,33.604151],[130.878451,34.232743],[131.884229,34.749714],[132.617673,35.433393],[134.608301,35.731618],[135.677538,35.527134],[136.723831,37.304984],[137.390612,36.827391],[138.857602,37.827485],[139.426405,38.215962],[140.05479,39.438807],[139.883379,40.563312],[140.305783,41.195005],[141.368973,41.37856],[141.914263,39.991616],[141.884601,39.180865],[140.959489,38.174001],[140.976388,37.142074]]],[[[143.910162,44.1741],[144.613427,43.960883],[145.320825,44.384733],[145.543137,43.262088],[144.059662,42.988358],[143.18385,41.995215],[141.611491,42.678791],[141.067286,41.584594],[139.955106,41.569556],[139.817544,42.563759],[140.312087,43.333273],[141.380549,43.388825],[141.671952,44.772125],[141.967645,45.551483],[143.14287,44.510358],[143.910162,44.1741]]]]};
  const japanBounds=[[29.8,128.2],[46.6,146.8]];
  const englishCities=[
    {name:'Sapporo',lat:43.0618,lng:141.3545,major:true},
    {name:'Sendai',lat:38.2682,lng:140.8694},
    {name:'Tokyo',lat:35.6762,lng:139.6503,major:true},
    {name:'Nagoya',lat:35.1815,lng:136.9066},
    {name:'Kanazawa',lat:36.5613,lng:136.6562},
    {name:'Kyoto',lat:35.0116,lng:135.7681},
    {name:'Osaka',lat:34.6937,lng:135.5023,major:true},
    {name:'Nara',lat:34.6851,lng:135.8048},
    {name:'Kobe',lat:34.6901,lng:135.1955},
    {name:'Hiroshima',lat:34.3853,lng:132.4553,major:true},
    {name:'Fukuoka',lat:33.5902,lng:130.4017,major:true},
    {name:'Kagoshima',lat:31.5966,lng:130.5571}
  ];
  let englishCityLayer;
  function showJapan(){if(map)map.fitBounds(japanBounds,{padding:[18,24],maxZoom:5.75,animate:false})}
  function refreshEnglishLabels(){
    if(!map||!englishCityLayer)return;
    englishCityLayer.clearLayers();
    const detailed=map.getZoom()>=6.3;
    englishCities.filter(c=>detailed||c.major).forEach(c=>{
      const icon=L.divIcon({
        className:'map-city-icon',
        html:'<div class="map-city-label '+(c.major?'featured':'')+'"><span class="map-city-dot"></span><span class="map-city-name" lang="en">'+esc(c.name)+'</span></div>',
        iconSize:[110,20],iconAnchor:[3,6]
      });
      L.marker([c.lat,c.lng],{icon,interactive:false,keyboard:false,zIndexOffset:-300})
        .addTo(englishCityLayer);
    });
  }
  function initMap(){
    if(!window.L){$('#map').hidden=true;$('#map-fallback').hidden=false;return}
    map=L.map('map',{
      scrollWheelZoom:false,zoomControl:false,attributionControl:false,
      minZoom:3,maxZoom:9,zoomSnap:0.25,
      maxBounds:[[25.0,122.0],[48.5,151.5]],maxBoundsViscosity:0.85
    });
    L.control.zoom({position:'bottomleft'}).addTo(map);
    L.control.attribution({prefix:false,position:'bottomright'})
      .addAttribution('Outline: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a>')
      .addTo(map);
    L.geoJSON({type:'Feature',properties:{name:'Japan'},geometry:japanGeometry},{
      interactive:false,
      style:{className:'japan-land',color:'#8facac',weight:1.5,fillColor:'#fffef7',fillOpacity:1}
    }).addTo(map);
    englishCityLayer=L.layerGroup().addTo(map);
    markers=L.layerGroup().addTo(map);
    map.on('zoomend',refreshEnglishLabels);
    showJapan();
    refreshEnglishLabels();
    setTimeout(()=>map.invalidateSize(),80);
  }
  function drawMap(rows){
    if(!map)return;
    markers.clearLayers();
    const bounds=[];
    rows.filter(e=>Number.isFinite(e.coordinates?.lat)&&Number.isFinite(e.coordinates?.lng)).forEach(e=>{
      const p=[e.coordinates.lat,e.coordinates.lng];
      bounds.push(p);
      const icon=L.divIcon({
        className:'custom-marker',
        html:'<div class="map-marker '+esc(e.category)+'">'+(types[e.category]?.[1]||'📍')+'</div>',
        iconSize:[40,40],iconAnchor:[20,20]
      });
      const marker=L.marker(p,{icon,zIndexOffset:350}).addTo(markers);
      marker.bindPopup('<div dir="rtl"><div class="popup-title">'+esc(e.title)+'</div><div class="popup-city" lang="en">'+esc(e.cityEnglish||e.city||'Japan')+'</div><button class="popup-open" type="button">פרטים נוספים ←</button></div>');
      marker.on('popupopen',()=>marker.getPopup().getElement()?.querySelector('button')?.addEventListener('click',()=>show(e)));
    });
    const focused=f.city!=='all'||!!f.day||!!f.query;
    if(!focused||!bounds.length){showJapan()}
    else if(bounds.length===1){map.setView(bounds[0],7.3,{animate:false})}
    else{map.fitBounds(bounds,{padding:[65,70],maxZoom:7.3,animate:false})}
  }
  function show(e){
    if(!e)return;
    const facts=[['תאריך',dateText(e)],['שעה',e.time||'טרם נקבעה'],['עיר',e.city||'לא צוינה'],['מיקום',e.location||'טרם נוסף']];
    const links=[...(e.links||[])];
    // The map pins are approximate for most places. Always navigate using the
    // full address first; never substitute an approximate latitude/longitude.
    const google=e.location
      ?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(e.location)
      :e.coordinates
        ?'https://www.google.com/maps/search/?api=1&query='+e.coordinates.lat+'%2C'+e.coordinates.lng
        :null;
    if(google&&!links.some(l=>l.url?.includes('google.com/maps')))links.unshift({label:'ניווט ב-Google Maps',url:google});
    const details=Array.isArray(e.details)?e.details:[];
    const detailRows=details.length?'<section class="event-details"><h3>מידע נוסף</h3>'+details.map(item=>
      '<div class="event-detail-row"><span>'+esc(item.label||'פרט')+'</span><strong>'+esc(item.value||'—')+'</strong></div>'
    ).join('')+'</section>':'';
    const warning=e.warning?'<div class="event-warning" role="note"><strong>⚠ חשוב לבדוק לפני הנסיעה</strong><p>'+esc(e.warning)+'</p></div>':'';
    const approximate=e.geoAccuracy==='approximate'?'<p class="approximate-note">⌖ הסמן במפה מציג מיקום משוער. לניווט השתמשו בכתובת המלאה.</p>':'';
    $('#dialog-content').innerHTML=
      '<div class="dialog-icon">'+(types[e.category]?.[1]||'📍')+'</div>'+
      '<span class="dialog-kicker">JAPAN 2026 · TRIP DETAIL</span>'+
      '<h2 class="dialog-title" id="dialog-title">'+esc(e.title)+'</h2>'+
      '<div class="dialog-tags"><span class="dialog-tag">'+esc(types[e.category]?.[0]||'מקום')+'</span>'+
      '<span class="dialog-tag">'+esc(statuses[e.status]||'מתוכנן')+'</span></div>'+
      '<p class="dialog-description">'+esc(e.description||'עדיין לא הוספנו תיאור.')+'</p>'+
      warning+
      '<div class="dialog-facts">'+facts.map(([k,v])=>
        '<div class="dialog-fact"><small>'+esc(k)+'</small><strong>'+esc(v)+'</strong></div>'
      ).join('')+'</div>'+
      detailRows+approximate+
      '<div class="dialog-links">'+links.map((l,i)=>{
        const url=safeUrl(l.url);
        return url?'<a class="dialog-link '+(i?'secondary':'')+'" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(l.label||'פתיחת קישור')+' ↗</a>':'';
      }).join('')+'</div>';
    if(!el.dialog.open)el.dialog.showModal();
  }
  function render(){const rows=events.filter(e=>match(e));chips();dateButtons();timeline(rows);drawMap(rows)}
  function clear(){f.category='all';f.city='all';f.query='';f.day=null;el.city.value='all';el.search.value='';render()}
  function mobile(view){el.grid.dataset.mobileView=view;['timeline','map'].forEach(k=>{const b=$('#mobile-'+k);b.classList.toggle('active',k===view);b.setAttribute('aria-pressed',String(k===view))});if(view==='map'&&map)setTimeout(()=>map.invalidateSize(),80);if(innerWidth<=700)el.grid.scrollIntoView({behavior:'smooth',block:'start'})}
  async function start(){try{const res=await fetch('./data/itinerary.json',{cache:'no-store'});if(!res.ok)throw Error('HTTP '+res.status);const data=await res.json();trip=data.trip;events=Array.isArray(data.events)?data.events:[];for(let current=d(trip.startDate),end=d(trip.endDate);current<=end&&days.length<100;current.setDate(current.getDate()+1))days.push(iso(current));$('#stat-days').textContent=days.length;$('#stat-cities').textContent=new Set(events.map(e=>e.city).filter(Boolean)).size;$('#stat-events').textContent=events.length;const cities=[...new Set(events.map(e=>e.city).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'he'));el.city.innerHTML='<option value="all">כל הערים</option>'+cities.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('');el.city.onchange=e=>{f.city=e.target.value;render()};el.search.oninput=e=>{f.query=e.target.value.trim().toLocaleLowerCase();render()};$('#show-all-days').onclick=()=>{f.day=null;render()};$('#reset-filters').onclick=clear;$('#map-reset').onclick=clear;$('#dialog-close').onclick=()=>el.dialog.close();el.dialog.onclick=e=>{if(e.target===el.dialog)el.dialog.close()};$('#mobile-timeline').onclick=()=>mobile('timeline');$('#mobile-map').onclick=()=>mobile('map');el.grid.dataset.mobileView='timeline';initMap();render()}catch(err){console.error(err);el.timeline.innerHTML='<div class="empty-state"><strong>לא ניתן לטעון את תוכנית הטיול</strong><p>נסו לרענן את הדף.</p></div>';$('#map').hidden=true;$('#map-fallback').hidden=false}}
  start();
})();