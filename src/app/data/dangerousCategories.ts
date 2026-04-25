export const dangerousSiteCategories = [
  {
    category: 'Fake Shopping / Scam Stores',
    patternExamples: ['amazom.com', 'wal-mart-deals.net', 'bestbuy-clearance.shop'],
    whyDangerous:
      'Fake shopping sites steal credit card information and personal data through fake checkout pages. Orders are often never fulfilled, and payment details may be sold or reused for fraud.',
    securityIssues: [
      'No HTTPS or a suspiciously new SSL certificate',
      'No real business address or contact information',
      'Prices that are unrealistically low',
      'Domain was created recently',
      'Fake or generic customer reviews',
    ],
    saferAlternatives: [
      'https://amazon.com Trusted marketplace with buyer protection',
      'https://ebay.com Secure transactions and verified sellers',
      'https://walmart.com Established retailer with secure checkout',
      'https://target.com Trusted retailer with clear return policies',
    ],
  },
  {
    category: 'Free Streaming / Piracy Sites',
    patternExamples: ['123movies-free.net', 'putlocker-hd.io', 'fmovies-watch.com'],
    whyDangerous:
      'Free streaming and piracy sites often use malicious ads, fake download buttons, and fake update prompts to infect devices with malware or steal information.',
    securityIssues: [
      'Aggressive pop-up ads',
      'Fake browser or Flash update prompts',
      'Unexpected downloads',
      'Illegal or unlicensed content',
      'Frequent domain changes',
    ],
    saferAlternatives: [
      'https://netflix.com Legal streaming platform with strong account security',
      'https://hulu.com Legitimate streaming service with encrypted connections',
      'https://youtube.com Trusted video platform with security protections',
      'https://tubi.tv Free legal streaming service',
      'https://peacocktv.com Legal streaming platform from NBCUniversal',
    ],
  },
  {
    category: 'Free Software / Crack Sites',
    patternExamples: ['crackzsoft.net', 'free-adobe-crack.com', 'serialkeygen.io'],
    whyDangerous:
      'Crack and keygen sites commonly distribute malware hidden inside installers. These downloads can include ransomware, spyware, keyloggers, and trojans.',
    securityIssues: [
      'Executable files disguised as installers',
      'Requests to disable antivirus',
      'No verified publisher or code signing',
      'Bundled hidden software',
      'Password-protected zip files',
    ],
    saferAlternatives: [
      'https://ninite.com Safe installer for trusted free software',
      'https://softpedia.com Software downloads with review and safety checks',
    ],
  },
  {
    category: 'Fake Tech Support Sites',
    patternExamples: ['windows-support-alert.com', 'pc-virus-detected.net', 'microsoft-helpdesk.support'],
    whyDangerous:
      'Fake tech support sites use scary warnings to trick users into calling scam phone numbers or giving remote access to their computer.',
    securityIssues: [
      'Fake virus alerts',
      'Browser-locking messages',
      'Spoofed Microsoft or Apple branding',
      'Countdown timers or alarm sounds',
      'Requests for remote access tools',
    ],
    saferAlternatives: [
      'https://support.microsoft.com Official Microsoft support site',
      'https://apple.com/support Official Apple support site',
      'https://support.google.com Official Google help center',
    ],
  },
  {
    category: 'Fake Antivirus / Security Scanners',
    patternExamples: ['free-virus-scan-now.com', 'pc-cleaner-pro.net', 'onlinesecurityscan.io'],
    whyDangerous:
      'Fake antivirus sites pretend to scan your device from the browser, then scare you into downloading unsafe software or paying for fake protection.',
    securityIssues: [
      'Claims to scan your whole computer from a website',
      'Fake progress bars and infection results',
      'Downloads unknown executable files',
      'Imitates real security brands',
      'Pushes paid cleanup tools aggressively',
    ],
    saferAlternatives: [
      'https://malwarebytes.com Trusted malware removal and security tool',
      'https://avast.com Established antivirus provider',
      'https://microsoft.com/en-us/windows/comprehensive-security Microsoft Defender information',
    ],
  },
  {
    category: 'Phishing Login Pages',
    patternExamples: ['paypa1.com', 'secure-gmail-login.com', 'bankofamerica-verify.net'],
    whyDangerous:
      'Phishing login pages copy trusted websites to steal usernames, passwords, bank logins, and two-factor codes.',
    securityIssues: [
      'Misspelled brand names',
      'Brand name hidden inside a fake domain',
      'Urgent account verification messages',
      'Recently created login page',
      'Redirects to the real site after stealing credentials',
    ],
    saferAlternatives: [
      'Always type the URL directly into the address bar',
      "Use a password manager which won't autofill on fake domains",
    ],
  },
  {
    category: 'Fake Giveaway / Prize Sites',
    patternExamples: ['you-won-iphone.com', 'amazon-prize-claim.net', 'spin-to-win-gift.io'],
    whyDangerous:
      'Fake giveaway sites collect personal information, ask for payment details, or enroll users in hidden subscriptions under the promise of a prize.',
    securityIssues: [
      'Requires credit card info for a free prize',
      'Countdown timers creating urgency',
      'No real sponsor listed',
      'Vague terms and conditions',
      'Requests unnecessary personal details',
    ],
    saferAlternatives: [
      'Legitimate giveaways only run on verified brand social media accounts',
    ],
  },
  {
    category: 'Fake Crypto / Investment Platforms',
    patternExamples: ['bitcoin-doubler.io', 'crypto-guaranteed-returns.com', 'elon-musk-investment.net'],
    whyDangerous:
      'Fake crypto and investment sites promise guaranteed returns, steal deposits, and may ask for wallet seed phrases or private keys.',
    securityIssues: [
      'Promises guaranteed high returns',
      'Fake celebrity endorsements',
      'No regulatory information',
      'Withdrawals are delayed or blocked',
      'Requests wallet seed phrases or private keys',
    ],
    saferAlternatives: [
      'https://coinbase.com Established cryptocurrency exchange',
      'https://kraken.com Reputable crypto exchange with security features',
      'https://binance.com Large cryptocurrency exchange platform',
    ],
  },
  {
    category: 'Fake News / Misinformation Sites',
    patternExamples: ['abcnews.com.co', 'cnn-breaking.net', 'reuters-update.info'],
    whyDangerous:
      'Fake news sites spread misinformation, imitate trusted outlets, and may use aggressive ads or phishing links to collect user data.',
    securityIssues: [
      'Domain mimics a real news outlet',
      'No named authors or editorial team',
      'Sensational headlines',
      'Heavy ad redirects',
      'Missing dates or sources',
    ],
    saferAlternatives: [
      'https://apnews.com Trusted news wire service',
      'https://reuters.com International news organization',
      'https://bbc.com Established global news source',
      'https://npr.org Public media news source',
    ],
  },
  {
    category: 'Torrent / Illegal File Sharing Sites',
    patternExamples: ['thepiratebay-proxy.com', 'torrentz-mirror.io', 'rarbg-unblocked.net'],
    whyDangerous:
      'Torrent and illegal file-sharing sites often include malware-infected files, fake download buttons, malicious ads, and legal risks.',
    securityIssues: [
      'Files disguised with double extensions',
      'Fake high-seeder torrents',
      'Malicious ads',
      'No file verification',
      'Copyright/legal risk',
    ],
    saferAlternatives: [
      'https://spotify.com Legal music streaming',
      'https://store.steampowered.com Official PC game marketplace',
      'https://archive.org Legal public-domain and archival content',
      'https://youtube.com Legal video platform',
    ],
  },
  {
    category: 'Fake Online Pharmacy Sites',
    patternExamples: ['cheap-rx-meds.com', 'no-prescription-pharmacy.net', 'discount-pills-online.io'],
    whyDangerous:
      'Fake pharmacy sites may sell counterfeit or unsafe medication while also stealing payment and health information.',
    securityIssues: [
      'Offers prescription drugs without a prescription',
      'No licensed pharmacist listed',
      'Not verified by pharmacy safety organizations',
      'Prices far below normal market value',
      'Ships from unknown locations',
    ],
    saferAlternatives: [
      'https://cvs.com Licensed pharmacy and retail health provider',
      'https://walgreens.com Licensed pharmacy with secure checkout',
      'https://safe.pharmacy Pharmacy verification resource',
    ],
  },
  {
    category: 'Fake Job / Work From Home Sites',
    patternExamples: ['easy-cash-jobs.com', 'work-from-home-500daily.net', 'remote-hiring-now.io'],
    whyDangerous:
      'Fake job sites collect personal information, Social Security numbers, bank details, or upfront fees under the disguise of employment.',
    securityIssues: [
      'Job offer without an interview',
      'Requests sensitive info too early',
      'Upfront fees for training or equipment',
      'Unrealistic pay',
      'Communication only through personal emails',
    ],
    saferAlternatives: [
      'https://linkedin.com Professional job search and networking platform',
      'https://indeed.com Established job search platform',
      'https://glassdoor.com Job listings with employer reviews',
      'https://usajobs.gov Official U.S. government jobs portal',
    ],
  },
];