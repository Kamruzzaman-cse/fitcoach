/*
  Exercise library.
  - name: kept in English (gym machines are called by English names in Bangladesh too)
  - muscle / steps: bilingual { en, bn }
  - equipment: machine | cable | dumbbell | barbell | bodyweight
  - alts: ids of exercises that work the same muscle (used for "Swap" when a machine is busy)
  - type: 'reps' (default) or 'time' (plank, cardio)
*/
export const MUSCLES = {
  chest: { en: 'Chest', bn: 'বুক' },
  shoulders: { en: 'Shoulders', bn: 'কাঁধ' },
  triceps: { en: 'Triceps', bn: 'ট্রাইসেপ' },
  back: { en: 'Back', bn: 'পিঠ' },
  biceps: { en: 'Biceps', bn: 'বাইসেপ' },
  legs: { en: 'Legs', bn: 'পা' },
  core: { en: 'Core', bn: 'পেট' },
  cardio: { en: 'Cardio', bn: 'কার্ডিও' }
}

export const EQUIPMENT = {
  machine: { en: 'Machine', bn: 'মেশিন' },
  cable: { en: 'Cable', bn: 'কেবল' },
  dumbbell: { en: 'Dumbbell', bn: 'ডাম্বেল' },
  barbell: { en: 'Barbell', bn: 'বারবেল' },
  bodyweight: { en: 'Bodyweight', bn: 'শরীরের ওজন' }
}

