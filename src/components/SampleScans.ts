import { SkinAnalysisResponse, SkinType, Severity } from "../types";

export interface SampleScan {
  title: string;
  description: string;
  imageUrl: string;
  analysis: SkinAnalysisResponse;
}

export const SAMPLE_SCANS: SampleScan[] = [
  {
    title: "Oily & Acne-Prone",
    description: "T-zone shine, mild whiteheads and congested pores on forehead and chin.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400",
    analysis: {
      skinType: SkinType.Oily,
      overallScore: 68,
      assessment: "The scan reveals elevated sebum output primarily focused across the forehead, nose, and chin (the T-zone), coupled with mild acne lesions and congested pores. Your natural skin barrier remains strong, but could benefit from targeted sebum regulation and light, non-comedogenic hydration that won't clog pores. Remember, this feedback is educational; please consult a certified dermatologist for professional diagnosis.",
      detectedConcerns: [
        {
          concern: "Acne & Clogged Pores",
          severity: Severity.Moderate,
          visualEvidence: "Elevated micro-comedones on the forehead profile and small active papules on the chin.",
          details: "Acne occurs when hair follicles represent excess oil, dead skin, and bacteria buildup. Salicylic acid and zinc help clarify these zones safely."
        },
        {
          concern: "Redness",
          severity: Severity.Mild,
          visualEvidence: "Slight localized erythema (redness) around the nostrils and cheek apexes.",
          details: "Redness can suggest mild sensitivity or minor inflammation from overactive exfoliating ingredients. Barrier balancing is helpful."
        }
      ],
      commercialRecommendations: [
        {
          name: "Salicylic Acid 2% Exfoliating Cleanser",
          category: "Cleanser",
          activeIngredients: ["Salicylic Acid (BHA)", "Zinc PCA"],
          purpose: "Deeply penetrates follicle walls to dissolve lipid congestion, preventing blemishes while calming irritated skin.",
          howToUse: "Apply morning and evening. Massage gently on damp face for 60 seconds, then rinse. Follow with hydration.",
          searchQuery: "salicylic acid cleanser non comedogenic"
        },
        {
          name: "Niacinamide 10% & Zinc 1% Daily Serum",
          category: "Serum",
          activeIngredients: ["Niacinamide (Vitamin B3)", "Zinc PCA"],
          purpose: "Regulates sebum production, decreases look of pore size, and strengthens your skin barrier to reduce inflammation.",
          howToUse: "Apply 2-3 drops after cleansing in the morning and evening. Pat gently into the face and dry areas.",
          searchQuery: "niacinamide 10 zinc 1 serum"
        },
        {
          name: "Lightweight Hyaluronic Gel-Moisturizer",
          category: "Moisturizer",
          activeIngredients: ["Hyaluronic Acid", "Ceramides"],
          purpose: "Delivers weightless, oil-free water-based hydration to preserve the skin's moisture barrier without clogging pores.",
          howToUse: "Smooth over entire face as the last treatment step in PM, or before sunscreen in AM.",
          searchQuery: "oil free gel moisturizer hyaluronic acid"
        }
      ],
      naturalRecommendations: [
        {
          name: "Clarifying Green Tea & Honey Face Compress",
          ingredients: ["1 Organic Green Tea bag", "1 cup Hot Water", "1 tablespoon Raw Organic Honey"],
          purpose: "Green tea contains natural catechins that are clinically shown to reduce sebum gland activity and combat surface impurities, while raw honey delivers natural antibacterial soothing.",
          instructions: [
            "Steep the green tea bag in hot water for 5 minutes, then mix in the raw honey and allow the liquid to cool completely.",
            "Soak a clean washcloth or organic cotton pads in the mixture.",
            "Apply the damp compress to affected areas for 10-15 minutes.",
            "Rinse gently with cool water and dry with a fresh towel."
          ],
          precautions: "Perform a quick 10-minute forearm patch test with your raw honey to rule out any botanical allergies before full facial application."
        },
        {
          name: "Soothing Aloe & Tea Tree Spot Treatment",
          ingredients: ["2 tablespoons Pure Aloe Vera Gel", "1 drop Pure Tea Tree Essential Oil"],
          purpose: "Aloe moisturizes without grease, and a minute drop of diluted tea tree oil acts as a biological antiseptic to target localized spots.",
          instructions: [
            "Thoroughly blend the pure aloe vera gel and exactly one drop of tea tree oil in a tiny bowl.",
            "Use a clean cotton swab to apply a tiny dab directly onto congested blemish points.",
            "Leave on overnight and rinse off in the morning."
          ],
          precautions: "Do not exceed more than 1 drop of tea tree oil, as essential oil concentration can trigger stinging or sensitivity if over-applied."
        }
      ]
    }
  },
  {
    title: "Dry & Reactive",
    description: "Flakiness around cheeks and nose, generalized redness, dull or tight skin tone.",
    imageUrl: "https://images.unsplash.com/photo-1616391182219-e080b4d1043a?auto=format&fit=crop&q=80&w=400",
    analysis: {
      skinType: SkinType.Dry,
      overallScore: 59,
      assessment: "The scan displays elevated dryness with fine dehydration patterns along the upper cheeks, accompanied by mild flakiness and widespread sensitivity. Your lipid barrier is slightly compromised, permitting moisture to escape rapidly (Transepidermal Water Loss). Focus should be placed on heavy barrier repairs, ceramides, and avoiding harsh soaps. Keep in mind this is an educational assessment; a doctor can offer diagnostic prescriptions.",
      detectedConcerns: [
        {
          concern: "Flakiness & Dehydration",
          severity: Severity.Moderate,
          visualEvidence: "Slight superficial textured scales around the nasolabial folds and lateral cheeks.",
          details: "Dryness is caused by a lack of essential lipids and water content in the stratum corneum, the skin's surface outermost layer."
        },
        {
          concern: "Redness & Sensitivity",
          severity: Severity.Moderate,
          visualEvidence: "Symmetrical pink flushed tone throughout the central cheeks.",
          details: "Reactive capillaries expand when the defense barrier is weakened, allowing ambient irritants to activate inflammation path."
        }
      ],
      commercialRecommendations: [
        {
          name: "Gentle Hydrating Ceramide Cleanser",
          category: "Cleanser",
          activeIngredients: ["Ceramides (NP, AP, EOP)", "Glycerin", "Hyaluronic Acid"],
          purpose: "Cleanses makeup and daily debris without stripping away native lipids, leaving a light protective nourishing layer.",
          howToUse: "Massage onto damp skin AM/PM, rinse gently with lukewarm water. Pat dry—do not rub coarse towels.",
          searchQuery: "gentle hydrating ceramide cleanser"
        },
        {
          name: "Barrier Repair Cream with Centella",
          category: "Moisturizer",
          activeIngredients: ["Centella Asiatica (Cica)", "Panthenol (Pro-Vitamin B5)", "Squalane"],
          purpose: "Deeply seals in hydration, speeds up skin recovery, and reduces redness by replenishing lost intercellular fats.",
          howToUse: "Squeeze a dime-sized amount and warm it in clean palms. Gird your cheeks and forehead AM/PM.",
          searchQuery: "centella asiatica barrier repair cream"
        }
      ],
      naturalRecommendations: [
        {
          name: "Deeply Nourishing Colloidal Oatmeal & Yogurt Mask",
          ingredients: ["2 tablespoons finely ground Colloidal Oatmeal", "1 tablespoon Plain Unsweetened Grek Yogurt", "1 teaspoon Pure Honey"],
          purpose: "Oatmeal binds water molecules to the skin and supplies anti-itch avenanthramides; yogurt contains lactic acid which gently melts away dead micro-scales while fat content softens dry skin.",
          instructions: [
            "Combine the oatmeal, Greek yogurt, and honey in a clean dish until a unified spreadable paste forms.",
            "Apply in a thick, uniform layer over the face, entirely avoiding the direct eyelids.",
            "Leave in place for 15 minutes while relaxing.",
            "Gently soften the mask with warm damp fingers before sliding off, then rinse thoroughly. Never scrub."
          ],
          precautions: "Use fresh, plain unsweetened yogurt containing zero synthetic flavorings or food colorants to avert instant chemical breakouts."
        }
      ]
    }
  }
];
