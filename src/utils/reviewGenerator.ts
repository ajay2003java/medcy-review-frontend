export interface ReviewGeneratorParams {
  clinicName: string;
  category: string;
  serviceReceived?: string | null;
}

function normalizeCategory(category: string): string {
  const cat = category.toLowerCase().replace(/[-_]/g, ' ');
  if (cat.includes('dermatol') || cat.includes('skin')) return 'Dermatology';
  if (cat.includes('ivf') || cat.includes('fertil')) return 'IVF';
  if (cat.includes('gynec') || cat.includes('matern') || cat.includes('women')) return 'Gynecology';
  if (cat.includes('dent')) return 'Dentist';
  if (cat.includes('lab') || cat.includes('diagnost') || cat.includes('pathol')) return 'Laboratory';
  if (cat.includes('hosp') || cat.includes('general')) return 'General Hospital';
  return category;
}

function cleanServicePhrase(service?: string | null): string {
  if (!service) return '';
  let s = service.trim();
  if (s.toLowerCase().startsWith('other:')) {
    s = s.substring(6).trim();
  }
  if (!s) return '';
  const parts = s.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  if (parts.length > 2) return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
  return s;
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
  }
};

export function generateDynamicReview({ clinicName, category, serviceReceived }: ReviewGeneratorParams): string {
  const normalizedCat = normalizeCategory(category);
  const template = CATEGORY_SEO_TEMPLATES[normalizedCat] || CATEGORY_SEO_TEMPLATES['General Hospital'];

  const cleanService = cleanServicePhrase(serviceReceived);
  const servicePhrase = cleanService ? ` for my ${cleanService}` : '';

  const openerRaw = pickRandom(template.openers);
  const middleRaw = pickRandom(template.middles);
  const closerRaw = pickRandom(template.closers);

  const opener = openerRaw.replace(/{clinicName}/g, clinicName).replace(/{servicePhrase}/g, servicePhrase);
  const middle = middleRaw.replace(/{clinicName}/g, clinicName).replace(/{servicePhrase}/g, servicePhrase);
  const closer = closerRaw.replace(/{clinicName}/g, clinicName).replace(/{servicePhrase}/g, servicePhrase);

  // 25% chance of punchy 2-sentence review vs 75% 3-sentence review
  if (Math.random() < 0.25) {
    return `${opener} ${closer}`;
  }

  return `${opener} ${middle} ${closer}`;
}