export const EXERCISES = [
  // ---------- CHEST ----------
  {
    id: 'chest_press_machine', name: 'Chest Press Machine', group: 'chest', equipment: 'machine',
    target: { en: 'Chest, front shoulders, triceps', bn: 'বুক, কাঁধের সামনে, ট্রাইসেপ' },
    steps: {
      en: ['Set the seat so the handles line up with the middle of your chest.', 'Keep your back on the pad and push forward.', 'Do not fully lock your elbows; return slowly.'],
      bn: ['সিট এমনভাবে ঠিক করো যাতে হ্যান্ডেল বুকের মাঝ বরাবর থাকে।', 'পিঠ প্যাডে লাগিয়ে সামনে ঠেলো।', 'কনুই পুরো লক করবে না, ধীরে ফেরত আনো।']
    },
    alts: ['db_bench_press', 'push_up']
  },
  {
    id: 'incline_chest_press_machine', name: 'Incline Chest Press Machine', group: 'chest', equipment: 'machine',
    target: { en: 'Upper chest', bn: 'বুকের উপরের অংশ' },
    steps: {
      en: ['Sit on the incline seat with your back flat.', 'Press up and slightly forward.', 'Take 2–3 seconds to lower.'],
      bn: ['হেলানো সিটে পিঠ সোজা রেখে বসো।', 'উপরের দিকে কোনাকুনি ঠেলো।', 'নামানোর সময় ২–৩ সেকেন্ড সময় নাও।']
    },
    alts: ['incline_db_press', 'push_up']
  },
  {
    id: 'pec_deck', name: 'Pec Deck (Chest Fly)', group: 'chest', equipment: 'machine',
    target: { en: 'Chest', bn: 'বুক' },
    steps: {
      en: ['Keep a slight bend in your elbows.', 'Bring the handles together in front of you.', 'Squeeze your chest for 1 second, then open slowly.'],
      bn: ['কনুই সামান্য বাঁকা রাখো।', 'হ্যান্ডেল সামনে একসাথে আনো।', '১ সেকেন্ড বুক চেপে ধরো, তারপর ধীরে খোলো।']
    },
    alts: ['db_fly', 'cable_crossover']
  },
  {
    id: 'cable_crossover', name: 'Cable Crossover', group: 'chest', equipment: 'cable',
    target: { en: 'Chest', bn: 'বুক' },
    steps: {
      en: ['Set both pulleys high and step forward.', 'Pull the handles down and together in an arc.', 'Control the way back.'],
      bn: ['দুই পাশের পুলি উঁচুতে সেট করে এক পা সামনে দাঁড়াও।', 'হ্যান্ডেল বাঁকা পথে নিচে ও একসাথে আনো।', 'ফেরার সময় নিয়ন্ত্রণ রাখো।']
    },
    alts: ['pec_deck', 'db_fly']
  },
  {
    id: 'db_bench_press', name: 'Dumbbell Bench Press', group: 'chest', equipment: 'dumbbell',
    target: { en: 'Chest, triceps', bn: 'বুক, ট্রাইসেপ' },
    steps: {
      en: ['Lie on a flat bench, dumbbells at chest level.', 'Press up until arms are almost straight.', 'Lower slowly to chest level.'],
      bn: ['ফ্ল্যাট বেঞ্চে শুয়ে ডাম্বেল বুকের পাশে রাখো।', 'হাত প্রায় সোজা হওয়া পর্যন্ত উপরে ঠেলো।', 'ধীরে বুক বরাবর নামাও।']
    },
    alts: ['chest_press_machine', 'push_up']
  },
  {
    id: 'incline_db_press', name: 'Incline Dumbbell Press', group: 'chest', equipment: 'dumbbell',
    target: { en: 'Upper chest', bn: 'বুকের উপরের অংশ' },
    steps: {
      en: ['Set the bench to 30–45 degrees.', 'Press the dumbbells up over your upper chest.', 'Lower with control.'],
      bn: ['বেঞ্চ ৩০–৪৫ ডিগ্রিতে হেলাও।', 'ডাম্বেল বুকের উপরের অংশ বরাবর উপরে ঠেলো।', 'নিয়ন্ত্রণ রেখে নামাও।']
    },
    alts: ['incline_chest_press_machine', 'push_up']
  },
  {
    id: 'db_fly', name: 'Dumbbell Fly', group: 'chest', equipment: 'dumbbell',
    target: { en: 'Chest', bn: 'বুক' },
    steps: {
      en: ['Lie on a bench, arms up with a slight bend.', 'Open your arms wide until you feel a stretch.', 'Bring them back together over your chest.'],
      bn: ['বেঞ্চে শুয়ে হাত সামান্য বাঁকা রেখে উপরে তোলো।', 'বুকে টান লাগা পর্যন্ত দুই পাশে খোলো।', 'আবার বুকের উপর একসাথে আনো।']
    },
    alts: ['pec_deck', 'cable_crossover']
  },
  {
    id: 'push_up', name: 'Push-up', group: 'chest', equipment: 'bodyweight',
    target: { en: 'Chest, triceps, core', bn: 'বুক, ট্রাইসেপ, পেট' },
    steps: {
      en: ['Hands slightly wider than shoulders, body straight.', 'Lower your chest close to the floor.', 'Push back up. Use your knees if needed.'],
      bn: ['হাত কাঁধের চেয়ে একটু চওড়া, শরীর সোজা।', 'বুক মেঝের কাছাকাছি নামাও।', 'আবার উপরে ঠেলো। কঠিন হলে হাঁটু মাটিতে রাখো।']
    },
    alts: ['chest_press_machine', 'db_bench_press']
  },

  // ---------- SHOULDERS ----------
  {
    id: 'shoulder_press_machine', name: 'Shoulder Press Machine', group: 'shoulders', equipment: 'machine',
    target: { en: 'Shoulders, triceps', bn: 'কাঁধ, ট্রাইসেপ' },
    steps: {
      en: ['Set the seat so handles are at shoulder height.', 'Press overhead, keep your back on the pad.', 'Lower to shoulder level.'],
      bn: ['সিট এমনভাবে ঠিক করো যাতে হ্যান্ডেল কাঁধের উচ্চতায় থাকে।', 'মাথার উপরে ঠেলো, পিঠ প্যাডে লাগানো রাখো।', 'কাঁধ বরাবর নামাও।']
    },
    alts: ['db_shoulder_press', 'push_up']
  },
  {
    id: 'lateral_raise_machine', name: 'Lateral Raise Machine', group: 'shoulders', equipment: 'machine',
    target: { en: 'Side shoulders (width)', bn: 'কাঁধের পাশ (চওড়া কাঁধ)' },
    steps: {
      en: ['Rest your elbows on the pads.', 'Raise your arms out to shoulder height.', 'Lower slowly. Light weight is enough.'],
      bn: ['কনুই প্যাডে রাখো।', 'দুই পাশে কাঁধ সমান পর্যন্ত তোলো।', 'ধীরে নামাও। হালকা ওজনই যথেষ্ট।']
    },
    alts: ['db_lateral_raise']
  },
  {
    id: 'rear_delt_machine', name: 'Rear Delt Fly Machine', group: 'shoulders', equipment: 'machine',
    target: { en: 'Rear shoulders, upper back', bn: 'কাঁধের পেছন, পিঠের উপরের অংশ' },
    steps: {
      en: ['Sit facing the pec deck pad.', 'Keep arms straight and pull back out to the sides.', 'Squeeze your upper back, return slowly.'],
      bn: ['Pec Deck মেশিনে প্যাডের দিকে মুখ করে বসো।', 'হাত সোজা রেখে দুই পাশে পেছনে টানো।', 'পিঠের উপরের অংশ চেপে ধরো, ধীরে ফেরত আনো।']
    },
    alts: ['db_rear_delt_raise']
  },
  {
    id: 'db_shoulder_press', name: 'Dumbbell Shoulder Press', group: 'shoulders', equipment: 'dumbbell',
    target: { en: 'Shoulders, triceps', bn: 'কাঁধ, ট্রাইসেপ' },
    steps: {
      en: ['Sit with back support, dumbbells at shoulder height.', 'Press overhead without arching your back.', 'Lower to ear level.'],
      bn: ['পিঠে সাপোর্ট নিয়ে বসো, ডাম্বেল কাঁধের উচ্চতায়।', 'কোমর বাঁকা না করে মাথার উপরে ঠেলো।', 'কানের কাছ পর্যন্ত নামাও।']
    },
    alts: ['shoulder_press_machine']
  },
  {
    id: 'db_lateral_raise', name: 'Dumbbell Lateral Raise', group: 'shoulders', equipment: 'dumbbell',
    target: { en: 'Side shoulders', bn: 'কাঁধের পাশ' },
    steps: {
      en: ['Stand with dumbbells at your sides.', 'Raise out to shoulder height, elbows slightly bent.', 'Lower slowly, no swinging.'],
      bn: ['ডাম্বেল দুই পাশে ধরে দাঁড়াও।', 'কনুই সামান্য বাঁকা রেখে কাঁধ সমান তোলো।', 'দোল না খেয়ে ধীরে নামাও।']
    },
    alts: ['lateral_raise_machine']
  },
  {
    id: 'db_rear_delt_raise', name: 'Bent-over Dumbbell Raise', group: 'shoulders', equipment: 'dumbbell',
    target: { en: 'Rear shoulders', bn: 'কাঁধের পেছন' },
    steps: {
      en: ['Hinge forward with a flat back.', 'Raise the dumbbells out to the sides.', 'Lower with control.'],
      bn: ['পিঠ সোজা রেখে সামনে ঝুঁকে দাঁড়াও।', 'ডাম্বেল দুই পাশে তোলো।', 'নিয়ন্ত্রণ রেখে নামাও।']
    },
    alts: ['rear_delt_machine']
  },

  // ---------- TRICEPS ----------
  {
    id: 'cable_pushdown', name: 'Cable Triceps Pushdown', group: 'triceps', equipment: 'cable',
    target: { en: 'Triceps', bn: 'ট্রাইসেপ (হাতের পেছন)' },
    steps: {
      en: ['Attach a bar or rope to a high pulley.', 'Keep elbows pinned to your sides.', 'Push down until arms are straight.'],
      bn: ['উঁচু পুলিতে রড বা দড়ি লাগাও।', 'কনুই শরীরের পাশে স্থির রাখো।', 'হাত সোজা হওয়া পর্যন্ত নিচে চাপো।']
    },
    alts: ['overhead_db_extension', 'bench_dip']
  },
  {
    id: 'overhead_db_extension', name: 'Overhead Dumbbell Extension', group: 'triceps', equipment: 'dumbbell',
    target: { en: 'Triceps', bn: 'ট্রাইসেপ' },
    steps: {
      en: ['Hold one dumbbell overhead with both hands.', 'Lower it behind your head by bending the elbows.', 'Extend back up.'],
      bn: ['দুই হাতে একটা ডাম্বেল মাথার উপরে ধরো।', 'কনুই ভাঁজ করে মাথার পেছনে নামাও।', 'আবার সোজা করে উপরে তোলো।']
    },
    alts: ['cable_pushdown', 'bench_dip']
  },
  {
    id: 'bench_dip', name: 'Bench Dip', group: 'triceps', equipment: 'bodyweight',
    target: { en: 'Triceps', bn: 'ট্রাইসেপ' },
    steps: {
      en: ['Hands on a bench behind you, legs forward.', 'Bend elbows to lower your body.', 'Push back up.'],
      bn: ['পেছনে বেঞ্চে হাত রাখো, পা সামনে।', 'কনুই ভাঁজ করে শরীর নামাও।', 'আবার উপরে ঠেলো।']
    },
    alts: ['cable_pushdown', 'overhead_db_extension']
  },

  // ---------- BACK ----------
  {
    id: 'lat_pulldown', name: 'Lat Pulldown', group: 'back', equipment: 'machine',
    target: { en: 'Lats (back width), biceps', bn: 'পিঠ (চওড়া পিঠ), বাইসেপ' },
    steps: {
      en: ['Grip the bar slightly wider than shoulders, knees under the pad.', 'Lift your chest and pull the bar to your upper chest.', 'Let it rise slowly.'],
      bn: ['কাঁধের চেয়ে একটু চওড়া করে রড ধরো, হাঁটু প্যাডের নিচে।', 'বুক একটু উঁচু করে রড বুকের উপরের দিকে টানো।', 'ধীরে উপরে যেতে দাও।']
    },
    alts: ['assisted_pullup', 'db_row']
  },
  {
    id: 'seated_cable_row', name: 'Seated Cable Row', group: 'back', equipment: 'cable',
    target: { en: 'Middle back', bn: 'পিঠের মাঝখান' },
    steps: {
      en: ['Feet on the plate, back straight.', 'Pull the handle to your stomach.', 'Squeeze your shoulder blades together.'],
      bn: ['পা প্লেটে রেখে পিঠ সোজা করে বসো।', 'হ্যান্ডেল পেটের দিকে টানো।', 'কাঁধের হাড় পেছনে চেপে ধরো।']
    },
    alts: ['db_row', 'chest_supported_row']
  },
  {
    id: 'chest_supported_row', name: 'Chest-supported Row Machine', group: 'back', equipment: 'machine',
    target: { en: 'Middle and upper back', bn: 'পিঠের মাঝখান ও উপরের অংশ' },
    steps: {
      en: ['Rest your chest on the pad.', 'Pull the handles back using your back, not your hips.', 'Return slowly.'],
      bn: ['বুক প্যাডে লাগাও।', 'কোমর দিয়ে দোল না খেয়ে শুধু পিঠ দিয়ে হ্যান্ডেল পেছনে টানো।', 'ধীরে ফেরত আনো।']
    },
    alts: ['barbell_row', 'db_row']
  },
  {
    id: 'assisted_pullup', name: 'Assisted Pull-up', group: 'back', equipment: 'machine',
    target: { en: 'Lats, biceps', bn: 'পিঠ, বাইসেপ' },
    steps: {
      en: ['Kneel on the assist pad, grip the bar.', 'Pull your chin above the bar.', 'Lower all the way down.'],
      bn: ['সাপোর্ট প্যাডে হাঁটু রেখে রড ধরো।', 'থুতনি রডের উপরে তোলো।', 'পুরোটা নিচে নামো।']
    },
    alts: ['lat_pulldown', 'db_row']
  },
  {
    id: 'db_row', name: 'One-arm Dumbbell Row', group: 'back', equipment: 'dumbbell',
    target: { en: 'Back, biceps', bn: 'পিঠ, বাইসেপ' },
    steps: {
      en: ['One hand and knee on a bench, back flat.', 'Pull the dumbbell to your hip.', 'Lower with control.'],
      bn: ['এক হাত আর এক হাঁটু বেঞ্চে রাখো, পিঠ সোজা।', 'ডাম্বেল কোমরের দিকে টানো।', 'নিয়ন্ত্রণ রেখে নামাও।']
    },
    alts: ['seated_cable_row', 'chest_supported_row']
  },
  {
    id: 'barbell_row', name: 'Barbell Row', group: 'back', equipment: 'barbell',
    target: { en: 'Whole back', bn: 'পুরো পিঠ' },
    steps: {
      en: ['Hinge forward with a flat back, bar hanging.', 'Pull the bar to your lower chest.', 'Lower without rounding your back.'],
      bn: ['পিঠ সোজা রেখে সামনে ঝুঁকো, রড ঝুলিয়ে ধরো।', 'রড বুকের নিচের দিকে টানো।', 'পিঠ গোল না করে নামাও।']
    },
    alts: ['chest_supported_row', 'db_row']
  },

  // ---------- BICEPS ----------
  {
    id: 'biceps_curl_machine', name: 'Biceps Curl Machine', group: 'biceps', equipment: 'machine',
    target: { en: 'Biceps', bn: 'বাইসেপ' },
    steps: {
      en: ['Rest the back of your arms fully on the pad.', 'Curl up and squeeze for 1 second.', 'Lower slowly.'],
      bn: ['বাহুর পেছন প্যাডে পুরো লাগিয়ে রাখো।', 'উপরে তুলে ১ সেকেন্ড চেপে ধরো।', 'ধীরে নামাও।']
    },
    alts: ['db_curl']
  },
  {
    id: 'cable_hammer_curl', name: 'Cable Hammer Curl', group: 'biceps', equipment: 'cable',
    target: { en: 'Biceps, forearms', bn: 'বাইসেপ, কব্জির উপরের অংশ' },
    steps: {
      en: ['Attach a rope to a low pulley, palms facing each other.', 'Curl up with elbows fixed.', 'Lower with control.'],
      bn: ['নিচের পুলিতে দড়ি লাগিয়ে দুই তালু মুখোমুখি রেখে ধরো।', 'কনুই স্থির রেখে উপরে তোলো।', 'নিয়ন্ত্রণ রেখে নামাও।']
    },
    alts: ['db_hammer_curl']
  },
  {
    id: 'db_curl', name: 'Dumbbell Curl', group: 'biceps', equipment: 'dumbbell',
    target: { en: 'Biceps', bn: 'বাইসেপ' },
    steps: {
      en: ['Stand tall, palms facing forward.', 'Curl without swinging your body.', 'Lower all the way.'],
      bn: ['সোজা দাঁড়াও, তালু সামনের দিকে।', 'শরীর না দুলিয়ে উপরে তোলো।', 'পুরোটা নামাও।']
    },
    alts: ['biceps_curl_machine']
  },
  {
    id: 'db_hammer_curl', name: 'Dumbbell Hammer Curl', group: 'biceps', equipment: 'dumbbell',
    target: { en: 'Biceps, forearms', bn: 'বাইসেপ, কব্জি' },
    steps: {
      en: ['Hold dumbbells with palms facing each other.', 'Curl up, elbows by your sides.', 'Lower slowly.'],
      bn: ['তালু মুখোমুখি রেখে ডাম্বেল ধরো।', 'কনুই পাশে রেখে উপরে তোলো।', 'ধীরে নামাও।']
    },
    alts: ['cable_hammer_curl']
  },

  // ---------- LEGS ----------
  {
    id: 'leg_press', name: 'Leg Press', group: 'legs', equipment: 'machine',
    target: { en: 'Quads, hamstrings, glutes', bn: 'উরুর সামনে, পেছন, নিতম্ব' },
    steps: {
      en: ['Feet shoulder-width on the platform.', 'Lower until knees reach about 90 degrees.', 'Push back up without locking your knees.'],
      bn: ['পা প্লেটে কাঁধ সমান ফাঁক করে রাখো।', 'হাঁটু ৯০ ডিগ্রি পর্যন্ত নামাও।', 'হাঁটু লক না করে আবার ঠেলো।']
    },
    alts: ['goblet_squat', 'bulgarian_split_squat']
  },
  {
    id: 'leg_extension', name: 'Leg Extension', group: 'legs', equipment: 'machine',
    target: { en: 'Quads (front thigh)', bn: 'উরুর সামনের অংশ' },
    steps: {
      en: ['Place the pad just above your ankles.', 'Straighten your legs and hold 1 second.', 'Lower slowly.'],
      bn: ['প্যাড গোড়ালির ঠিক উপরে রাখো।', 'পা সোজা করে ১ সেকেন্ড ধরো।', 'ধীরে নামাও।']
    },
    alts: ['bulgarian_split_squat', 'goblet_squat']
  },
  {
    id: 'leg_curl', name: 'Leg Curl Machine', group: 'legs', equipment: 'machine',
    target: { en: 'Hamstrings (back thigh)', bn: 'উরুর পেছনের অংশ' },
    steps: {
      en: ['Lie or sit with the pad behind your ankles.', 'Curl your heels toward your hips.', 'Lower with control.'],
      bn: ['শুয়ে বা বসে প্যাড গোড়ালির পেছনে রাখো।', 'গোড়ালি নিতম্বের দিকে ভাঁজ করে আনো।', 'নিয়ন্ত্রণ রেখে নামাও।']
    },
    alts: ['db_rdl']
  },
  {
    id: 'calf_raise_machine', name: 'Calf Raise Machine', group: 'legs', equipment: 'machine',
    target: { en: 'Calves', bn: 'পায়ের গুল (কাফ)' },
    steps: {
      en: ['Balls of your feet on the edge of the platform.', 'Rise as high as you can.', 'Lower for a full stretch.'],
      bn: ['পায়ের সামনের অংশ প্লেটের কিনারায় রাখো।', 'গোড়ালি যতটা পারো উপরে তোলো।', 'নিচে পুরো স্ট্রেচ করো।']
    },
    alts: ['standing_calf_raise'], reps: 'high'
  },
  {
    id: 'goblet_squat', name: 'Goblet Squat', group: 'legs', equipment: 'dumbbell',
    target: { en: 'Quads, glutes', bn: 'উরু, নিতম্ব' },
    steps: {
      en: ['Hold a dumbbell at your chest.', 'Sit down between your heels, chest up.', 'Stand back up through your heels.'],
      bn: ['একটা ডাম্বেল বুকের সামনে ধরো।', 'বুক উঁচু রেখে নিচে বসো।', 'গোড়ালিতে ভর দিয়ে উঠে দাঁড়াও।']
    },
    alts: ['leg_press', 'bulgarian_split_squat']
  },
  {
    id: 'bulgarian_split_squat', name: 'Bulgarian Split Squat', group: 'legs', equipment: 'dumbbell',
    target: { en: 'Quads, glutes', bn: 'উরু, নিতম্ব' },
    steps: {
      en: ['Rear foot on a bench, front foot forward.', 'Lower your back knee toward the floor.', 'Push up through the front heel.'],
      bn: ['পেছনের পা বেঞ্চে, সামনের পা এগিয়ে রাখো।', 'পেছনের হাঁটু মেঝের দিকে নামাও।', 'সামনের গোড়ালিতে ভর দিয়ে ওঠো।']
    },
    alts: ['leg_press', 'goblet_squat']
  },
  {
    id: 'db_rdl', name: 'Dumbbell Romanian Deadlift', group: 'legs', equipment: 'dumbbell',
    target: { en: 'Hamstrings, glutes, lower back', bn: 'উরুর পেছন, নিতম্ব, কোমর' },
    steps: {
      en: ['Stand with dumbbells in front of your thighs.', 'Push your hips back, back flat, slight knee bend.', 'Stand up by squeezing your glutes.'],
      bn: ['ডাম্বেল উরুর সামনে ধরে দাঁড়াও।', 'পিঠ সোজা রেখে নিতম্ব পেছনে ঠেলে ঝুঁকো।', 'নিতম্ব চেপে সোজা হয়ে দাঁড়াও।']
    },
    alts: ['leg_curl']
  },
  {
    id: 'standing_calf_raise', name: 'Standing Calf Raise (step)', group: 'legs', equipment: 'bodyweight',
    target: { en: 'Calves', bn: 'পায়ের গুল' },
    steps: {
      en: ['Stand on a step with heels hanging off.', 'Rise up on your toes.', 'Lower below the step.'],
      bn: ['সিঁড়িতে দাঁড়াও, গোড়ালি বাইরে ঝুলিয়ে।', 'আঙুলে ভর দিয়ে উপরে ওঠো।', 'সিঁড়ির নিচ পর্যন্ত নামাও।']
    },
    alts: ['calf_raise_machine'], reps: 'high'
  },

  // ---------- CORE ----------
  {
    id: 'cable_crunch', name: 'Cable Crunch', group: 'core', equipment: 'cable',
    target: { en: 'Abs', bn: 'পেট (অ্যাবস)' },
    steps: {
      en: ['Kneel and hold the rope beside your head.', 'Crunch down by curling your spine.', 'Do not pull with your arms.'],
      bn: ['হাঁটু গেড়ে বসে দড়ি মাথার পাশে ধরো।', 'পেট কুঁচকে নিচের দিকে নামো।', 'হাত দিয়ে টানবে না।']
    },
    alts: ['plank', 'leg_raise'], reps: 'high'
  },
  {
    id: 'plank', name: 'Plank', group: 'core', equipment: 'bodyweight', type: 'time',
    target: { en: 'Core', bn: 'পেট ও কোমর' },
    steps: {
      en: ['Forearms on the floor, body in a straight line.', 'Tighten your stomach and glutes.', 'Hold, breathing normally.'],
      bn: ['কনুই মেঝেতে, শরীর এক সরলরেখায়।', 'পেট আর নিতম্ব টাইট রাখো।', 'স্বাভাবিক শ্বাস নিয়ে ধরে রাখো।']
    },
    alts: ['cable_crunch', 'leg_raise']
  },
  {
    id: 'leg_raise', name: 'Lying Leg Raise', group: 'core', equipment: 'bodyweight',
    target: { en: 'Lower abs', bn: 'পেটের নিচের অংশ' },
    steps: {
      en: ['Lie flat, hands under your hips.', 'Raise straight legs to 90 degrees.', 'Lower slowly without touching the floor.'],
      bn: ['চিত হয়ে শুয়ে হাত নিতম্বের নিচে রাখো।', 'পা সোজা রেখে ৯০ ডিগ্রি পর্যন্ত তোলো।', 'মেঝে না ছুঁয়ে ধীরে নামাও।']
    },
    alts: ['cable_crunch', 'plank'], reps: 'high'
  },

  // ---------- CARDIO ----------
  {
    id: 'incline_walk', name: 'Incline Treadmill Walk', group: 'cardio', equipment: 'machine', type: 'time',
    target: { en: 'Fat loss, heart health', bn: 'চর্বি কমানো, হার্টের স্বাস্থ্য' },
    steps: {
      en: ['Set incline to 8–12% and speed to 4.5–5.5 km/h.', 'Walk without holding the handrails.', 'Keep a pace where talking is a little hard.'],
      bn: ['ঢাল ৮–১২% আর গতি ৪.৫–৫.৫ কিমি/ঘণ্টা দাও।', 'হাতল না ধরে হাঁটো।', 'এমন গতিতে হাঁটো যাতে কথা বলতে একটু কষ্ট হয়।']
    },
    alts: []
  }
]

export const EX_BY_ID = Object.fromEntries(EXERCISES.map(e => [e.id, e]))

export const youtubeLink = name => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(name + ' proper form')
export const imageLink = name => 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(name + ' gym')
