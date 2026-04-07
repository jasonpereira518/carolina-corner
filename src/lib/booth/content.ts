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
      title: "Pick a door. Tell a story.",
      body: "Choose any available prompt. Completed prompts disappear from this screen.",
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
      id: "prompt-1",
      title: "Prompt 1",
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
      id: "prompt-2",
      title: "Prompt 2",
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
      id: "prompt-3",
      title: "Prompt 3",
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
  ],
};

export const promptById = Object.fromEntries(
  boothContent.prompts.map((prompt) => [prompt.id, prompt]),
);
