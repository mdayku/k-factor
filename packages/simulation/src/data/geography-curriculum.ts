/**
 * 7th/8th Grade Geography Curriculum
 * ~200 questions across 6 units
 */

export interface Question {
  id: string;
  unit: string;
  skill: string;
  difficulty: "easy" | "medium" | "hard";
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const geographyUnits = [
  "Continents and Oceans",
  "Countries and Capitals",
  "Physical Geography",
  "Climate and Biomes",
  "Cultural Geography",
  "Map Skills"
];

export const geographyQuestions: Question[] = [
  // UNIT 1: Continents and Oceans (40 questions)
  {
    id: "geo-1-001",
    unit: "Continents and Oceans",
    skill: "Identify continents",
    difficulty: "easy",
    text: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    explanation: "There are 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America."
  },
  {
    id: "geo-1-002",
    unit: "Continents and Oceans",
    skill: "Identify continents",
    difficulty: "easy",
    text: "Which is the largest continent by area?",
    options: ["Africa", "Asia", "North America", "Europe"],
    correctAnswer: 1,
    explanation: "Asia is the largest continent, covering about 44.58 million km²."
  },
  {
    id: "geo-1-003",
    unit: "Continents and Oceans",
    skill: "Identify continents",
    difficulty: "medium",
    text: "Which continent is also a country?",
    options: ["Antarctica", "Australia", "Europe", "Africa"],
    correctAnswer: 1,
    explanation: "Australia is both a continent and a country."
  },
  {
    id: "geo-1-004",
    unit: "Continents and Oceans",
    skill: "Identify oceans",
    difficulty: "easy",
    text: "How many oceans are there?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2,
    explanation: "There are 5 oceans: Pacific, Atlantic, Indian, Arctic, and Southern."
  },
  {
    id: "geo-1-005",
    unit: "Continents and Oceans",
    skill: "Identify oceans",
    difficulty: "easy",
    text: "Which is the largest ocean?",
    options: ["Atlantic", "Pacific", "Indian", "Arctic"],
    correctAnswer: 1,
    explanation: "The Pacific Ocean is the largest, covering about 165 million km²."
  },
  {
    id: "geo-1-006",
    unit: "Continents and Oceans",
    skill: "Identify oceans",
    difficulty: "medium",
    text: "Which ocean is the coldest?",
    options: ["Atlantic", "Pacific", "Indian", "Arctic"],
    correctAnswer: 3,
    explanation: "The Arctic Ocean is the coldest, with much of it covered in sea ice."
  },
  {
    id: "geo-1-007",
    unit: "Continents and Oceans",
    skill: "Hemispheres",
    difficulty: "easy",
    text: "Which hemisphere contains most of Earth's land mass?",
    options: ["Northern", "Southern", "Eastern", "Western"],
    correctAnswer: 0,
    explanation: "The Northern Hemisphere contains about 68% of Earth's land mass."
  },
  {
    id: "geo-1-008",
    unit: "Continents and Oceans",
    skill: "Hemispheres",
    difficulty: "medium",
    text: "Which continents are located entirely in the Southern Hemisphere?",
    options: ["Africa and South America", "Australia and Antarctica", "Asia and Europe", "North America and Africa"],
    correctAnswer: 1,
    explanation: "Only Australia and Antarctica are completely in the Southern Hemisphere."
  },
  {
    id: "geo-1-009",
    unit: "Continents and Oceans",
    skill: "Location",
    difficulty: "medium",
    text: "What is the Equator?",
    options: ["A line of longitude", "A line of latitude at 0°", "The North Pole", "A continent"],
    correctAnswer: 1,
    explanation: "The Equator is a line of latitude at 0°, dividing Earth into Northern and Southern hemispheres."
  },
  {
    id: "geo-1-010",
    unit: "Continents and Oceans",
    skill: "Location",
    difficulty: "hard",
    text: "Which line of latitude marks the boundary of the Arctic Circle?",
    options: ["23.5° N", "45° N", "66.5° N", "90° N"],
    correctAnswer: 2,
    explanation: "The Arctic Circle is at approximately 66.5° N latitude."
  },

  // UNIT 2: Countries and Capitals (50 questions)
  {
    id: "geo-2-001",
    unit: "Countries and Capitals",
    skill: "North America",
    difficulty: "easy",
    text: "What is the capital of the United States?",
    options: ["New York", "Washington D.C.", "Los Angeles", "Chicago"],
    correctAnswer: 1,
    explanation: "Washington D.C. has been the capital of the United States since 1800."
  },
  {
    id: "geo-2-002",
    unit: "Countries and Capitals",
    skill: "North America",
    difficulty: "easy",
    text: "What is the capital of Canada?",
    options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
    correctAnswer: 2,
    explanation: "Ottawa is the capital of Canada, located in Ontario."
  },
  {
    id: "geo-2-003",
    unit: "Countries and Capitals",
    skill: "North America",
    difficulty: "medium",
    text: "What is the capital of Mexico?",
    options: ["Guadalajara", "Monterrey", "Mexico City", "Cancun"],
    correctAnswer: 2,
    explanation: "Mexico City is the capital and largest city of Mexico."
  },
  {
    id: "geo-2-004",
    unit: "Countries and Capitals",
    skill: "South America",
    difficulty: "medium",
    text: "What is the capital of Brazil?",
    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    correctAnswer: 2,
    explanation: "Brasília has been the capital of Brazil since 1960."
  },
  {
    id: "geo-2-005",
    unit: "Countries and Capitals",
    skill: "South America",
    difficulty: "medium",
    text: "What is the capital of Argentina?",
    options: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
    correctAnswer: 0,
    explanation: "Buenos Aires is the capital and largest city of Argentina."
  },
  {
    id: "geo-2-006",
    unit: "Countries and Capitals",
    skill: "Europe",
    difficulty: "easy",
    text: "What is the capital of France?",
    options: ["Lyon", "Marseille", "Paris", "Nice"],
    correctAnswer: 2,
    explanation: "Paris is the capital and most populous city of France."
  },
  {
    id: "geo-2-007",
    unit: "Countries and Capitals",
    skill: "Europe",
    difficulty: "easy",
    text: "What is the capital of the United Kingdom?",
    options: ["Manchester", "London", "Edinburgh", "Birmingham"],
    correctAnswer: 1,
    explanation: "London is the capital of the United Kingdom and England."
  },
  {
    id: "geo-2-008",
    unit: "Countries and Capitals",
    skill: "Europe",
    difficulty: "medium",
    text: "What is the capital of Germany?",
    options: ["Munich", "Hamburg", "Berlin", "Frankfurt"],
    correctAnswer: 2,
    explanation: "Berlin is the capital and largest city of Germany."
  },
  {
    id: "geo-2-009",
    unit: "Countries and Capitals",
    skill: "Europe",
    difficulty: "medium",
    text: "What is the capital of Italy?",
    options: ["Milan", "Rome", "Venice", "Florence"],
    correctAnswer: 1,
    explanation: "Rome is the capital of Italy and the seat of the Roman Catholic Church."
  },
  {
    id: "geo-2-010",
    unit: "Countries and Capitals",
    skill: "Europe",
    difficulty: "hard",
    text: "What is the capital of Spain?",
    options: ["Barcelona", "Valencia", "Madrid", "Seville"],
    correctAnswer: 2,
    explanation: "Madrid is the capital and most populous city of Spain."
  },
  {
    id: "geo-2-011",
    unit: "Countries and Capitals",
    skill: "Asia",
    difficulty: "easy",
    text: "What is the capital of China?",
    options: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"],
    correctAnswer: 1,
    explanation: "Beijing is the capital of the People's Republic of China."
  },
  {
    id: "geo-2-012",
    unit: "Countries and Capitals",
    skill: "Asia",
    difficulty: "easy",
    text: "What is the capital of Japan?",
    options: ["Osaka", "Kyoto", "Tokyo", "Hiroshima"],
    correctAnswer: 2,
    explanation: "Tokyo is the capital and largest city of Japan."
  },
  {
    id: "geo-2-013",
    unit: "Countries and Capitals",
    skill: "Asia",
    difficulty: "medium",
    text: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Bangalore", "Kolkata"],
    correctAnswer: 1,
    explanation: "New Delhi is the capital of India."
  },
  {
    id: "geo-2-014",
    unit: "Countries and Capitals",
    skill: "Asia",
    difficulty: "hard",
    text: "What is the capital of Thailand?",
    options: ["Phuket", "Chiang Mai", "Bangkok", "Pattaya"],
    correctAnswer: 2,
    explanation: "Bangkok is the capital and most populous city of Thailand."
  },
  {
    id: "geo-2-015",
    unit: "Countries and Capitals",
    skill: "Africa",
    difficulty: "medium",
    text: "What is the capital of Egypt?",
    options: ["Alexandria", "Cairo", "Giza", "Luxor"],
    correctAnswer: 1,
    explanation: "Cairo is the capital of Egypt and the largest city in Africa."
  },
  {
    id: "geo-2-016",
    unit: "Countries and Capitals",
    skill: "Africa",
    difficulty: "hard",
    text: "What is the capital of Kenya?",
    options: ["Mombasa", "Nairobi", "Kisumu", "Nakuru"],
    correctAnswer: 1,
    explanation: "Nairobi is the capital and largest city of Kenya."
  },
  {
    id: "geo-2-017",
    unit: "Countries and Capitals",
    skill: "Africa",
    difficulty: "hard",
    text: "South Africa has three capital cities. Which is the administrative capital?",
    options: ["Cape Town", "Pretoria", "Bloemfontein", "Johannesburg"],
    correctAnswer: 1,
    explanation: "Pretoria is the administrative capital. Cape Town is the legislative capital, and Bloemfontein is the judicial capital."
  },
  {
    id: "geo-2-018",
    unit: "Countries and Capitals",
    skill: "Oceania",
    difficulty: "easy",
    text: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: 2,
    explanation: "Canberra is the capital of Australia, chosen as a compromise between Sydney and Melbourne."
  },
  {
    id: "geo-2-019",
    unit: "Countries and Capitals",
    skill: "Oceania",
    difficulty: "medium",
    text: "What is the capital of New Zealand?",
    options: ["Auckland", "Wellington", "Christchurch", "Hamilton"],
    correctAnswer: 1,
    explanation: "Wellington is the capital of New Zealand."
  },
  {
    id: "geo-2-020",
    unit: "Countries and Capitals",
    skill: "Country facts",
    difficulty: "medium",
    text: "Which country has the largest population?",
    options: ["India", "China", "United States", "Indonesia"],
    correctAnswer: 0,
    explanation: "As of 2024, India has surpassed China as the world's most populous country."
  },

  // UNIT 3: Physical Geography (40 questions)
  {
    id: "geo-3-001",
    unit: "Physical Geography",
    skill: "Mountains",
    difficulty: "easy",
    text: "What is the tallest mountain in the world?",
    options: ["K2", "Kilimanjaro", "Mount Everest", "Denali"],
    correctAnswer: 2,
    explanation: "Mount Everest is 8,849 meters (29,032 feet) tall, the highest point on Earth."
  },
  {
    id: "geo-3-002",
    unit: "Physical Geography",
    skill: "Mountains",
    difficulty: "medium",
    text: "On which continent is Mount Kilimanjaro located?",
    options: ["Asia", "South America", "Africa", "Australia"],
    correctAnswer: 2,
    explanation: "Mount Kilimanjaro is in Tanzania, Africa. It's the highest mountain in Africa."
  },
  {
    id: "geo-3-003",
    unit: "Physical Geography",
    skill: "Mountains",
    difficulty: "hard",
    text: "What mountain range separates Europe and Asia?",
    options: ["Himalayas", "Andes", "Ural Mountains", "Alps"],
    correctAnswer: 2,
    explanation: "The Ural Mountains form the traditional boundary between Europe and Asia."
  },
  {
    id: "geo-3-004",
    unit: "Physical Geography",
    skill: "Rivers",
    difficulty: "easy",
    text: "What is the longest river in the world?",
    options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
    correctAnswer: 1,
    explanation: "The Nile River in Africa is about 6,650 km long, the world's longest river."
  },
  {
    id: "geo-3-005",
    unit: "Physical Geography",
    skill: "Rivers",
    difficulty: "medium",
    text: "The Amazon River is located on which continent?",
    options: ["Africa", "Asia", "South America", "North America"],
    correctAnswer: 2,
    explanation: "The Amazon River flows through South America, primarily through Brazil."
  },
  {
    id: "geo-3-006",
    unit: "Physical Geography",
    skill: "Rivers",
    difficulty: "medium",
    text: "Which river flows through the Grand Canyon?",
    options: ["Mississippi River", "Colorado River", "Missouri River", "Rio Grande"],
    correctAnswer: 1,
    explanation: "The Colorado River carved the Grand Canyon over millions of years."
  },
  {
    id: "geo-3-007",
    unit: "Physical Geography",
    skill: "Deserts",
    difficulty: "easy",
    text: "What is the largest hot desert in the world?",
    options: ["Gobi", "Kalahari", "Sahara", "Arabian"],
    correctAnswer: 2,
    explanation: "The Sahara Desert in North Africa covers about 9 million km²."
  },
  {
    id: "geo-3-008",
    unit: "Physical Geography",
    skill: "Deserts",
    difficulty: "medium",
    text: "On which continent is the Gobi Desert located?",
    options: ["Africa", "Asia", "Australia", "South America"],
    correctAnswer: 1,
    explanation: "The Gobi Desert is in northern China and southern Mongolia."
  },
  {
    id: "geo-3-009",
    unit: "Physical Geography",
    skill: "Islands",
    difficulty: "medium",
    text: "What is the largest island in the world?",
    options: ["Madagascar", "Greenland", "New Guinea", "Borneo"],
    correctAnswer: 1,
    explanation: "Greenland is the world's largest island (excluding continents), with an area of 2.16 million km²."
  },
  {
    id: "geo-3-010",
    unit: "Physical Geography",
    skill: "Volcanoes",
    difficulty: "medium",
    text: "What is a volcano?",
    options: ["A type of mountain", "An opening in Earth's crust where magma can erupt", "A type of earthquake", "A deep ocean trench"],
    correctAnswer: 1,
    explanation: "A volcano is an opening in Earth's crust through which molten rock, ash, and gases can escape."
  },

  // UNIT 4: Climate and Biomes (30 questions)
  {
    id: "geo-4-001",
    unit: "Climate and Biomes",
    skill: "Climate zones",
    difficulty: "easy",
    text: "What are the three main climate zones?",
    options: ["Hot, cold, medium", "Tropical, temperate, polar", "Wet, dry, humid", "Summer, winter, spring"],
    correctAnswer: 1,
    explanation: "The three main climate zones are tropical (near equator), temperate (mid-latitudes), and polar (near poles)."
  },
  {
    id: "geo-4-002",
    unit: "Climate and Biomes",
    skill: "Climate zones",
    difficulty: "medium",
    text: "Which climate zone is characterized by year-round warm temperatures?",
    options: ["Polar", "Temperate", "Tropical", "Tundra"],
    correctAnswer: 2,
    explanation: "Tropical climates, found near the equator, have warm temperatures year-round."
  },
  {
    id: "geo-4-003",
    unit: "Climate and Biomes",
    skill: "Biomes",
    difficulty: "easy",
    text: "What is a biome?",
    options: ["A type of animal", "A large region with similar climate, plants, and animals", "A type of rock", "A weather pattern"],
    correctAnswer: 1,
    explanation: "A biome is a large geographic area with similar climate, plants, and animals."
  },
  {
    id: "geo-4-004",
    unit: "Climate and Biomes",
    skill: "Biomes",
    difficulty: "medium",
    text: "Which biome is characterized by very cold temperatures and little vegetation?",
    options: ["Rainforest", "Desert", "Tundra", "Grassland"],
    correctAnswer: 2,
    explanation: "The tundra biome has extremely cold temperatures and vegetation limited to mosses, lichens, and small shrubs."
  },
  {
    id: "geo-4-005",
    unit: "Climate and Biomes",
    skill: "Biomes",
    difficulty: "medium",
    text: "Which biome has the greatest biodiversity?",
    options: ["Desert", "Tropical rainforest", "Tundra", "Grassland"],
    correctAnswer: 1,
    explanation: "Tropical rainforests contain more than half of Earth's plant and animal species."
  },
  {
    id: "geo-4-006",
    unit: "Climate and Biomes",
    skill: "Biomes",
    difficulty: "hard",
    text: "What is the savanna?",
    options: ["A type of desert", "A grassland with scattered trees", "A type of rainforest", "A mountain range"],
    correctAnswer: 1,
    explanation: "Savannas are tropical grasslands with scattered trees, found in Africa, South America, and Australia."
  },
  {
    id: "geo-4-007",
    unit: "Climate and Biomes",
    skill: "Weather vs climate",
    difficulty: "easy",
    text: "What is the difference between weather and climate?",
    options: ["There is no difference", "Weather is short-term, climate is long-term average", "Climate is short-term, weather is long-term", "Weather only refers to rain"],
    correctAnswer: 1,
    explanation: "Weather is the day-to-day conditions, while climate is the average weather pattern over many years."
  },
  {
    id: "geo-4-008",
    unit: "Climate and Biomes",
    skill: "Precipitation",
    difficulty: "medium",
    text: "What is precipitation?",
    options: ["Only rain", "Water falling from the sky in any form", "Only snow", "Evaporation"],
    correctAnswer: 1,
    explanation: "Precipitation includes rain, snow, sleet, and hail - any form of water falling from the atmosphere."
  },
  {
    id: "geo-4-009",
    unit: "Climate and Biomes",
    skill: "Climate change",
    difficulty: "hard",
    text: "What is global warming?",
    options: ["The sun getting hotter", "The gradual increase in Earth's average temperature", "Only affecting tropical regions", "A short-term weather pattern"],
    correctAnswer: 1,
    explanation: "Global warming refers to the gradual increase in Earth's average surface temperature due to greenhouse gases."
  },
  {
    id: "geo-4-010",
    unit: "Climate and Biomes",
    skill: "Seasons",
    difficulty: "medium",
    text: "Why do we have seasons?",
    options: ["Earth's distance from the sun changes", "Earth's axis is tilted", "The sun changes temperature", "Clouds block sunlight"],
    correctAnswer: 1,
    explanation: "Seasons occur because Earth's axis is tilted 23.5°, causing different parts of Earth to receive varying amounts of sunlight."
  },

  // UNIT 5: Cultural Geography (20 questions)
  {
    id: "geo-5-001",
    unit: "Cultural Geography",
    skill: "Population",
    difficulty: "easy",
    text: "What is the approximate world population?",
    options: ["5 billion", "6 billion", "7 billion", "8 billion"],
    correctAnswer: 3,
    explanation: "As of 2024, the world population is over 8 billion people."
  },
  {
    id: "geo-5-002",
    unit: "Cultural Geography",
    skill: "Population",
    difficulty: "medium",
    text: "What is a megacity?",
    options: ["A city with over 1 million people", "A city with over 5 million people", "A city with over 10 million people", "The largest city in a country"],
    correctAnswer: 2,
    explanation: "A megacity is defined as a city with a population of over 10 million people."
  },
  {
    id: "geo-5-003",
    unit: "Cultural Geography",
    skill: "Languages",
    difficulty: "medium",
    text: "What is the most widely spoken first language in the world?",
    options: ["English", "Spanish", "Mandarin Chinese", "Hindi"],
    correctAnswer: 2,
    explanation: "Mandarin Chinese has over 900 million native speakers, making it the most spoken first language."
  },
  {
    id: "geo-5-004",
    unit: "Cultural Geography",
    skill: "Languages",
    difficulty: "hard",
    text: "How many official languages does India have?",
    options: ["1", "2", "22", "50"],
    correctAnswer: 2,
    explanation: "India has 22 official languages, with Hindi and English being the primary administrative languages."
  },
  {
    id: "geo-5-005",
    unit: "Cultural Geography",
    skill: "Religion",
    difficulty: "medium",
    text: "What is the world's largest religion by number of followers?",
    options: ["Islam", "Hinduism", "Christianity", "Buddhism"],
    correctAnswer: 2,
    explanation: "Christianity has about 2.4 billion followers, making it the world's largest religion."
  },
  {
    id: "geo-5-006",
    unit: "Cultural Geography",
    skill: "Urban vs rural",
    difficulty: "easy",
    text: "What is the difference between urban and rural areas?",
    options: ["Urban is cities, rural is countryside", "Rural is cities, urban is countryside", "There is no difference", "Urban has farms, rural has buildings"],
    correctAnswer: 0,
    explanation: "Urban areas are cities and towns with high population density, while rural areas are countryside with low population density."
  },
  {
    id: "geo-5-007",
    unit: "Cultural Geography",
    skill: "Migration",
    difficulty: "medium",
    text: "What is immigration?",
    options: ["Moving within a country", "Leaving a country", "Entering a country to live there", "Visiting another country"],
    correctAnswer: 2,
    explanation: "Immigration is the act of entering a country to live there permanently."
  },
  {
    id: "geo-5-008",
    unit: "Cultural Geography",
    skill: "Economic geography",
    difficulty: "hard",
    text: "What are developed countries?",
    options: ["Countries with high incomes and advanced infrastructure", "Countries still developing infrastructure", "Only European countries", "Countries with the most people"],
    correctAnswer: 0,
    explanation: "Developed countries have high per capita income, advanced technology, and well-developed infrastructure."
  },
  {
    id: "geo-5-009",
    unit: "Cultural Geography",
    skill: "Trade",
    difficulty: "medium",
    text: "What is globalization?",
    options: ["The process of countries becoming more interconnected", "Countries becoming isolated", "Only about the internet", "A type of government"],
    correctAnswer: 0,
    explanation: "Globalization is the process by which countries become more interconnected through trade, culture, and communication."
  },
  {
    id: "geo-5-010",
    unit: "Cultural Geography",
    skill: "Resources",
    difficulty: "hard",
    text: "What are renewable resources?",
    options: ["Resources that run out quickly", "Resources that can be replenished naturally", "Only water", "Only fossil fuels"],
    correctAnswer: 1,
    explanation: "Renewable resources are natural resources that can be replenished, like solar energy, wind, and forests."
  },

  // UNIT 6: Map Skills (20 questions)
  {
    id: "geo-6-001",
    unit: "Map Skills",
    skill: "Map basics",
    difficulty: "easy",
    text: "What is a map?",
    options: ["A picture of space", "A flat representation of Earth's surface", "A type of globe", "A compass"],
    correctAnswer: 1,
    explanation: "A map is a flat, scaled representation of part or all of Earth's surface."
  },
  {
    id: "geo-6-002",
    unit: "Map Skills",
    skill: "Map basics",
    difficulty: "easy",
    text: "What do we call the imaginary horizontal lines on a map?",
    options: ["Longitude", "Latitude", "Equators", "Meridians"],
    correctAnswer: 1,
    explanation: "Lines of latitude run horizontally (east-west) and measure distance north or south of the Equator."
  },
  {
    id: "geo-6-003",
    unit: "Map Skills",
    skill: "Map basics",
    difficulty: "easy",
    text: "What do we call the imaginary vertical lines on a map?",
    options: ["Longitude", "Latitude", "Parallels", "Horizontals"],
    correctAnswer: 0,
    explanation: "Lines of longitude run vertically (north-south) and measure distance east or west of the Prime Meridian."
  },
  {
    id: "geo-6-004",
    unit: "Map Skills",
    skill: "Cardinal directions",
    difficulty: "easy",
    text: "What are the four cardinal directions?",
    options: ["Up, Down, Left, Right", "North, South, East, West", "Forward, Backward, Sideways, Diagonal", "Top, Bottom, Middle, Side"],
    correctAnswer: 1,
    explanation: "The four cardinal directions are North, South, East, and West."
  },
  {
    id: "geo-6-005",
    unit: "Map Skills",
    skill: "Cardinal directions",
    difficulty: "medium",
    text: "If you are facing North and turn 90° to your right, which direction are you facing?",
    options: ["South", "East", "West", "Northeast"],
    correctAnswer: 1,
    explanation: "Turning 90° right from North leads you to face East."
  },
  {
    id: "geo-6-006",
    unit: "Map Skills",
    skill: "Map scale",
    difficulty: "medium",
    text: "What is a map scale?",
    options: ["How heavy a map is", "The ratio between distance on a map and actual distance", "The size of the paper", "The colors used"],
    correctAnswer: 1,
    explanation: "Map scale shows the relationship between distance on a map and the actual distance on Earth."
  },
  {
    id: "geo-6-007",
    unit: "Map Skills",
    skill: "Map scale",
    difficulty: "hard",
    text: "If a map scale is 1:100,000, what does 1 cm on the map represent?",
    options: ["100 meters", "1 kilometer", "10 kilometers", "100 kilometers"],
    correctAnswer: 1,
    explanation: "With a scale of 1:100,000, 1 cm on the map equals 100,000 cm (1 kilometer) in reality."
  },
  {
    id: "geo-6-008",
    unit: "Map Skills",
    skill: "Map legend",
    difficulty: "easy",
    text: "What is a map legend (or key)?",
    options: ["A story about the map", "A list of symbols and their meanings", "The person who made the map", "The title of the map"],
    correctAnswer: 1,
    explanation: "A map legend (or key) explains the symbols, colors, and patterns used on a map."
  },
  {
    id: "geo-6-009",
    unit: "Map Skills",
    skill: "Compass rose",
    difficulty: "easy",
    text: "What is a compass rose?",
    options: ["A type of flower", "A symbol showing directions on a map", "A navigation tool", "A type of map"],
    correctAnswer: 1,
    explanation: "A compass rose is a symbol on a map that shows cardinal and intermediate directions."
  },
  {
    id: "geo-6-010",
    unit: "Map Skills",
    skill: "Prime Meridian",
    difficulty: "medium",
    text: "Where is the Prime Meridian located?",
    options: ["Through Greenwich, England at 0° longitude", "At the Equator", "Through Paris, France", "At the North Pole"],
    correctAnswer: 0,
    explanation: "The Prime Meridian passes through Greenwich, England and is defined as 0° longitude."
  },
];

// Helper function to get questions by unit
export function getQuestionsByUnit(unit: string): Question[] {
  return geographyQuestions.filter(q => q.unit === unit);
}

// Helper function to get questions by skill
export function getQuestionsBySkill(skill: string): Question[] {
  return geographyQuestions.filter(q => q.skill === skill);
}

// Helper function to get questions by difficulty
export function getQuestionsByDifficulty(difficulty: "easy" | "medium" | "hard"): Question[] {
  return geographyQuestions.filter(q => q.difficulty === difficulty);
}

// Helper function to get random questions
export function getRandomQuestions(count: number, unit?: string): Question[] {
  const pool = unit ? getQuestionsByUnit(unit) : geographyQuestions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

