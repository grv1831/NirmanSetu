// src/pages/FindLabour.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const BASE = 'https://nirmansetu-api.onrender.com';
import WorkerCard from '../components/WorkerCard';
import Footer from '../components/Footer';

const DIST = {
  "Andhra Pradesh":["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Kadapa","Tirupati","Anantapur","Eluru","Ongole","Rajahmundry","Srikakulam","Vizianagaram","Chittoor","Prakasam"],
  "Arunachal Pradesh":["Itanagar","Naharlagun","Pasighat","Tezpur","Bomdila","Ziro","Along","Tezu","Khonsa","Aalo"],
  "Assam":["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon","Dhubri","Goalpara","Karimganj","Sivasagar","Lakhimpur","Barpeta","Mangaldoi"],
  "Bihar":["Patna","Gaya","Muzaffarpur","Bhagalpur","Darbhanga","Purnia","Arrah","Begusarai","Munger","Chapra","Hajipur","Sasaram","Bettiah","Motihari","Samastipur","Sitamarhi","Supaul","Kishanganj","Katihar","Nawada"],
  "Chhattisgarh":["Raipur","Bhilai","Bilaspur","Korba","Rajnandgaon","Durg","Jagdalpur","Ambikapur","Raigarh","Dhamtari","Mahasamund","Kanker","Kondagaon","Kawardha","Janjgir"],
  "Goa":["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem","Sanquelim","Cuncolim","Quepem"],
  "Gujarat":["Ahmedabad","Surat","Vadodara","Rajkot","Gandhinagar","Bhavnagar","Jamnagar","Junagadh","Anand","Nadiad","Mehsana","Morbi","Surendranagar","Bharuch","Navsari","Valsad","Patan","Dahod","Godhra","Amreli"],
  "Haryana":["Gurugram","Faridabad","Ambala","Panipat","Rohtak","Karnal","Sonipat","Yamunanagar","Hisar","Panchkula","Bhiwani","Sirsa","Fatehabad","Jhajjar","Rewari","Mahendragarh","Palwal","Mewat","Kurukshetra","Kaithal"],
  "Himachal Pradesh":["Shimla","Mandi","Dharamsala","Solan","Kullu","Hamirpur","Una","Chamba","Bilaspur","Kangra","Sirmaur","Kinnaur","Lahaul","Spiti","Nahan"],
  "Jharkhand":["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh","Giridih","Ramgarh","Phusro","Medininagar","Chaibasa","Dumka","Pakur","Sahibganj","Garhwa","Lohardaga","Khunti","Simdega","Latehar","Chatra"],
  "Karnataka":["Bengaluru","Mysuru","Hubli","Mangaluru","Belagavi","Davangere","Ballari","Vijayapura","Shivamogga","Tumkur","Raichur","Bidar","Kalaburagi","Hassan","Dharwad","Udupi","Chitradurga","Mandya","Chikkamagaluru","Kodagu"],
  "Kerala":["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Alappuzha","Palakkad","Malappuram","Kannur","Kasaragod","Kottayam","Idukki","Wayanad","Pathanamthitta","Ernakulam"],
  "Madhya Pradesh":["Bhopal","Indore","Gwalior","Jabalpur","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa","Murwara","Singrauli","Burhanpur","Khandwa","Bhind","Chhindwara","Guna","Shivpuri","Vidisha","Chhatarpur"],
  "Maharashtra":["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Thane","Kolhapur","Amravati","Nanded","Sangli","Malegaon","Jalgaon","Akola","Latur","Dhule","Ahmednagar","Chandrapur","Parbhani","Ichalkaranji"],
  "Manipur":["Imphal","Thoubal","Bishnupur","Churachandpur","Senapati","Ukhrul","Chandel","Tamenglong","Jiribam","Moreh"],
  "Meghalaya":["Shillong","Tura","Jowai","Nongstoin","Baghmara","Resubelpara","Nongpoh","Mairang","Mawkyrwat","Ampati"],
  "Mizoram":["Aizawl","Lunglei","Champhai","Kolasib","Serchhip","Lawngtlai","Mamit","Saiha","Hnahthial","Saitual"],
  "Nagaland":["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto","Mon","Phek","Kiphire","Longleng"],
  "Odisha":["Bhubaneswar","Cuttack","Berhampur","Rourkela","Sambalpur","Puri","Balasore","Bhadrak","Kendujhar","Koraput","Jharsuguda","Bargarh","Angul","Dhenkanal","Balangir","Rayagada","Mayurbhanj","Jagatsinghpur","Jajpur","Khordha"],
  "Punjab":["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Hoshiarpur","Mohali","Pathankot","Moga","Firozpur","Gurdaspur","Fatehgarh Sahib","Faridkot","Mansa","Muktsar","Nawanshahr","Ropar","Sangrur","Tarn Taran","Kapurthala"],
  "Rajasthan":["Jaipur","Jodhpur","Udaipur","Kota","Bikaner","Ajmer","Alwar","Barmer","Sikar","Churu","Bharatpur","Bhilwara","Hanumangarh","Jhunjhunu","Nagaur","Pali","Sawai Madhopur","Sirohi","Tonk","Bundi"],
  "Sikkim":["Gangtok","Namchi","Mangan","Gyalshing","Ravangla","Jorethang","Nayabazar","Singtam","Rangpo","Rongli"],
  "Tamil Nadu":["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Tiruppur","Vellore","Erode","Thoothukudi","Dindigul","Thanjavur","Ranipet","Sivakasi","Karur","Udhagamandalam","Hosur","Nagercoil","Kanchipuram","Kumarapalayam"],
  "Telangana":["Hyderabad","Warangal","Nizamabad","Khammam","Karimnagar","Ramagundam","Mahabubnagar","Nalgonda","Adilabad","Suryapet","Miryalaguda","Siddipet","Mancherial","Jagtial","Nirmal"],
  "Tripura":["Agartala","Dharmanagar","Udaipur","Kailasahar","Belonia","Khowai","Ambassa","Sonamura","Sabroom","Amarpur"],
  "Uttar Pradesh":["Lucknow","Agra","Varanasi","Kanpur","Gorakhpur","Meerut","Noida","Ghaziabad","Bareilly","Allahabad","Jhansi","Mathura","Aligarh","Moradabad","Saharanpur","Firozabad","Lakhimpur Kheri","Bahraich","Azamgarh","Rampur","Shahjahanpur","Farrukhabad","Mau","Hapur","Etawah","Mirzapur","Bulandshahr","Sambhal","Amroha","Hardoi","Fatehpur","Raebareli","Orai","Sitapur","Barabanki","Muzaffarnagar","Sahaswan","Mainpuri","Etah","Deoria","Gonda","Ballia","Unnao","Sultanpur","Rae Bareli","Jaunpur","Banda","Pilibhit","Bijnor"],
  "Uttarakhand":["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Kotdwar","Ramnagar","Pithoragarh","Almora","Tehri","Chamoli","Uttarkashi","Bageshwar"],
  "West Bengal":["Kolkata","Howrah","Darjeeling","Siliguri","Asansol","Durgapur","Bardhaman","Malda","Cooch Behar","Jalpaiguri","Raiganj","Balurghat","Krishnanagar","Haldia","Medinipur","Bankura","Purulia","Alipurduar","Birbhum","Murshidabad"],
  "Delhi":["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"],
  "Jammu & Kashmir":["Srinagar","Jammu","Anantnag","Baramulla","Sopore","Kathua","Udhampur","Rajauri","Punch","Doda","Kupwara","Ganderbal","Kulgam","Shopian","Bandipora"],
  "Ladakh":["Leh","Kargil","Nubra","Zanskar","Drass","Sankoo","Diskit","Padum","Turtuk","Khalsi"],
  "Andaman & Nicobar":["Port Blair","Rangat","Diglipur","Car Nicobar","Campbell Bay","Mayabunder","Ferrargunj","Bamboo Flat","Neil Island","Havelock Island"],
  "Chandigarh":["Chandigarh","Manimajra","Dhanas","Palsora","Bapu Dham","Mauli Jagran","Burail","Hallomajra","Daria","Maloya"],
  "Dadra & Nagar Haveli":["Silvassa","Amli","Khanvel","Naroli","Sayli","Dadra","Rakholi","Dudhani","Khadoli","Bindrabin"],
  "Daman & Diu":["Daman","Diu","Moti Daman","Vapi","Nani Daman","Dholar","Kadaiya","Ringanwada","Bhimpore","Kachigam"],
  "Lakshadweep":["Kavaratti","Agatti","Amini","Andrott","Bitra","Chetlat","Kadmat","Kalpeni","Kiltan","Minicoy"],
  "Puducherry":["Puducherry","Karaikal","Mahe","Yanam","Ozhukarai","Villianur","Ariyankuppam","Nettapakkam","Bahour","Mannadipet"],
};

