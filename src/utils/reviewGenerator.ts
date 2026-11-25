export interface ReviewGeneratorParams {
  clinicName: string;
  category: string;
  serviceReceived?: string | null;
  doctorName?: string | null;
}

function normalizeCategory(category: string): string {
  const cat = category.toLowerCase().replace(/[-_]/g, ' ');
  if (cat.includes('ortho') || cat.includes('bone') || cat.includes('joint')) return 'Orthopedics';
  if (cat.includes('pedia') || cat.includes('child')) return 'Pediatrics';
  if (cat.includes('dermatol') || cat.includes('skin')) return 'Dermatology';
  if (cat.includes('ivf') || cat.includes('fertil')) return 'IVF';
  if (cat.includes('gynec') || cat.includes('matern') || cat.includes('women')) return 'Gynecology';
  if (cat.includes('dent')) return 'Dentist';
  if (cat.includes('lab') || cat.includes('diagnost') || cat.includes('pathol')) return 'Laboratory';
  if (cat.includes('hosp') || cat.includes('general')) return 'General Hospital';
  return category;
}

function formatServicePhrase(service?: string | null): string {
  if (!service) return '';
  let s = service.trim();
  if (s.toLowerCase().startsWith('other:')) {
    s = s.substring(6).trim();
  }
  if (!s) return '';
  const rawParts = s.split(',').map(p => p.trim()).filter(Boolean);
  const formatted = rawParts.map(part => {
    const l = part.toLowerCase();
    if (l === 'newborn & infant care') return 'newborn and infant care';
    if (l === 'child vaccination') return "our child's vaccination";
    if (l === 'growth & nutrition') return 'child growth and nutrition';
    if (l === 'fever & infection care') return 'fever and infection care';
    if (l === 'asthma & allergy care') return 'asthma and allergy care';
    if (l === 'child health checkup') return 'a routine child checkup';
    if (l === 'general pediatric consultation') return 'pediatric consultation';
    if (l === 'joint & knee pain') return 'joint and knee pain';
    if (l === 'fracture care') return 'fracture care';
    if (l === 'spine & back care') return 'spine and back care';
    if (l === 'arthritis treatment') return 'arthritis care';
    if (l === 'sports injury') return 'a sports injury';
    if (l === 'bone density check') return 'a bone density check';
    if (l === 'general orthopedic consultation') return 'orthopedic consultation';
    if (l === 'full body checkup') return 'a full body checkup';
    if (l === 'health packages') return 'a comprehensive health checkup package';
    if (l === 'blood tests') return 'blood tests';
    if (l === 'urine tests') return 'urine tests';
    if (l === 'thyroid profile') return 'a thyroid profile test';
    if (l === 'diabetes tests') return 'diabetes testing';
    if (l === 'lipid profile') return 'a lipid profile test';
    if (l === 'liver function test') return 'a liver function test';
    if (l === 'kidney function test') return 'a kidney function test';
    if (l === 'hormone tests') return 'hormone tests';
    if (l === 'vitamin tests') return 'vitamin tests';
    if (l === 'microbiology tests') return 'microbiology tests';
    if (l === 'pathology tests') return 'pathology tests';
    if (l === 'ecg test') return 'an ECG test';
    if (l === 'x-ray') return 'an X-ray';
    if (l === 'ultrasound scan') return 'an ultrasound scan';
    if (l === 'sample collection at home') return 'home sample collection';
    return part.toLowerCase();
  });

  let joined = '';
  if (formatted.length === 1) joined = formatted[0];
  else if (formatted.length === 2) joined = `${formatted[0]} and ${formatted[1]}`;
  else joined = `${formatted.slice(0, -1).join(', ')}, and ${formatted[formatted.length - 1]}`;

  return joined ? ` for ${joined}` : '';
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const CATEGORY_SEO_TEMPLATES: Record<string, { openers: string[]; middles: string[]; closers: string[] }> = {
  'Dermatology': {
    openers: [
      "I recently visited {clinicName}{servicePhrase} and I am beyond impressed with the care I received.",
      "If you are searching for the best dermatologist, {clinicName} is definitely the place to go{servicePhrase}.",
      "Had an exceptional experience with the skin specialists at {clinicName}{servicePhrase}!",
      "Consulting the dermatology department at {clinicName}{servicePhrase} was one of the best healthcare choices I have made.",
      "I cannot recommend {clinicName} enough for anyone seeking advanced skin or cosmetic care{servicePhrase}.",
      "Visiting {clinicName}{servicePhrase} gave me visible improvements and completely restored my skin confidence.",
      "From the moment I walked into {clinicName}{servicePhrase}, the medical care and attention to detail were top-notch.",
      "I booked an appointment at {clinicName}{servicePhrase} after hearing great reviews, and they truly exceeded all expectations.",
      "Hands down the top skin care clinic in the area — {clinicName} takes dermatology care to the next level.",
      "My experience at {clinicName}{servicePhrase} was smooth, professional, and gave me incredible results.",
      "I have been consulting {clinicName}{servicePhrase} and their standard of care is consistently world-class.",
      "Choosing {clinicName}{servicePhrase} for my skin care was an absolute game changer."
    ],
    middles: [
      "The dermatologists took the time to diagnose my skin condition accurately, explaining the treatment plan with immense clarity and patience.",
      "The clinic is spotlessly clean, fully hygienic, and equipped with the latest advanced skin laser and cosmetology technology.",
      "The doctor was extremely gentle, knowledgeable, and genuinely focused on long-term skin health rather than quick fixes.",
      "Every procedure was handled with absolute precision, zero discomfort, and utmost care by the skin specialist team.",
      "Their personalized treatment approach delivered noticeable, glowing results much faster than I anticipated.",
      "The nursing staff and reception were polite, welcoming, and ensured there was no unnecessary waiting time.",
      "The clinical expertise here is unmatched, and they answered all my queries regarding aftercare and daily skincare routines.",
      "They maintain top-tier sterilization standards and use evidence-based dermatological methods that actually work.",
      "The pricing was completely transparent and the doctors recommended only what was genuinely beneficial for my skin.",
      "I was particularly impressed by their thorough examination and gentle touch throughout the session."
    ],
    closers: [
      "Easily the best skin specialist and dermatology clinic in town — 5 stars all the way for {clinicName}!",
      "I highly recommend {clinicName} to anyone looking for genuine, lasting skin solutions and compassionate care.",
      "A fantastic dermatology hospital that puts patient satisfaction first. Thank you, {clinicName}!",
      "Will definitely continue visiting {clinicName} for all my future skin and aesthetic treatments.",
      "If you want healthy, clear, glowing skin, look no further than {clinicName}.",
      "Top-notch dermatologist with outstanding results. Truly the highest standard of skin care!",
      "10/10 recommendation for {clinicName} — easily the most trusted skin clinic around.",
      "Grateful to the entire dermatology team at {clinicName} for their dedication and fantastic service."
    ]
  },
  'Laboratory': {
    openers: [
      "I visited {clinicName}{servicePhrase} and the entire diagnostic testing experience was completely seamless.",
      "If you need an accurate and reliable diagnostic laboratory, {clinicName} is second to none.",
      "Had a great experience getting my lab tests done at {clinicName}{servicePhrase}.",
      "{clinicName} is by far the most professional diagnostic center and pathology lab I have ever visited{servicePhrase}.",
      "I chose {clinicName}{servicePhrase} based on strong recommendations and I was thoroughly impressed.",
      "Getting tests done at {clinicName}{servicePhrase} was quick, organized, and stress-free.",
      "My experience with the laboratory team at {clinicName}{servicePhrase} was exceptionally smooth from check-in to report delivery.",
      "Hands down the top diagnostic center in the city — {clinicName} sets a high benchmark for pathology services.",
      "I regularly rely on {clinicName}{servicePhrase} for routine health checkups and they never disappoint.",
      "Visiting {clinicName}{servicePhrase} proved that diagnostic tests can be quick, comfortable, and painless.",
      "Highly impressed with the punctuality and hygiene at {clinicName}{servicePhrase}.",
      "Superb diagnostic testing facility at {clinicName}{servicePhrase} with attentive and skilled technicians."
    ],
    middles: [
      "The phlebotomist was remarkably skilled and made the blood collection completely painless and comfortable.",
      "I received my accurate diagnostic test reports well within the promised timeframe with detailed parameters.",
      "The laboratory is impeccably clean, follows strict hygiene protocols, and uses modern automated diagnostic equipment.",
      "The reception and technician staff were courteous, answered all my preparation questions, and processed my tests without delays.",
      "The sample collection was handled with great care, maintaining proper labeling and sterile procedures throughout.",
      "Their home sample collection and lab reporting system is fast, convenient, and very well-organized.",
      "The test pricing is reasonable, transparent, and offers great value for comprehensive health packages.",
      "The diagnostic accuracy and prompt digital report dispatch via WhatsApp/email made the whole process effortless.",
      "Every staff member was patient, reassuring, and handled the testing with utmost professionalism.",
      "The diagnostic machinery is modern and the lab environment feels calm, sterile, and welcoming."
    ],
    closers: [
      "Easily the best diagnostic laboratory and pathology center around — 5 stars for {clinicName}!",
      "I strongly recommend {clinicName} to anyone seeking timely, reliable, and accurate lab reports.",
      "A dependable diagnostic center with wonderful staff. Thank you, {clinicName}!",
      "Will always choose {clinicName} for all future blood tests, health packages, and diagnostic needs.",
      "Top-notch diagnostic laboratory with prompt service and painless blood sample collection. 10/10!",
      "Unbeatable service and accuracy. {clinicName} is truly the most trusted lab in town.",
      "A seamless 5-star testing experience from start to finish at {clinicName}!",
      "Heartfelt thanks to {clinicName} for their prompt delivery of accurate test reports."
    ]
  },
  'IVF': {
    openers: [
      "Our experience at {clinicName}{servicePhrase} has been filled with genuine warmth, empathy, and hope.",
      "If you are looking for the best fertility center, {clinicName} is undoubtedly the most compassionate choice.",
      "We are immensely grateful to the fertility doctors and embryology team at {clinicName}{servicePhrase}.",
      "Choosing {clinicName}{servicePhrase} was the best decision we made for our parenthood journey.",
      "From our very first fertility consultation at {clinicName}{servicePhrase}, we felt supported at every single step.",
      "The reproductive specialists at {clinicName}{servicePhrase} provided clear guidance with utmost medical excellence.",
      "We had an incredibly positive experience with the IVF team at {clinicName}{servicePhrase}.",
      "Hands down the top IVF hospital in the region — {clinicName} combines cutting-edge fertility technology with deep empathy.",
      "Consulting {clinicName}{servicePhrase} gave us clarity, reassurance, and confidence throughout our treatment.",
      "The fertility specialists at {clinicName} are true experts who genuinely care about their patients' dreams."
    ],
    middles: [
      "The doctors explained every stage of the treatment with complete transparency, warmth, and realistic optimism.",
      "The fertility clinic features state-of-the-art embryology labs, clean private consultation rooms, and strict confidentiality.",
      "The nursing staff and coordinators were always available to answer our medication questions and provided immense emotional comfort.",
      "Their personalized protocol and advanced reproductive technologies gave us the highest confidence in our treatment.",
      "We never felt rushed; the specialists patiently addressed all our medical history and fertility options.",
      "The holistic approach, continuous monitoring, and empathetic environment made a world of difference to our journey.",
      "Their high success rates and ethical medical practices make them stand out as premier fertility experts.",
      "The team made what can be a stressful process feel manageable, safe, and positive throughout."
    ],
    closers: [
      "Easily the best IVF center and fertility hospital — 5/5 stars for {clinicName}!",
      "We wholeheartedly recommend {clinicName} to every couple aspiring to start or grow their family.",
      "A beacon of hope with world-class fertility doctors. Thank you, {clinicName}!",
      "Forever grateful to {clinicName} for their unmatched expertise and compassionate guidance.",
      "The most caring and experienced fertility specialists you could ever ask for. 10/10 for {clinicName}!",
      "Top-tier reproductive medical care with genuine heart. Highly recommend {clinicName}."
    ]
  },
  'Gynecology': {
    openers: [
      "I had a wonderful experience at {clinicName}{servicePhrase} and felt completely safe and well-cared for.",
      "If you are looking for the best gynecologist and women's health care, {clinicName} is the top choice.",
      "The obstetrics and gynecology team at {clinicName}{servicePhrase} is simply outstanding.",
      "Consulting the doctors at {clinicName}{servicePhrase} was an incredibly reassuring and positive experience.",
      "I highly recommend {clinicName}{servicePhrase} for compassionate, expert maternity and women's healthcare.",
      "From the warm reception to the thorough medical checkup, {clinicName}{servicePhrase} exceeded all expectations.",
      "My visit to {clinicName}{servicePhrase} was handled with great professionalism and deep empathy.",
      "Hands down the best maternity hospital and gynecology clinic in the city — {clinicName} is exceptional.",
      "I have been visiting {clinicName}{servicePhrase} and the care is always 5-star.",
      "Exceptional care for women at {clinicName}{servicePhrase} with a truly dedicated medical staff."
    ],
    middles: [
      "The gynecologist listened attentively to all my concerns, respected my comfort, and explained everything gently.",
      "The hospital maintains impeccable hygiene, private examination rooms, and a welcoming atmosphere.",
      "The nursing staff was so supportive, gentle during examinations, and attentive to every patient need.",
      "They prioritize patient privacy, clinical safety, and evidence-based women's healthcare at every step.",
      "The ultrasound scanning and routine tests were done smoothly without long waiting times.",
      "Their comprehensive prenatal guidance and caring nature provided great peace of mind throughout.",
      "The doctors are approachable, highly experienced, and make you feel completely at ease discussing sensitive issues.",
      "Everything from registration to doctor consultation was organized efficiently and cordially."
    ],
    closers: [
      "Easily the best gynecologist and maternity hospital around — 5 stars for {clinicName}!",
      "I strongly recommend {clinicName} to all women seeking trustworthy, compassionate gynecological care.",
      "A hospital that truly understands women's healthcare needs. Thank you, {clinicName}!",
      "Will definitely continue recommending {clinicName} to all my family and friends.",
      "Outstanding medical care, gentle doctors, and clean facilities. 10/10 for {clinicName}!",
      "The most supportive and skilled gynecology specialists in town. Highly recommended!"
    ]
  },
  'Dentist': {
    openers: [
      "I had a fantastic, completely painless experience at {clinicName}{servicePhrase}!",
      "If you are nervous about dental visits, {clinicName} is the absolute best dental clinic to visit.",
      "Consulting the dental surgeons at {clinicName}{servicePhrase} was the best healthcare decision for my smile.",
      "Had a seamless dental appointment at {clinicName}{servicePhrase} with zero discomfort.",
      "I cannot praise {clinicName} enough for their gentle dental care and modern clinical setup{servicePhrase}.",
      "Visiting {clinicName}{servicePhrase} changed my whole perspective on dental treatments.",
      "Hands down the top dentist and dental hospital in town — {clinicName} provides world-class dental care.",
      "From check-in to procedure completion, my visit to {clinicName}{servicePhrase} was flawless.",
      "I booked a consultation at {clinicName}{servicePhrase} and received top-notch dental service.",
      "Exceptionally professional and friendly dental team at {clinicName}{servicePhrase}."
    ],
    middles: [
      "The dentist was incredibly gentle, walked me through every step of the procedure, and ensured I was fully comfortable.",
      "The clinic is spotlessly clean, fully sanitized, and equipped with the latest modern digital dental technology.",
      "The procedure was completely pain-free, quick, and executed with utmost precision and care.",
      "They took high-definition digital scans, explained the exact treatment plan, and offered honest dental advice.",
      "The dental assistants and front-desk staff were polite, reassuring, and very helpful.",
      "Sterilization protocols are strictly followed here, which gave me complete peace of mind.",
      "Their cosmetic and restorative dental work is top-tier — my teeth feel healthier and look fantastic.",
      "Transparent pricing and clear post-treatment care instructions made the whole experience stress-free."
    ],
    closers: [
      "Easily the best dentist and dental clinic in the area — 5 stars for {clinicName}!",
      "I highly recommend {clinicName} to anyone looking for painless, professional, and reliable dental care.",
      "A truly wonderful dental clinic that puts patient comfort first. Thank you, {clinicName}!",
      "My go-to dental center for all future checkups and treatments. 10/10 for {clinicName}!",
      "Top-quality dental work with a gentle touch. Look no further than {clinicName} for your dental needs!",
      "Brilliant dentists and painless treatments — highest recommendation for {clinicName}."
    ]
  },
  'General Hospital': {
    openers: [
      "I had an exceptional experience at {clinicName}{servicePhrase} and received outstanding medical care.",
      "If you are searching for the best multi-specialty hospital, {clinicName} is definitely the top recommendation.",
      "The doctors and medical staff at {clinicName}{servicePhrase} provided prompt, compassionate, and expert care.",
      "My recent visit to {clinicName}{servicePhrase} was handled with remarkable efficiency and clinical excellence.",
      "I am extremely grateful to the entire healthcare team at {clinicName}{servicePhrase} for their timely support.",
      "From emergency response to inpatient care, {clinicName}{servicePhrase} delivers world-class hospital services.",
      "Hands down one of the best hospitals in the city — {clinicName} excels in patient-first healthcare.",
      "Visiting {clinicName}{servicePhrase} gave our family immense reassurance during a critical time.",
      "I was treated at {clinicName}{servicePhrase} and was deeply impressed by their modern infrastructure.",
      "Exceptional hospital facilities and dedicated doctors make {clinicName}{servicePhrase} stand out."
    ],
    middles: [
      "The doctors were very thorough in their diagnosis, explained the condition clearly, and gave timely medical attention.",
      "The hospital rooms and common areas are spotless, well-maintained, and follow rigorous cleanliness standards.",
      "The nursing staff was attentive around the clock, gentle with treatments, and quick to respond to every call.",
      "The admission, billing, and pharmacy workflows were smooth with minimal waiting time and clear communication.",
      "They are equipped with state-of-the-art medical technology, modern ICUs, and 24/7 emergency support.",
      "The multi-specialty coordination between different departments was seamless and reassuring.",
      "Every healthcare worker treated us with dignity, warmth, and genuine compassion.",
      "The medical team provided continuous updates and made sure our treatment was completely transparent."
    ],
    closers: [
      "Easily the best multi-specialty hospital in town — 5/5 stars for {clinicName}!",
      "I wholeheartedly recommend {clinicName} for reliable, high-quality, and compassionate healthcare.",
      "A hospital that truly prioritizes patient wellbeing above all else. Thank you, {clinicName}!",
      "Our family's most trusted hospital for all medical needs. 10/10 for {clinicName}!",
      "World-class doctors, clean hospital premises, and caring nurses. Highly recommend {clinicName}!",
      "Top-tier hospital with dedicated medical professionals. Truly grateful to {clinicName}."
    ]
  },
  'Orthopedics': {
    openers: [
      "I visited {clinicName}{servicePhrase} and received outstanding orthopedic care.",
      "If you are looking for the best orthopedician, {clinicName} is the top choice.",
      "Consulting {clinicName}{servicePhrase} was one of the best healthcare decisions for my joint and bone health.",
      "Had an exceptional experience at {clinicName}{servicePhrase} with quick relief from pain.",
      "I highly recommend {clinicName}{servicePhrase} for anyone dealing with bone, joint, or spine issues.",
      "My consultation at {clinicName}{servicePhrase} was smooth, reassuring, and gave me great results.",
      "Hands down the top orthopedic clinic in town — {clinicName} provides world-class care.",
      "From check-in to examination, my experience at {clinicName}{servicePhrase} was top-tier."
    ],
    middles: [
      "The orthopedic diagnosis was accurate and the treatment plan was explained with immense clarity and practical recovery steps.",
      "The doctors were extremely patient, gentle during examinations, and focused on lasting joint mobility and strength.",
      "The clinic is spotless, hygienic, and equipped with modern orthopedic examination facilities.",
      "The supportive staff ensured a smooth, comfortable consultation without any unnecessary waiting time.",
      "I noticed significant improvement in my movement and pain relief much sooner than expected.",
      "Every step of the treatment and home exercises was explained with genuine care and patience."
    ],
    closers: [
      "Easily the best orthopedic clinic in town — 5 stars for {clinicName}!",
      "I wholeheartedly recommend {clinicName} for reliable and compassionate orthopedic treatment.",
      "Outstanding bone and joint care with a personal touch. Thank you, {clinicName}!",
      "Will always trust {clinicName} for any future orthopedic needs. 10/10!",
      "Top-notch orthopedic treatment and wonderful staff. Highly recommended!"
    ]
  },
  'Pediatrics': {
    openers: [
      "I brought my child to {clinicName}{servicePhrase} and had a wonderful experience.",
      "If you are searching for the best pediatrician, {clinicName} is second to none.",
      "Consulting the pediatric specialists at {clinicName}{servicePhrase} was an incredibly reassuring experience for our family.",
      "Had a great pediatric visit at {clinicName}{servicePhrase} with gentle, caring attention.",
      "We cannot thank the doctors at {clinicName} enough for taking such wonderful care of our child{servicePhrase}.",
      "Visiting {clinicName}{servicePhrase} made my child completely comfortable and happy.",
      "Hands down the top children's clinic in town — {clinicName} is simply the best.",
      "My experience at {clinicName}{servicePhrase} exceeded all expectations for pediatric care."
    ],
    middles: [
      "The pediatrician was so gentle, patient, and made my child feel completely safe and at ease throughout the checkup.",
      "The doctor explained the diagnosis, nutrition, and vaccination schedule with great patience and clarity.",
      "The clinic environment is clean, child-friendly, hygienic, and very welcoming for families.",
      "The nursing staff was so polite, welcoming, and handled the procedures with extreme tenderness.",
      "We received practical guidance on child development and healthy recovery with genuine care.",
      "The doctor listened attentively to all our parenting questions without rushing."
    ],
    closers: [
      "Easily the best pediatrician and child clinic around — 5 stars for {clinicName}!",
      "I strongly recommend {clinicName} to every parent seeking the best care for their children.",
      "A trustworthy child clinic with truly compassionate doctors. Thank you, {clinicName}!",
      "10/10 recommendation for {clinicName} — the most caring pediatricians in the city.",
      "Wonderful experience for my little one. Look no further than {clinicName} for child healthcare!"
    ]
  }
};

const DOCTOR_SEO_TEMPLATES: Record<string, { openers: string[]; middles: string[]; closers: string[] }> = {
  'Pediatrics': {
    openers: [
      "I brought my child to {clinicName}{servicePhrase} and consulted {doctorName}.",
      "If you are searching for the best pediatrician, {doctorName} at {clinicName} is second to none.",
      "Consulting {doctorName} at {clinicName}{servicePhrase} was an incredibly reassuring experience for our family.",
      "Had a wonderful pediatric visit with {doctorName} at {clinicName}{servicePhrase}.",
      "Visiting {clinicName} to consult {doctorName}{servicePhrase} was the best healthcare decision for our little one.",
      "{doctorName} at {clinicName} provides truly compassionate, top-tier pediatric care{servicePhrase}.",
      "From the moment we arrived at {clinicName}{servicePhrase}, {doctorName} treated our child with exceptional warmth and care.",
      "I booked an appointment with {doctorName} at {clinicName}{servicePhrase} and the experience was truly five-star."
    ],
    middles: [
      "{doctorName} was remarkably gentle, patient, and made our little one feel completely safe throughout the checkup.",
      "{doctorName} listened attentively to all our parenting questions without rushing and explained the diagnosis with great clarity.",
      "The clinic is spotlessly clean, child-friendly, and {doctorName}'s calm bedside manner instantly put our baby at ease.",
      "{doctorName} gave us clear guidance on medication, nutrition, and recovery steps that worked wonders for our child.",
      "The nursing staff was polite and caring, and {doctorName}'s thorough examination gave our family complete peace of mind.",
      "We truly appreciate how {doctorName} took the time to answer every doubt with immense patience and medical expertise."
    ],
    closers: [
      "Easily the best child specialist in town — 5 stars for {doctorName} and {clinicName}!",
      "I strongly recommend {doctorName} to every parent seeking the best, most compassionate care for their children.",
      "A truly wonderful child clinic with dedicated doctors. Thank you, {doctorName} and {clinicName}!",
      "10/10 recommendation for {clinicName} — {doctorName} is our family's most trusted child specialist.",
      "Heartfelt gratitude to {doctorName} and the team at {clinicName} for their fantastic support.",
      "Wonderful experience for our little one. Look no further than {clinicName} for pediatric care!"
    ]
  },
  'Orthopedics': {
    openers: [
      "I consulted {doctorName} at {clinicName}{servicePhrase} and received outstanding orthopedic care.",
      "If you are looking for an experienced and trustworthy orthopedician, {doctorName} at {clinicName} is the top choice.",
      "Visiting {clinicName} to consult {doctorName}{servicePhrase} was one of the best healthcare decisions I have made.",
      "Had an exceptional consultation with {doctorName} at {clinicName}{servicePhrase} and experienced prompt pain relief.",
      "{doctorName} at {clinicName} provides top-tier orthopedic diagnosis and evidence-based treatment{servicePhrase}.",
      "My experience consulting {doctorName} at {clinicName}{servicePhrase} was smooth, reassuring, and gave me great recovery results.",
      "Hands down the top orthopedic specialist around — {doctorName} at {clinicName} provides world-class bone and joint care.",
      "I booked an appointment with {doctorName} at {clinicName}{servicePhrase} and the clinical attention was remarkable."
    ],
    middles: [
      "{doctorName} listened attentively to my pain concerns, performed a thorough physical examination, and explained the root cause clearly.",
      "{doctorName} took the time to explain my recovery roadmap without rushing into unnecessary tests or procedures.",
      "The clinic is modern, hygienic, and {doctorName}'s personalized treatment and exercise guidance helped restore my mobility rapidly.",
      "I felt completely reassured by {doctorName}'s clinical expertise, honest advice, and warm, patient demeanor.",
      "Every step of my recovery plan and medication was explained with immense clarity and practical daily care tips.",
      "The supportive staff ensured a prompt consultation and {doctorName} addressed all my questions with genuine care."
    ],
    closers: [
      "Easily the best orthopedic doctor in town — 5 stars for {doctorName} and {clinicName}!",
      "I wholeheartedly recommend {doctorName} to anyone dealing with joint, spine, or bone pain.",
      "A dedicated orthopedic specialist who truly cares about patient recovery. Thank you, {doctorName}!",
      "10/10 recommendation for {clinicName} — {doctorName} gave me lasting pain relief and renewed mobility.",
      "Outstanding clinical care with a personal touch. Will always trust {doctorName} and {clinicName} for orthopedic needs.",
      "Top-notch orthopedic care and wonderful clinic environment. Highly recommended!"
    ]
  },
  'General': {
    openers: [
      "I consulted {doctorName} at {clinicName}{servicePhrase} and received outstanding medical care.",
      "Visiting {clinicName} to see {doctorName}{servicePhrase} was a reassuring and positive healthcare experience.",
      "{doctorName} at {clinicName} is an exceptional doctor who truly prioritizes patient wellbeing{servicePhrase}.",
      "Had a wonderful consultation with {doctorName} at {clinicName}{servicePhrase}."
    ],
    middles: [
      "{doctorName} was thorough, attentive, and explained the entire treatment plan with great clarity.",
      "The clinic is clean, well-managed, and {doctorName} took adequate time to answer all my questions.",
      "{doctorName}'s compassionate bedside manner and clinical expertise gave me complete confidence."
    ],
    closers: [
      "Easily a 5-star experience — highly recommend {doctorName} and {clinicName}!",
      "I wholeheartedly recommend {doctorName} to anyone seeking trustworthy medical advice.",
      "Thank you to {doctorName} and the staff at {clinicName} for their wonderful care!"
    ]
  }
};

export function generateDynamicReview({ clinicName, category, serviceReceived, doctorName }: ReviewGeneratorParams): string {
  const normalizedCat = normalizeCategory(category);
  const servicePhrase = formatServicePhrase(serviceReceived);

  const hasDoctor = Boolean(doctorName && doctorName.trim());
  const template = hasDoctor
    ? (DOCTOR_SEO_TEMPLATES[normalizedCat] || DOCTOR_SEO_TEMPLATES['General'])
    : (CATEGORY_SEO_TEMPLATES[normalizedCat] || CATEGORY_SEO_TEMPLATES['General Hospital']);

  const openerRaw = pickRandom(template.openers);
  const middleRaw = pickRandom(template.middles);
  const closerRaw = pickRandom(template.closers);

  const applyReplacements = (str: string) =>
    str
      .replace(/{clinicName}/g, clinicName)
      .replace(/{doctorName}/g, (doctorName || '').trim())
      .replace(/{servicePhrase}/g, servicePhrase);

  const opener = applyReplacements(openerRaw);
  const middle = applyReplacements(middleRaw);
  const closer = applyReplacements(closerRaw);

  // 25% chance of punchy 2-sentence review vs 75% 3-sentence review
  if (Math.random() < 0.25) {
    return `${opener} ${closer}`;
  }

  return `${opener} ${middle} ${closer}`;
}
