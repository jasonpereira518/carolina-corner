import { BoothContent } from "@/lib/booth/types";

export const boothContent: BoothContent = {
  theme: {
    appName: "Carolina Corner",
    logoWordmark: "CAROLINA CORNER",
    colors: {
      sky: "#4B9CD3",
      navy: "#13294B",
      cream: "#F8F4E8",
      ink: "#1A2433",
    },
  },
  recordingSecondsLimit: 120,
  promptCategories: [
    {
      id: "belonging",
      label: "Home",
      description: "Moments and places where you feel grounded, seen, and at home.",
      phaseTone: "coral",
    },
    {
      id: "courage",
      label: "Courage",
      description: "Stories about risk, growth, and stepping into uncertainty.",
      phaseTone: "moss",
    },
    {
      id: "life-story",
      label: "Self",
      description: "Big-picture reflections about your journey so far.",
      phaseTone: "pine",
    },
  ],
  copy: {
    welcome: {
      eyebrow: "Welcome to Carolina Corner",
      title: "Share a story that only you can tell.",
      body: "This is a reflective booth experience for Chapel Hill. Honest answers matter more than perfect answers.",
      bulletList: [
        "Pick one prompt.",
        "Record your response.",
        "Get your video in your inbox.",
      ],
      cta: "Continue",
    },
    userInfo: {
      title: "A quick check-in before we start",
      body: "We only collect what we need to send your recording and understand participation.",
      fields: {
        firstName: "First name",
        onyen: "UNC ONYEN",
        email: "Email address",
      },
      cta: "Next",
    },
    decline: {
      title: "No pressure at all.",
      body: "Come back when the timing is better. Carolina Corner will still be here.",
      cta: "Back to start",
    },
    prompts: {
      title: "Choose a category. Get a surprise prompt.",
      body: "Each category has a prompt bank. We’ll randomly choose one for you when you click.",
      skipCta: "No thanks",
    },
    emailComing: {
      title: "Your story is on the way.",
      body: "Watch your inbox. If this brought up something meaningful, consider connecting with UNC support resources.",
      cta: "Finish up",
    },
    goodbye: {
      title: "See you next time.",
      body: "The booth stays open. Your answer can change every time you return.",
      quoteAuthor: "Ralph Waldo Emerson",
    },
  },
  legal: {
    title: "Legal release",
    intro:
      "Before proceeding, please review these terms and decide whether you want to continue.",
    sections: [
      {
        heading: "Eligibility and accuracy",
        body: "You confirm you are at least 18 years old and the information provided is your own.",
      },
      {
        heading: "How your information is used",
        body: "We collect your name, ONYEN, email, session metadata, prompt choices, and recording to operate the experience and evaluate participation in aggregate.",
      },
      {
        heading: "Vendors and collaboration",
        body: "Authorized vendors may help store recordings and deliver emails. University teams may use participation insights for program learning and improvement.",
      },
      {
        heading: "Voluntary participation",
        body: "Proceeding is voluntary. You may stop at any time by leaving the experience.",
      },
      {
        heading: "Release",
        body: "By continuing, you agree to the terms shown here. Final legal language should be replaced with UNC-approved copy before launch.",
      },
    ],
    agreement:
      "If you continue, you confirm that you read, understand, and agree to these terms.",
  },
  prompts: [
    {
      id: "belonging-1",
      categoryId: "belonging",
      title: "Home Prompt",
      revealText: "Where in Chapel Hill do you feel most at home? Where can you be your fullest self?",
      quoteText:
        "The ache for home lives in all of us, the safe place where we can go as we are.",
      quoteAuthor: "Maya Angelou",
      previewGuidance: "When you are ready, press start and speak naturally.",
      reviewHeadline: "Amazing. Really amazing.",
      reviewBody: "Submit if this feels true, or try again. Unrehearsed answers are good answers.",
      phaseTone: "coral",
    },
    {
      id: "belonging-2",
      categoryId: "belonging",
      title: "Home Prompt",
      revealText:
        "Tell a story about someone who helped you feel like you belonged when you needed it most.",
      quoteText:
        "I sustain myself with the love of family.",
      quoteAuthor: "Maya Angelou",
      previewGuidance: "Let the details lead. Start when you are ready.",
      reviewHeadline: "That was powerful.",
      reviewBody: "Submit or try again. Both choices are welcome.",
      phaseTone: "coral",
    },
    {
      id: "belonging-3",
      categoryId: "belonging",
      title: "Home Prompt",
      revealText:
        "What tradition, ritual, or place helps you reconnect with yourself?",
      quoteText:
        "Belonging starts with self-acceptance.",
      quoteAuthor: "Brene Brown",
      previewGuidance: "Share one moment that says it all.",
      reviewHeadline: "Beautifully shared.",
      reviewBody: "Submit if it feels right, or try another take.",
      phaseTone: "coral",
    },
    {
      id: "courage-1",
      categoryId: "courage",
      title: "Courage Prompt",
      revealText:
        "When did you take a real risk, challenge your own assumptions, or choose courage over comfort?",
      quoteText: "Transformation is not accomplished by tentative wading at the edge.",
      quoteAuthor: "Robin Wall Kimmerer",
      previewGuidance: "Take a breath and begin. Your real voice is enough.",
      reviewHeadline: "Thanks for sharing that story.",
      reviewBody: "Submit or re-record. Either way, no judgment.",
      phaseTone: "moss",
    },
    {
      id: "courage-2",
      categoryId: "courage",
      title: "Courage Prompt",
      revealText:
        "Describe a time you changed your mind after truly listening to someone else.",
      quoteText:
        "The willingness to show up changes us.",
      quoteAuthor: "Brene Brown",
      previewGuidance: "Focus on the turning point in your story.",
      reviewHeadline: "Thank you for sharing that.",
      reviewBody: "Submit now, or refine it with another recording.",
      phaseTone: "moss",
    },
    {
      id: "courage-3",
      categoryId: "courage",
      title: "Courage Prompt",
      revealText:
        "Tell a story about a moment when you acted before you felt fully ready.",
      quoteText:
        "Fortune sides with those who dare.",
      quoteAuthor: "Virgil",
      previewGuidance: "One honest moment is enough. Press start when ready.",
      reviewHeadline: "That took courage.",
      reviewBody: "You can submit this or take another pass.",
      phaseTone: "moss",
    },
    {
      id: "life-story-1",
      categoryId: "life-story",
      title: "Self Prompt",
      revealText: "What is the two-minute version of your life story?",
      quoteText:
        "What matters in life is not what happens to you, but what you remember and how you remember it.",
      quoteAuthor: "Gabriel Garcia Marquez",
      previewGuidance:
        "Stutters, pauses, and revisions are welcome. Start when you are ready.",
      reviewHeadline: "Well done.",
      reviewBody: "There is no perfect answer. Submit or take another pass.",
      phaseTone: "pine",
    },
    {
      id: "life-story-2",
      categoryId: "life-story",
      title: "Self Prompt",
      revealText:
        "If someone met you for the first time today, what chapter of your story are you in?",
      quoteText:
        "We are all stories in the end.",
      quoteAuthor: "Steven Moffat",
      previewGuidance: "Start with your chapter title, then explain why.",
      reviewHeadline: "That landed really well.",
      reviewBody: "Submit now or try one more version.",
      phaseTone: "pine",
    },
    {
      id: "life-story-3",
      categoryId: "life-story",
      title: "Self Prompt",
      revealText:
        "What is one experience that changed how you see yourself?",
      quoteText:
        "Memory is the diary we all carry about with us.",
      quoteAuthor: "Oscar Wilde",
      previewGuidance: "Keep it real. Start whenever you are ready.",
      reviewHeadline: "Well said.",
      reviewBody: "Submit if this captures it, or record again.",
      phaseTone: "pine",
    },
  ],
};

export const promptById = Object.fromEntries(
  boothContent.prompts.map((prompt) => [prompt.id, prompt]),
);