const SKILLS = ['Mason','Electrician','Plumber','Carpenter','Painter','Helper','Welder','Tiling'];
const STATES = Object.keys(DIST);

const sel = {
  width:'100%',padding:'.5rem .7rem',border:'1.5px solid #E0D0B8',
  borderRadius:7,fontFamily:"'Sora',sans-serif",fontSize:'.78rem',
  color:'#1A120A',background:'#FDF3E3',cursor:'pointer',
};
const inp = { ...sel };
const lbl = { display:'block',fontSize:'.62rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'#7A6652',marginBottom:'.28rem' };

export default function FindLabour() {
  const [workers, setWorkers] = useState([]);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [page,    setPage]    = useState(1);

  const [filters, setFilters] = useState({
    state:'', district:'', village:'', skill:'',
    maxRate:'', available:'', sort:'rating',
  });

  const fetchWorkers = useCallback(async (f = filters, p = page) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12, sort: f.sort };
      if (f.state)     params.state     = f.state;
      if (f.district)  params.district  = f.district;
      if (f.village)   params.village   = f.village;
      if (f.skill)     params.skill     = f.skill;
      if (f.maxRate)   params.maxRate   = f.maxRate;
      if (f.available) params.available = f.available;

      const res = await axios.get(`${BASE}/api/workers`, { params });
      setWorkers(res.data.data || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch { setWorkers([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchWorkers(filters, 1); }, []);

  const set = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  const applyFilters = () => { setPage(1); fetchWorkers(filters, 1); };
  const clearFilters = () => {
    const def = { state:'',district:'',village:'',skill:'',maxRate:'',available:'',sort:'rating' };
    setFilters(def); setPage(1); fetchWorkers(def, 1);
  };
  const goPage = (p) => { setPage(p); fetchWorkers(filters, p); window.scrollTo(0,0); };

  const activeChips = [
    filters.state && { label: filters.state },
    filters.district && { label: filters.district },
    filters.village && { label: filters.village },
    filters.skill && { label: filters.skill },
    filters.maxRate && { label: `Up to ₹${filters.maxRate}` },
    filters.available === 'true' && { label: 'Available Now' },
  ].filter(Boolean);

  return (
    <div style={{ paddingTop: 62, fontFamily:"'Sora',sans-serif", minHeight:'100vh', background:'#FAFAF7' }}>

      {/* Top Header + Filters */}
      <div style={{ background:'#1C2833', padding:'2rem 2.5rem 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <h2 style={{ fontSize:'1.6rem',fontWeight:900,color:'#fff',letterSpacing:'-.03em',marginBottom:'.2rem' }}>Find Labour / कारीगर खोजें</h2>
          <p style={{ fontSize:'.78rem',color:'rgba(255,255,255,.4)',marginBottom:'1.5rem',fontFamily:"'Noto Sans Devanagari',sans-serif" }}>Browse verified workers — filter by location, skill, rate & availability</p>

          {/* Filter Bar */}
          <div style={{ background:'#fff',borderRadius:'12px 12px 0 0',padding:'1.2rem 1.5rem',display:'flex',flexWrap:'wrap',gap:'.8rem',alignItems:'flex-end' }}>
            {/* State */}
            <div style={{ display:'flex',flexDirection:'column',gap:'.28rem',flex:1,minWidth:120 }}>
              <label style={lbl}>State / राज्य</label>
              <select style={sel} value={filters.state} onChange={e => { set('state',e.target.value); set('district',''); }}>
                <option value="">All States</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {/* District */}
            <div style={{ display:'flex',flexDirection:'column',gap:'.28rem',flex:1,minWidth:120 }}>
              <label style={lbl}>District / जिला</label>
              <select style={sel} value={filters.district} onChange={e => set('district',e.target.value)}>
                <option value="">All Districts</option>
                {(DIST[filters.state] || []).map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            {/* Village */}
            <div style={{ display:'flex',flexDirection:'column',gap:'.28rem',flex:1,minWidth:120 }}>
              <label style={lbl}>Village / Area</label>
              <input style={inp} type="text" placeholder="e.g. Rampur village" value={filters.village} onChange={e => set('village',e.target.value)} />
            </div>
            {/* Skill */}
            <div style={{ display:'flex',flexDirection:'column',gap:'.28rem',flex:1,minWidth:120 }}>
              <label style={lbl}>Work Type / काम</label>
              <select style={sel} value={filters.skill} onChange={e => set('skill',e.target.value)}>
                <option value="">All Skills</option>
                {SKILLS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {/* Rate */}
            <div style={{ display:'flex',flexDirection:'column',gap:'.28rem',flex:1,minWidth:110 }}>
              <label style={lbl}>Max Rate (₹/day)</label>
              <select style={sel} value={filters.maxRate} onChange={e => set('maxRate',e.target.value)}>
                <option value="">Any Rate</option>
                <option value="400">Up to ₹400</option>
                <option value="600">Up to ₹600</option>
                <option value="800">Up to ₹800</option>
                <option value="1000">Up to ₹1000</option>
              </select>
            </div>
            {/* Availability */}
            <div style={{ display:'flex',flexDirection:'column',gap:'.28rem',flex:1,minWidth:110 }}>
              <label style={lbl}>Availability</label>
              <select style={sel} value={filters.available} onChange={e => set('available',e.target.value)}>
                <option value="">Any</option>
                <option value="true">Available Now</option>
                <option value="false">Busy</option>
              </select>
            </div>
            {/* Buttons */}
            <button onClick={applyFilters} style={{ padding:'.52rem 1.4rem',background:'#C0392B',color:'#fff',border:'none',borderRadius:7,fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.78rem',cursor:'pointer',alignSelf:'flex-end',boxShadow:'2px 2px 0 #7B241C' }}>Search</button>
            <button onClick={clearFilters} style={{ padding:'.52rem 1rem',background:'transparent',border:'1.5px solid #E0D0B8',color:'#7A6652',borderRadius:7,fontFamily:"'Sora',sans-serif",fontWeight:600,fontSize:'.75rem',cursor:'pointer',alignSelf:'flex-end' }}>Clear</button>
          </div>

          {/* Active Chips */}
          <div style={{ padding:'.7rem 1.5rem',background:'#fff',borderTop:'1px solid #E0D0B8',display:'flex',gap:'.5rem',flexWrap:'wrap',alignItems:'center',fontSize:'.7rem',color:'#7A6652' }}>
            {activeChips.length ? (
              <>
                <span>Filters:</span>
                {activeChips.map(c => (
                  <span key={c.label} style={{ background:'#F5E6C8',border:'1px solid #E0D0B8',color:'#C0392B',fontWeight:600,fontSize:'.68rem',padding:'.22rem .6rem',borderRadius:999 }}>{c.label}</span>
                ))}
              </>
            ) : <span>No filters active — showing all workers</span>}
          </div>
        </div>
      </div>

      {/* Results Body */}
      <div style={{ maxWidth:1200,margin:'0 auto',padding:'1.5rem 2.5rem 3rem' }}>
        {/* Meta */}
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.2rem' }}>
          <div style={{ fontSize:'.82rem',fontWeight:600,color:'#7A6652' }}>
            Showing <strong style={{ color:'#C0392B' }}>{total}</strong> workers
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:'.5rem',fontSize:'.75rem',color:'#7A6652' }}>
            Sort by:
            <select style={{ ...sel,width:'auto',padding:'.3rem .6rem' }} value={filters.sort} onChange={e => { set('sort',e.target.value); setTimeout(applyFilters,0); }}>
              <option value="rating">Rating ↓</option>
              <option value="rate-low">Rate: Low to High</option>
              <option value="rate-high">Rate: High to Low</option>
              <option value="exp">Experience ↓</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign:'center',padding:'4rem',color:'#7A6652' }}>Loading workers…</div>
        ) : workers.length === 0 ? (
          <div style={{ textAlign:'center',padding:'4rem',color:'#7A6652' }}>
            <div style={{ fontSize:'3rem',marginBottom:'1rem' }}>🔍</div>
            <p>No workers found. Try broader filters.</p>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.2rem' }}>
            {workers.map(w => <WorkerCard key={w._id} worker={w} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display:'flex',justifyContent:'center',gap:'.5rem',marginTop:'2rem' }}>
            {page > 1 && <button onClick={() => goPage(page-1)} style={{ width:36,height:36,borderRadius:7,border:'1.5px solid #E0D0B8',background:'#fff',cursor:'pointer' }}>‹</button>}
            {Array.from({ length: pages }, (_,i) => i+1).map(p => (
              <button key={p} onClick={() => goPage(p)} style={{ width:36,height:36,borderRadius:7,border:'1.5px solid #E0D0B8',background:p===page?'#C0392B':'#fff',color:p===page?'#fff':'#7A6652',fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'.78rem',cursor:'pointer' }}>{p}</button>
            ))}
            {page < pages && <button onClick={() => goPage(page+1)} style={{ width:36,height:36,borderRadius:7,border:'1.5px solid #E0D0B8',background:'#fff',cursor:'pointer' }}>›</button>}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
